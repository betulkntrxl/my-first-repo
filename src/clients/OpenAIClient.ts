import axios from 'axios';
import { GPT_MODELS, SendPromptData } from './models/PromptModel';
import { setupRetryConfig } from './configs/RetryConfig';

// Setup retry logic
setupRetryConfig();

const GPT_3_5_TURBO_PATH = '/api/prompt/gpt35turbo';
const GPT_4_32K_PATH = '/api/prompt/gpt4';

const getPromptPath = (model: GPT_MODELS) =>
  model === GPT_MODELS.GPT_3_5_TURBO_16K ? GPT_3_5_TURBO_PATH : GPT_4_32K_PATH;

const HEADERS = {
  'Content-Type': 'application/json',
};

const OpenAIClient = {
  getAvailableModels: async () => axios.get('/api/available-models'),
  sendPrompt: async (sendPromptData: SendPromptData, model: GPT_MODELS) =>
    axios.post(
      getPromptPath(model),
      {
        messages: [
          { role: 'system', content: sendPromptData.systemMessageValue },
          ...sendPromptData.pastMessages,
          { role: 'user', content: sendPromptData.messageToSend },
        ],
        temperature: sendPromptData.temperature,
        top_p: sendPromptData.topP,
        frequency_penalty: 0,
        presence_penalty: 0,
        max_tokens: sendPromptData.maxTokens,
        stop: null,
      },
      {
        timeout: sendPromptData.APITimeout * 1000, // axios expects timeout in milliseconds
        headers: HEADERS,
      },
    ),
};

export default OpenAIClient;
