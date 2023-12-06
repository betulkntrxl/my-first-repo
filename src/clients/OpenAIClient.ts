import axios from 'axios';
import { SendPromptData } from './models/PromptModel';
import { setupRetryConfig } from './RetryConfig';

// Setup retry logic
setupRetryConfig();

const HEADERS = {
  'Content-Type': 'application/json',
};

const OpenAIClient = {
  sendPrompt: async (sendPromptData: SendPromptData) =>
    axios.post(
      '/api/prompt',
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
