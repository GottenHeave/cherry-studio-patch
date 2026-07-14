import { MODEL_CAPABILITY } from '@shared/data/types/model'
import { describe, expect, it } from 'vitest'

import { makeModel } from '../../../../__tests__/fixtures/model'
import { makeProvider } from '../../../../__tests__/fixtures/provider'
import { resolveNativeFileSupport } from '../nativeFileSupport'

describe('resolveNativeFileSupport', () => {
  it('native PDF on an OpenAI Responses LLM model', () => {
    const ns = resolveNativeFileSupport(
      makeProvider({ id: 'openai' }),
      makeModel({ id: 'openai::gpt-4o', apiModelId: 'gpt-4o', name: 'gpt-4o' }),
      'openai'
    )
    expect(ns.pdf).toBe(true)
    expect(typeof ns.image).toBe('boolean')
  })

  it('native PDF on an Anthropic model', () => {
    const ns = resolveNativeFileSupport(
      makeProvider({ id: 'anthropic' }),
      makeModel({ id: 'anthropic::claude', apiModelId: 'claude-3-5-sonnet-20241022', name: 'claude-3-5-sonnet' }),
      'anthropic'
    )
    expect(ns.pdf).toBe(true)
    expect(ns.file).toBe(false)
  })

  it('enables binary files for a Clewdr Anthropic endpoint', () => {
    const ns = resolveNativeFileSupport(
      makeProvider({ id: 'clewdr', name: 'ClewdR' }),
      makeModel({ id: 'clewdr::claude', apiModelId: 'claude-sonnet-4-6', name: 'claude-sonnet-4-6' }),
      'clewdr'
    )

    expect(ns.file).toBe(true)
  })

  it('uses the resolved Clewdr supplier type without inspecting provider identity', () => {
    const ns = resolveNativeFileSupport(
      makeProvider({ id: 'custom-id', name: 'Local proxy' }),
      makeModel({ id: 'custom-id::claude', apiModelId: 'claude-sonnet-4-6', name: 'claude-sonnet-4-6' }),
      'clewdr'
    )

    expect(ns.file).toBe(true)
  })

  it('does not enable binary files for Clewdr through an OpenAI-compatible adapter', () => {
    const ns = resolveNativeFileSupport(
      makeProvider({ id: 'clewdr', name: 'ClewdR' }),
      makeModel({ id: 'clewdr::claude', apiModelId: 'claude-sonnet-4-6', name: 'claude-sonnet-4-6' }),
      'openai-compatible'
    )

    expect(ns.file).toBe(false)
  })

  it('does not infer Clewdr compatibility from the display name', () => {
    const ns = resolveNativeFileSupport(
      makeProvider({ id: 'custom-id', name: 'ClewdR' }),
      makeModel({ id: 'custom-id::claude', apiModelId: 'claude-sonnet-4-6', name: 'claude-sonnet-4-6' }),
      'anthropic'
    )

    expect(ns.file).toBe(false)
  })

  it('no native PDF on an openai-compatible aggregator', () => {
    const ns = resolveNativeFileSupport(
      makeProvider({ id: 'somehub' }),
      makeModel({ id: 'somehub::gpt-4o', apiModelId: 'gpt-4o', name: 'gpt-4o' }),
      'openai-compatible'
    )
    expect(ns.pdf).toBe(false)
    // audio/video gate on model capability — a plain gpt-4o is neither.
    expect(ns.audio).toBe(false)
    expect(ns.video).toBe(false)
  })

  it('audio/video ride on model capability, independent of the provider', () => {
    // An audio-capable model reached via an aggregator stays native (R2): the
    // legacy path inlined media to any provider, so this is no regression.
    const ns = resolveNativeFileSupport(
      makeProvider({ id: 'somehub' }),
      makeModel({
        id: 'somehub::gemini-audio',
        apiModelId: 'gemini-audio',
        name: 'gemini-audio',
        capabilities: [MODEL_CAPABILITY.AUDIO_RECOGNITION]
      }),
      'openai-compatible'
    )
    expect(ns.audio).toBe(true)
    expect(ns.video).toBe(false)
    expect(ns.pdf).toBe(false) // PDF still requires a first-party provider
  })

  it('forces text for providers known to break on native files (qiniu)', () => {
    const ns = resolveNativeFileSupport(
      makeProvider({ id: 'qiniu' }),
      makeModel({ id: 'qiniu::gpt-4o', apiModelId: 'gpt-4o', name: 'gpt-4o' }),
      'openai'
    )
    expect(ns.pdf).toBe(false)
  })

  it('image rides on the vision model regardless of provider', () => {
    // isVisionModel is the gate; assert it's a boolean independent of the provider set.
    const ns = resolveNativeFileSupport(
      makeProvider({ id: 'somehub' }),
      makeModel({ id: 'somehub::gpt-4o', apiModelId: 'gpt-4o', name: 'gpt-4o' }),
      'openai-compatible'
    )
    expect(typeof ns.image).toBe('boolean')
  })
})
