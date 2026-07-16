import { describe, expect, it } from 'vitest'
import { createSnapshot } from './synthesize'
import { parseArchive } from './archive'

describe('parseArchive', () => {
  it('accepts a valid, portable SelfField archive', () => {
    const snapshot = createSnapshot({
      lens: 'surprise', experience: '我第一次在冲突里直接表达了自己的边界，没有像过去那样退开。', context: 'close-relationship', pressure: 3,
      action: 'confront', protectedValue: 'integrity', quieterValue: 'belonging', cost: '可能让对方短暂失望，也让我感到不安。',
      counterexample: '如果对方当时非常脆弱，我可能会先等待一个更合适的时机。', confidence: 4,
    })
    const archive = parseArchive({ product: 'SelfField', version: 1, exportedAt: new Date().toISOString(), snapshots: [snapshot] })
    expect(archive.snapshots[0].id).toBe(snapshot.id)
  })

  it('rejects an unrelated or malformed file', () => {
    expect(() => parseArchive({ product: 'SBTI', snapshots: [] })).toThrow()
  })
})
