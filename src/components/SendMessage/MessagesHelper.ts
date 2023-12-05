import { signal } from '@preact/signals-react';
import { pastMessages } from '../ConfigurationMenu/ConfigurationMenu';

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
  const allMessagesToDisplayWithoutId = allMessagesToDisplay.map(
    ({ id, ...messagesWithOutIds }) => messagesWithOutIds,
  );
  // If all messages is greater than the pastMessages value configured in the settings
  // then remove both the welcome message and the last user/system(bot) question/response messages
  // Otherwise just remove the welcome message
  return allMessagesToDisplayWithoutId.length > pastMessages.value
    ? allMessagesToDisplayWithoutId.slice(3)
    : allMessagesToDisplayWithoutId.slice(1);
};

export {
  updateAllMessagesToDisplay,
  updateSystemMessageFromApiResponse,
  getPastMessagesToSendToOpenAiApi,
};
