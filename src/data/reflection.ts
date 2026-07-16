import type { ActionId, ContextId, LensId, ValueId } from '../types'

export const lenses: Array<{ id: LensId; index: string; title: string; description: string; prompt: string }> = [
  {
    id: 'decision',
    index: '01',
    title: '一次选择',
    description: '回看你真正付出代价的一次取舍。',
    prompt: '最近哪一次选择，让你明显感觉到“选了这个，就会失去另一个”？',
  },
  {
    id: 'relationship',
    index: '02',
    title: '一段关系',
    description: '观察你如何靠近、退后、相信或防御。',
    prompt: '最近哪一次与人的互动，让你意识到自己正在靠近、退后或保护边界？',
  },
  {
    id: 'avoidance',
    index: '03',
    title: '一次回避',
    description: '不责备拖延，先看它在替你保护什么。',
    prompt: '最近有什么事你一直没有开始、没有回应，或下意识地绕开了？',
  },
  {
    id: 'surprise',
    index: '04',
    title: '一个意外',
    description: '从不像“平时的你”的瞬间发现变化。',
    prompt: '最近哪个自己的反应，让你感到意外，甚至不像你原来认识的自己？',
  },
]

export const contexts: Array<{ id: ContextId; label: string }> = [
  { id: 'work', label: '工作与责任' },
  { id: 'close-relationship', label: '亲密关系' },
  { id: 'alone', label: '独处时' },
  { id: 'public', label: '公开环境' },
  { id: 'other', label: '其他情境' },
]

export const actions: Array<{ id: ActionId; label: string; phrase: string }> = [
  { id: 'approach', label: '主动靠近', phrase: '主动靠近了问题' },
  { id: 'wait', label: '继续观察', phrase: '选择继续观察' },
  { id: 'withdraw', label: '暂时退开', phrase: '暂时退开了' },
  { id: 'adapt', label: '顺应局面', phrase: '顺应了当时的局面' },
  { id: 'confront', label: '正面表达', phrase: '选择正面表达' },
  { id: 'ask', label: '寻求支持', phrase: '向他人寻求了支持' },
]

export const values: Array<{ id: ValueId; label: string; description: string }> = [
  { id: 'safety', label: '安全', description: '确定、可控与免受伤害' },
  { id: 'freedom', label: '自由', description: '空间、选择权与自主' },
  { id: 'belonging', label: '归属', description: '连接、接纳与不被抛下' },
  { id: 'recognition', label: '被看见', description: '尊重、认可与影响力' },
  { id: 'integrity', label: '忠于自己', description: '一致、诚实与不自我背叛' },
  { id: 'meaning', label: '意义', description: '方向、价值与值得投入' },
  { id: 'growth', label: '成长', description: '能力、探索与向外扩展' },
  { id: 'rest', label: '休息', description: '恢复、松弛与不过度消耗' },
]

export function getLens(id: LensId) {
  return lenses.find((item) => item.id === id) ?? lenses[0]
}

export function getContext(id: ContextId) {
  return contexts.find((item) => item.id === id) ?? contexts[4]
}

export function getAction(id: ActionId) {
  return actions.find((item) => item.id === id) ?? actions[1]
}

export function getValue(id: ValueId) {
  return values.find((item) => item.id === id) ?? values[0]
}
