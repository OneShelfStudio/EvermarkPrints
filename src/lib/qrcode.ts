import QRCode from 'qrcode'

export interface QrMatrixResult {
  size: number
  isDark: (row: number, col: number) => boolean
}

/**
 * Generates a 100% standards-compliant ISO/IEC 18004 QR Code matrix synchronously
 * so every printed Soundwave & Vinyl Lyric keepsake scans immediately with any
 * iPhone or Android camera.
 */
export function buildScannableQrMatrix(url: string): QrMatrixResult {
  const qr = QRCode.create(url || 'https://www.evermarkprints.com/listen', {
    errorCorrectionLevel: 'L',
  })
  const size = qr.modules.size
  return {
    size,
    isDark: (row: number, col: number) => Boolean(qr.modules.get(row, col)),
  }
}

export function buildCompactListenQrUrl(params: {
  title: string
  song: string
  dateText: string
  subline?: string
  audioUrl?: string | null
  peaks?: number[] | null
}): string {
  const base = 'https://www.evermarkprints.com/listen'
  const q = new URLSearchParams()
  if (params.title.trim()) q.set('title', params.title.trim().slice(0, 36))
  if (params.song.trim()) q.set('song', params.song.trim().slice(0, 36))
  if (params.dateText.trim()) q.set('date', params.dateText.trim().slice(0, 26))
  if (params.subline && params.subline.trim()) {
    q.set('subline', params.subline.trim().slice(0, 56))
  }
  if (params.audioUrl && params.audioUrl.trim()) {
    q.set('audio', params.audioUrl.trim())
  } else if (params.peaks && params.peaks.length > 0) {
    // Downsample to 24 compact hex/2-digit peaks so QR version stays compact and easy to scan
    const step = Math.max(1, Math.floor(params.peaks.length / 24))
    const compact: number[] = []
    for (let i = 0; i < params.peaks.length && compact.length < 24; i += step) {
      compact.push(Math.round(params.peaks[i] * 99))
    }
    q.set('peaks', compact.join(','))
  }
  return `${base}?${q.toString()}`
}
