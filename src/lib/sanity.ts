export function resolveSanityProjectId(): string {
  const raw = (process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '').trim()
  if (!raw || raw === 'byz4z1gd') {
    return 'c7qc61r2'
  }
  return raw
}

export const SANITY_CONFIG = {
  projectId: resolveSanityProjectId(),
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2026-10-01',
  useCdn: true,
}
