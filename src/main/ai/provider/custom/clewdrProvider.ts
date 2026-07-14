import { type AnthropicProvider, type AnthropicProviderSettings, createAnthropic } from '@ai-sdk/anthropic'

export type ClewdrProviderSettings = AnthropicProviderSettings

export function createClewdrProvider(options: ClewdrProviderSettings = {}): AnthropicProvider {
  return createAnthropic({ ...options, name: 'clewdr' })
}
