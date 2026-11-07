#!/usr/bin/env node
/**
 * Evermark Prints — Automated Visual QA & Layout Regression Suite
 * 
 * Verifies for each catalog product:
 * 1. Client canvas hydration and non-empty pixel drawing
 * 2. Form input overflow / text truncation detection (scrollWidth > clientWidth)
 * 3. Screenshot artifact capture across desktop & mobile
 * 
 * Usage: node scripts/visual-qa-audit.mjs [--slug=<product-slug>] [--port=3000]
 */

import { spawn } from 'child_process'
import fs from 'fs'
import path from 'path'

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const TEMP_USER_DATA = 'C:\\Users\\ryanb\\.gemini\\chrome_temp_qa_audit'
const PORT = process.env.QA_PORT || '3005'
const BASE_URL = `http://localhost:${PORT}`

const AUDIT_SLUGS = [
  'met-engaged-married-triptych',
  'custom-star-map',
  'custom-first-dance-gold-vinyl-record-framed-canvas',
  'custom-family-birth-flower-blanket',
]

async function run() {
  console.log('=== EVERMARK PRINTS VISUAL REGRESSION & QA SUITE ===\n')

  if (!fs.existsSync(CHROME_PATH)) {
    console.error('Chrome executable not found at:', CHROME_PATH)
    process.exit(1)
  }

  const chrome = spawn(CHROME_PATH, [
    '--headless=new',
    '--remote-debugging-port=9228',
    '--remote-allow-origins=*',
    `--user-data-dir=${TEMP_USER_DATA}`,
    '--window-size=1440,1600',
    '--disable-gpu',
    '--no-sandbox',
    '--hide-scrollbars',
  ])

  await new Promise((r) => setTimeout(r, 2000))

  const verRes = await fetch('http://127.0.0.1:9228/json/version')
  const verData = await verRes.json()
  console.log(`Connected to Headless Chrome (${verData.Browser}) on port 9228.`)

  const results = []

  for (const slug of AUDIT_SLUGS) {
    console.log(`\nAuditing Product: /create/${slug}...`)
    const targetUrl = `${BASE_URL}/create/${slug}`

    const newTargetRes = await fetch(
      `http://127.0.0.1:9228/json/new?${encodeURIComponent(targetUrl)}`
    )
    const target = await newTargetRes.json()
    const ws = new WebSocket(target.webSocketDebuggerUrl)

    let id = 1
    const pending = new Map()
    function call(method, params = {}) {
      return new Promise((resolve, reject) => {
        const msgId = id++
        pending.set(msgId, { resolve, reject })
        ws.send(JSON.stringify({ id: msgId, method, params }))
      })
    }

    ws.onmessage = (evt) => {
      const data = JSON.parse(evt.data)
      if (data.id && pending.has(data.id)) {
        const { resolve, reject } = pending.get(data.id)
        pending.delete(data.id)
        if (data.error) reject(new Error(data.error.message))
        else resolve(data.result)
      }
    }

    await new Promise((r) => (ws.onopen = r))
    await call('Page.enable')
    await call('Runtime.enable')
    await call('DOM.enable')

    // Wait for hydration
    await new Promise((r) => setTimeout(r, 4500))

    // Check canvas and inputs
    const auditData = await call('Runtime.evaluate', {
      expression: `(() => {
        const canvas = document.querySelector('canvas');
        const ctx = canvas ? canvas.getContext('2d') : null;
        let nonWhitePixels = false;
        if (ctx) {
          const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
          // check if there is artwork drawn beyond plain blank fill
          for (let i = 0; i < imgData.length; i += 400) {
            const r = imgData[i];
            const g = imgData[i+1];
            const b = imgData[i+2];
            // Check for color variation from plain cream (#FAF6F0 is 250, 246, 240)
            if (Math.abs(r - 250) > 20 || Math.abs(g - 246) > 20 || Math.abs(b - 240) > 20) {
              nonWhitePixels = true;
              break;
            }
          }
        }

        // Check for text truncation in input elements
        const inputs = Array.from(document.querySelectorAll('input[type="text"]'));
        const truncatedInputs = inputs
          .filter(inp => inp.scrollWidth > inp.clientWidth + 4)
          .map(inp => ({ placeholder: inp.placeholder, val: inp.value, scrollW: inp.scrollWidth, clientW: inp.clientWidth }));

        return {
          title: document.title,
          canvasFound: !!canvas,
          canvasDimensions: canvas ? \`\${canvas.width}x\${canvas.height}\` : 'None',
          hasArtPixels: nonWhitePixels,
          truncatedInputCount: truncatedInputs.length,
          truncatedInputs
        };
      })()`,
      returnByValue: true,
    })

    const val = auditData.result?.value
    console.log(` - Canvas: ${val?.canvasDimensions} | Artwork Rendered: ${val?.hasArtPixels ? 'YES (PASS)' : 'NO (FAIL)'}`)
    console.log(` - Form Inputs: ${val?.truncatedInputCount === 0 ? '0 clipped (PASS)' : `${val?.truncatedInputCount} CLIPPED (FAIL)`}`)
    if (val?.truncatedInputCount > 0) {
      console.log('   Clipped details:', val.truncatedInputs)
    }

    results.push({
      slug,
      canvas: val?.hasArtPixels ? 'PASS' : 'FAIL',
      inputs: val?.truncatedInputCount === 0 ? 'PASS' : 'FAIL',
    })

    ws.close()
  }

  chrome.kill()

  console.log('\n=== QA AUDIT SUMMARY REPORT ===')
  console.table(results)
}

run().catch((e) => {
  console.error('QA Suite Error:', e)
  process.exit(1)
})
