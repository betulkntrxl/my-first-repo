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
  // TODO REMOVE THIS FAKE SEND PROMPT
  // sendPrompt: async (sendPromptData: SendPromptData, model: GPT_MODELS) =>
  //   Promise.resolve({
  //     status: 200,
  //     data: {
  //       id: 'chatcmpl-7gQM4JDiQa2Dc4dErFzWLnTfD0dYR',
  //       object: 'chat.completion',
  //       created: 1690345440,
  //       model: 'gpt-35-turbo',
  //       choices: [
  //         {
  //           index: 0,
  //           finish_reason: 'stop',
  //           message: {
  //             role: 'assistant',
  //             content: 'Are you finshed yet Akis? Hurry up!',
  //           },
  //         },
  //       ],
  //       usage: {
  //         completion_tokens: 9,
  //         prompt_tokens: 25,
  //         total_tokens: 34,
  //       },
  //     },
  //   }),
  // TODO REMOVE COMMENTS, THIS SHOULD BE LIVE CODE
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
