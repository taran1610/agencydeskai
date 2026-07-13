import { anthropic } from '@ai-sdk/anthropic'
import { openai } from '@ai-sdk/openai'
import { generateObject, type LanguageModel, type ModelMessage } from 'ai'
import type { z } from 'zod'

const PRIMARY_MODEL = process.env.ANTHROPIC_MODEL ?? 'claude-sonnet-4-5'
const FALLBACK_MODEL = process.env.OPENAI_MODEL ?? 'gpt-4o'

interface ModelCandidate {
  id: string
  model: LanguageModel
}

function candidates(): ModelCandidate[] {
  const list: ModelCandidate[] = []
  if (process.env.ANTHROPIC_API_KEY) {
    list.push({ id: PRIMARY_MODEL, model: anthropic(PRIMARY_MODEL) })
  }
  if (process.env.OPENAI_API_KEY) {
    list.push({ id: FALLBACK_MODEL, model: openai(FALLBACK_MODEL) })
  }
  if (list.length === 0) {
    throw new Error(
      'No AI provider configured. Set ANTHROPIC_API_KEY and/or OPENAI_API_KEY in platform/.env.local.',
    )
  }
  return list
}

/**
 * Runs a structured-output call against the primary model and falls back to the
 * secondary provider if the first one fails (rate limit, outage, refusal).
 * Returns the parsed object plus which model actually produced it.
 */
export async function generateStructured<OBJECT>(options: {
  schema: z.Schema<OBJECT>
  system: string
  messages: ModelMessage[]
}): Promise<{ object: OBJECT; model: string }> {
  const errors: string[] = []
  for (const candidate of candidates()) {
    try {
      const result = await generateObject({
        model: candidate.model,
        schema: options.schema,
        system: options.system,
        messages: options.messages,
        temperature: 0,
      })
      return { object: result.object as OBJECT, model: candidate.id }
    } catch (error) {
      errors.push(
        `${candidate.id}: ${error instanceof Error ? error.message : String(error)}`,
      )
    }
  }
  throw new Error(`All AI providers failed. ${errors.join(' | ')}`)
}
