export type LensId = 'decision' | 'relationship' | 'avoidance' | 'surprise'
export type ContextId = 'work' | 'close-relationship' | 'alone' | 'public' | 'other'
export type ValueId =
  | 'safety'
  | 'freedom'
  | 'belonging'
  | 'recognition'
  | 'integrity'
  | 'meaning'
  | 'growth'
  | 'rest'
export type ActionId = 'approach' | 'wait' | 'withdraw' | 'adapt' | 'confront' | 'ask'
export type Feedback = 'seen' | 'partial' | 'misread' | 'unknown'

export interface ReflectionDraft {
  lens: LensId
  experience: string
  context: ContextId
  pressure: number
  action: ActionId
  protectedValue: ValueId
  quieterValue: ValueId
  cost: string
  counterexample: string
  confidence: number
}

export interface MirrorInsight {
  id: 'signal' | 'tension' | 'context' | 'unknown'
  eyebrow: string
  title: string
  statement: string
  evidence: string
  caveat: string
}

export interface Snapshot extends ReflectionDraft {
  id: string
  createdAt: string
  title: string
  summary: string
  insights: MirrorInsight[]
  nextQuestion: string
  feedback: Record<MirrorInsight['id'], Feedback>
}

export interface SelfFieldArchive {
  product: 'SelfField'
  version: 1
  exportedAt: string
  snapshots: Snapshot[]
}
