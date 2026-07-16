import { describe, expect, it } from 'vitest'
import type { ReflectionDraft } from '../types'
import { compareSnapshots, createSnapshot } from './synthesize'

const draft: ReflectionDraft = {
  lens: 'decision',
  experience: '我拒绝了一个风险很高的机会，因为当时还有团队依赖我的交付。',
  context: 'work',
  pressure: 4,
  action: 'wait',
  protectedValue: 'safety',
  quieterValue: 'freedom',
  cost: '获得了确定性，但也暂时放弃了探索的空间。',
  counterexample: '如果风险只影响我自己，而且可以撤回，我可能会直接尝试。',
  confidence: 4,
}

describe('createSnapshot', () => {
  it('preserves both sides of a tension without averaging them', () => {
    const snapshot = createSnapshot(draft, new Date('2026-07-16T00:00:00.000Z'))
    expect(snapshot.insights).toHaveLength(4)
    expect(snapshot.summary).toContain('安全')
    expect(snapshot.summary).toContain('自由')
    expect(snapshot.insights.find((item) => item.id === 'tension')?.statement).toContain(draft.cost)
  })

  it('keeps conclusions provisional and exposes unknowns', () => {
    const snapshot = createSnapshot(draft)
    const language = JSON.stringify(snapshot)
    expect(language).toContain('不是关于你的永久结论')
    expect(language).toContain('一次记录不足以解释模式')
    expect(language).not.toMatch(/你就是|真正的你|你永远|人格类型|稀有度/)
  })

  it('only calls repetition a signal after another snapshot exists', () => {
    const current = createSnapshot(draft)
    expect(compareSnapshots(current)).toContain('至少两个时间点')
    const previous = createSnapshot(draft)
    expect(compareSnapshots(current, previous)).toContain('重复信号')
  })
})
