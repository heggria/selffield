import { getAction, getContext, getLens, getValue } from '../data/reflection'
import type { Feedback, MirrorInsight, ReflectionDraft, Snapshot } from '../types'

const unknownFeedback: Record<MirrorInsight['id'], Feedback> = {
  signal: 'unknown',
  tension: 'unknown',
  context: 'unknown',
  unknown: 'unknown',
}

export function createSnapshot(draft: ReflectionDraft, now = new Date()): Snapshot {
  const lens = getLens(draft.lens)
  const context = getContext(draft.context)
  const action = getAction(draft.action)
  const protectedValue = getValue(draft.protectedValue)
  const quieterValue = getValue(draft.quieterValue)
  const pressureLabel = draft.pressure >= 4 ? '压力较高' : draft.pressure <= 2 ? '压力较低' : '压力中等'
  const certainty = draft.confidence >= 4 ? '这与你的理解较一致' : draft.confidence <= 2 ? '你对这份解释仍有保留' : '这只是目前较贴近的解释'

  const insights: MirrorInsight[] = [
    {
      id: 'signal',
      eyebrow: '这次显露的信号',
      title: `${protectedValue.label}被放在了更靠前的位置`,
      statement: `在${context.label}、${pressureLabel}的情况下，你${action.phrase}。这次选择似乎首先在保护“${protectedValue.label}”。`,
      evidence: `你记录的经历：“${draft.experience}”`,
      caveat: `这是一段经历里的信号，不是关于你的永久结论。${certainty}。`,
    },
    {
      id: 'tension',
      eyebrow: '没有被平均掉的矛盾',
      title: `${protectedValue.label}与${quieterValue.label}同时存在`,
      statement: `你把“${protectedValue.label}”放在前面，但“${quieterValue.label}”并没有消失。代价是：${draft.cost}`,
      evidence: `两股力量分别指向“${protectedValue.description}”与“${quieterValue.description}”。`,
      caveat: '矛盾不是答错了。它说明同一时刻有不止一个真实需要。',
    },
    {
      id: 'context',
      eyebrow: '情境中的你',
      title: `这可能只在“${context.label}”中成立`,
      statement: `压力强度为 ${draft.pressure}/5 时，你选择了“${action.label}”。如果对象、风险或精力改变，选择也可能改变。`,
      evidence: `你提供的反例或另一种可能：“${draft.counterexample}”`,
      caveat: 'SelfField 不把不同情境下的你强行合并成一个平均值。',
    },
    {
      id: 'unknown',
      eyebrow: '仍然看不见的部分',
      title: '一次记录不足以解释模式',
      statement: '我们还不知道这次选择会不会重复，也不知道它在其他关系、状态与时间里是否仍然成立。',
      evidence: '需要更多真实经历，而不是更多抽象自评。',
      caveat: '诚实地保留未知，比补出一个完整但虚假的故事更重要。',
    },
  ]

  return {
    ...draft,
    id: crypto.randomUUID(),
    createdAt: now.toISOString(),
    title: lens.title,
    summary: `在${context.label}中，你的选择同时显露了“${protectedValue.label}”与“${quieterValue.label}”之间的张力。`,
    insights,
    nextQuestion: `下一次，当“${protectedValue.label}”与“${quieterValue.label}”再次同时出现时，你会最先注意到什么？`,
    feedback: { ...unknownFeedback },
  }
}

export function compareSnapshots(current: Snapshot, previous?: Snapshot) {
  if (!previous) return '这是第一份快照。变化需要至少两个时间点才能被观察。'
  if (current.protectedValue !== previous.protectedValue) {
    return `上一次你优先保护“${getValue(previous.protectedValue).label}”，这一次是“${getValue(current.protectedValue).label}”。先保留差异，不急着解释原因。`
  }
  if (current.context !== previous.context) {
    return `“${getValue(current.protectedValue).label}”在两个不同情境中都出现了，但行动方式是否相同，仍需要继续观察。`
  }
  return `两次记录都在“${getContext(current.context).label}”中指向“${getValue(current.protectedValue).label}”。这开始像一个重复信号，但还不是定论。`
}
