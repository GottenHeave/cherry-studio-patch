import { defineProvider } from './types'

export default defineProvider({
  id: 'clewdr',
  name: 'ClewdR',
  defaultChatEndpoint: 'anthropic-messages',
  endpointConfigs: {
    'anthropic-messages': {
      adapterFamily: 'clewdr',
      baseUrl: 'http://127.0.0.1:8484/v1'
    },
    'openai-chat-completions': {
      adapterFamily: 'openai-compatible',
      baseUrl: 'http://127.0.0.1:8484/v1'
    }
  },
  metadata: {
    website: {
      docs: 'https://github.com/Xerxes-2/clewdr/wiki',
      official: 'https://github.com/Xerxes-2/clewdr'
    }
  }
})
