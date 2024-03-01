import { ChatMessage } from 'gpt-tokenizer/esm/GptEncoding';
import { isWithinTokenLimit } from 'gpt-tokenizer/esm/model/gpt-3.5-turbo-0301';
import { PastMessage } from '../../clients/models/PromptModel';

const isRequestWithinTokenLimit = (
  systemMessageValue: string,
  pastMessagesToInclude: PastMessage[],
  newMessage: string,
  tokenLimit: number,
) => {
  const chat = [
    { role: 'system', content: systemMessageValue },
    ...pastMessagesToInclude,
    { role: 'user', content: newMessage },
  ];

  return isWithinTokenLimit(chat as ChatMessage[], tokenLimit);
};

export { isRequestWithinTokenLimit };
