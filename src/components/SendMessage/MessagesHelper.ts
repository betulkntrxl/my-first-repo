import { signal } from '@preact/signals-react';
import { pastMessages } from '../ConfigurationMenu/ConfigurationMenu';
import { PastMessage } from '../../clients/models/PromptModel';

export interface AllDisplayMessages {
  role: string;
  content: string;
  id: number;
}

export enum MessageType {
  USER = 'user',
  SYSTEM = 'system',
}

// MessageId gets incremented BEFORE adding a new message
// The welcome message has an id of 0, the next message will be 1 etc...
const messageId = signal<number>(0);

// Add message to display to the user
const updateAllMessagesToDisplay = (
  newMessage: string,
  messageType: MessageType,
  allMessagesToDisplay: AllDisplayMessages[],
) => {
  // increment message ID before we add a new message
  messageId.value += 1;
  return [...allMessagesToDisplay, { role: messageType, content: newMessage, id: messageId.value }];
};

// Find and update the system message with the "thinking" gif after the API responds
const updateSystemMessageFromApiResponse = (
  systemMessage: string,
  allMessagesToDisplay: AllDisplayMessages[],
) =>
  allMessagesToDisplay.map(message => {
    if (message.id === messageId.value) {
      return { ...message, content: systemMessage };
    }
    return message;
  });

// For the conversation to keep context we include past messages when calling the OpenAI API
// The number of past messages is configurable in the settings
const getPastMessagesToSendToOpenAiApi = (allMessagesToDisplay: AllDisplayMessages[]) => {
  // First remove the id attribute of the messages as the OpenAI API Contract does not accept them
  // And remove the first message with slice because the first message is the welcome message
  const allPastMessagesWithoutId = allMessagesToDisplay
    .map(({ id, ...messagesWithOutIds }) => messagesWithOutIds)
    .slice(1);

  // Default the value to ninclude no past messages
  let pastMessagesToInclude: PastMessage[] = [];
  if (pastMessages.value > 0) {
    if (allPastMessagesWithoutId.length > pastMessages.value) {
      // using negative in the slice to get the pass messages at the end
      pastMessagesToInclude = allPastMessagesWithoutId.slice(-pastMessages.value);
    } else {
      pastMessagesToInclude = allPastMessagesWithoutId;
    }
  }
  return pastMessagesToInclude;
};

export {
  updateAllMessagesToDisplay,
  updateSystemMessageFromApiResponse,
  getPastMessagesToSendToOpenAiApi,
};
