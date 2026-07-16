import { z } from 'zod'
import type { SelfFieldArchive } from '../types'

const feedbackSchema = z.enum(['seen', 'partial', 'misread', 'unknown'])
const insightSchema = z.object({
  id: z.enum(['signal', 'tension', 'context', 'unknown']),
  eyebrow: z.string(),
  title: z.string(),
  statement: z.string(),
  evidence: z.string(),
  caveat: z.string(),
})
const snapshotSchema = z.object({
  id: z.string(),
  createdAt: z.iso.datetime(),
  title: z.string(),
  summary: z.string(),
  lens: z.enum(['decision', 'relationship', 'avoidance', 'surprise']),
  experience: z.string(),
  context: z.enum(['work', 'close-relationship', 'alone', 'public', 'other']),
  pressure: z.number().min(1).max(5),
  action: z.enum(['approach', 'wait', 'withdraw', 'adapt', 'confront', 'ask']),
  protectedValue: z.enum(['safety', 'freedom', 'belonging', 'recognition', 'integrity', 'meaning', 'growth', 'rest']),
  quieterValue: z.enum(['safety', 'freedom', 'belonging', 'recognition', 'integrity', 'meaning', 'growth', 'rest']),
  cost: z.string(),
  counterexample: z.string(),
  confidence: z.number().min(1).max(5),
  insights: z.array(insightSchema).length(4),
  nextQuestion: z.string(),
  feedback: z.object({ signal: feedbackSchema, tension: feedbackSchema, context: feedbackSchema, unknown: feedbackSchema }),
})

const archiveSchema = z.object({
  product: z.literal('SelfField'),
  version: z.literal(1),
  exportedAt: z.iso.datetime(),
  snapshots: z.array(snapshotSchema),
})

export function parseArchive(input: unknown): SelfFieldArchive {
  return archiveSchema.parse(input)
}
