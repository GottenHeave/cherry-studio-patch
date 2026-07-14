import { createAnthropic } from '@ai-sdk/anthropic'
import type { LanguageModelV3CallOptions, LanguageModelV3StreamPart } from '@ai-sdk/provider'
import { describe, expect, it } from 'vitest'

import { createClewdrProvider } from '../../clewdrProvider'
import { captureWithFetch } from './captureRequest'

function createFilePrompt(filename?: string): LanguageModelV3CallOptions {
  return {
    prompt: [
      {
        role: 'user',
        content: [
          {
            type: 'file',
            data: new Uint8Array([0x50, 0x4b, 0x03, 0x04]),
            mediaType: 'application/zip',
            ...(filename !== undefined && { filename })
          }
        ]
      }
    ]
  }
}

const filePrompt = createFilePrompt('project.zip')

describe('Clewdr Anthropic compatibility (patched @ai-sdk/anthropic)', () => {
  it('sends arbitrary files as base64 documents with their MIME type and filename', async () => {
    const request = await captureWithFetch((fetch) =>
      createClewdrProvider({ apiKey: 'test', baseURL: 'http://127.0.0.1:8484/v1', fetch })
        .languageModel('claude-sonnet-4-6')
        .doStream(filePrompt)
    )

    expect(request.body).toMatchObject({
      messages: [
        {
          content: [
            {
              type: 'document',
              source: {
                type: 'base64',
                media_type: 'application/zip',
                data: 'UEsDBA=='
              },
              title: 'project.zip'
            }
          ]
        }
      ]
    })
  })

  it('keeps arbitrary MIME rejection for the Anthropic supplier type', async () => {
    await expect(
      captureWithFetch((fetch) =>
        createAnthropic({ apiKey: 'test', baseURL: 'https://api.anthropic.com/v1', fetch })
          .languageModel('claude-sonnet-4-6')
          .doStream(filePrompt)
      )
    ).rejects.toThrow('media type: application/zip')
  })

  it('uses a fallback title when an extended file has no title or filename', async () => {
    const request = await captureWithFetch((fetch) =>
      createClewdrProvider({ apiKey: 'test', baseURL: 'http://127.0.0.1:8484/v1', fetch })
        .languageModel('claude-sonnet-4-6')
        .doStream(createFilePrompt())
    )

    expect(request.body).toMatchObject({
      messages: [{ content: [{ title: 'file' }] }]
    })
  })

  it('ignores unsupported proxy metadata events in an Anthropic stream', async () => {
    const fetch = (() =>
      Promise.resolve(
        new Response('data: {"type":"conversation_ready"}\n\n', {
          headers: { 'content-type': 'text/event-stream' },
          status: 200
        })
      )) as typeof globalThis.fetch
    const model = createClewdrProvider({ apiKey: 'test', baseURL: 'http://127.0.0.1:8484/v1', fetch }).languageModel(
      'claude-sonnet-4-6'
    )

    const result = await model.doStream({
      prompt: [{ role: 'user', content: [{ type: 'text', text: 'hello' }] }]
    } as LanguageModelV3CallOptions)
    const chunks: LanguageModelV3StreamPart[] = []
    for await (const chunk of result.stream) chunks.push(chunk)

    expect(chunks.filter((chunk) => chunk.type === 'error')).toEqual([])
  })

  it('preserves Anthropic stream validation outside the Clewdr supplier type', async () => {
    const fetch = (() =>
      Promise.resolve(
        new Response('data: {"type":"conversation_ready"}\n\n', {
          headers: { 'content-type': 'text/event-stream' },
          status: 200
        })
      )) as typeof globalThis.fetch
    const model = createAnthropic({ apiKey: 'test', fetch }).languageModel('claude-sonnet-4-6')

    await expect(
      model.doStream({
        prompt: [{ role: 'user', content: [{ type: 'text', text: 'hello' }] }]
      } as LanguageModelV3CallOptions)
    ).rejects.toThrow('No matching discriminator')
  })
})
