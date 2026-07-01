const CHROMATIC = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B']
const ENHARMONIC: Record<string, string> = {
  'Db':'C#','Eb':'D#','Fb':'E','Gb':'F#','Ab':'G#','Bb':'A#','Cb':'B'
}

function normalize(key: string): string {
  const root   = key.match(/^[A-G][#b]?/)?.[0] ?? 'C'
  const suffix = key.slice(root.length)
  return (ENHARMONIC[root] ?? root) + suffix
}

function rootIndex(key: string): number {
  const root = key.match(/^[A-G][#b]?/)?.[0] ?? 'C'
  return CHROMATIC.indexOf(ENHARMONIC[root] ?? root)
}

export function getTargetKey(originalKey: string, semitones: number): string {
  const norm   = normalize(originalKey)
  const idx    = rootIndex(norm)
  const suffix = norm.replace(/^[A-G][#b]?/, '')
  const newIdx = ((idx + semitones) % 12 + 12) % 12
  return CHROMATIC[newIdx] + suffix
}

export interface CapoSuggestion {
  capo:    number
  playKey: string
}

export function getCapoSuggestion(
  targetKey: string,
  preferredPlayKey = 'G'
): CapoSuggestion | null {
  const tIdx   = rootIndex(targetKey)
  const pIdx   = rootIndex(preferredPlayKey)
  const suffix = normalize(targetKey).replace(/^[A-G][#b]?/, '')
  const capo   = ((tIdx - pIdx) % 12 + 12) % 12
  if (capo === 0) return null
  return { capo, playKey: preferredPlayKey + suffix }
}
