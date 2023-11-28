import React, { useEffect, useRef } from 'react';
import { useSignal, signal } from '@preact/signals-react';
import { useTranslation } from 'react-i18next';
import { ChatMessage } from 'gpt-tokenizer/esm/GptEncoding';
import { isWithinTokenLimit } from 'gpt-tokenizer/esm/model/gpt-3.5-turbo-0301';
import { isChrome, isEdge, getUA } from 'react-device-detect';

import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/system';
import Button from '@mui/material/Button';
import TelegramIcon from '@mui/icons-material/Telegram';
import CachedIcon from '@mui/icons-material/Cached';
import { string } from 'prop-types';
import { SendPromptData, PastMessage } from '../../clients/models/PromptModel';
import { TraceSeverity } from '../../clients/models/MetricsModel';
import MetricsClient from '../../clients/MetricsClient';
import OpenAIClient from '../../clients/OpenAIClient';

import { systemMessageValue } from '../AssistantSetupMenu/AssistantSetupMenu';
import {
  temperature,
  topP,
  maxTokens,
  pastMessages,
  APITimeout,
  DEFAULT_TEMPERATURE,
  DEFAULT_TOP_P,
  DEFAULT_MAX_TOKENS,
  DEFAULT_PAST_MESSAGES,
  DEFAULT_API_TIMEOUT,
} from '../ConfigurationMenu/ConfigurationMenu';
import PopupDialogs from './PopupDialogs';

export const visible = signal<string>('true');

export const openResetChatSession = signal<boolean>(false);
export const openSessionExpired = signal<boolean>(false);
export const openAPIRateLimit = signal<boolean>(false);
export const openAPITimeout = signal<boolean>(false);
export const openAPIError = signal<boolean>(false);
export const openInputTooLarge = signal<boolean>(false);

export const disabledBool = signal<boolean>(false);
export const disabledInput = signal(false);

export const displayValue = signal<string>('block');

interface AllDisplayMessages {
  role: string;
  content: string;
  id: number;
}

export const allMessagesToDisplay = signal<AllDisplayMessages[]>([]);

const SendMessage = () => {
  const { t } = useTranslation();
  const welcomeMessage = t('welcome-message');
  if (allMessagesToDisplay.value.length === 0) {
    allMessagesToDisplay.value = [
      ...allMessagesToDisplay.value,
      {
        role: 'system',
        content: welcomeMessage,
        id: 0,
      },
    ];
  }
  const promptInputText = useSignal<string>('');
  const tokenMessage = useSignal<string>('');
  const tokenCount = useSignal<number>(0);

  // MessageId gets incremented BEFORE adding a new message
  // The welcome message has an id of 0, the next message will be 1 etc...
  const messageId = useSignal<number>(0);

  const MAX_INPUT_TOKENS_3_5_TURBO = 4000;
  const MAX_INPUT_TOKENS = MAX_INPUT_TOKENS_3_5_TURBO;

  const blue = {
    500: '#007FFF',
    600: '#0072E5',
    700: '#0059B2',
  };

  const CustomButton = styled(Button)`
    font-family: Arial, sans-serif;
    font-size: 0.875rem;
    background-color: ${blue[500]};
    padding: 4px 10px;
    border-radius: 8px;
    color: white;
    transition: all 150ms ease;
    cursor: pointer;
    border: none;
    margin-right: 10px;

    &:hover {
      background-color: ${blue[600]};
    }
  `;

  const handleResetChatSessionOpen = () => {
    // Tracking in app insights
    MetricsClient.sendEvent({
      name: 'ChatApp Reset Chat Clicked',
    });
    openResetChatSession.value = true;
  };

  const handleSessionExpiredOpen = () => {
    openSessionExpired.value = true;
  };

  const handleAPIRateLimitOpen = () => {
    // Tracking in app insights
    MetricsClient.sendTrace({
      message: 'ChatApp Rate Limit Hit',
      severity: TraceSeverity.ERROR,
    });

    openAPIRateLimit.value = true;
  };

  const handleAPITimeoutOpen = () => {
    // Tracking in app insights
    MetricsClient.sendTrace({
      message: 'ChatApp Timeout',
      severity: TraceSeverity.ERROR,
      properties: { APITimeout },
    });

    openAPITimeout.value = true;
  };

  const handleAPIErrorOpen = () => {
    // Tracking in app insights
    MetricsClient.sendTrace({
      message: 'ChatApp Unexplained Error',
      severity: TraceSeverity.ERROR,
    });

    openAPIError.value = true;
  };

  const handleInputTooLargeOpen = () => {
    // Tracking in app insights
    MetricsClient.sendTrace({
      message: 'ChatApp Input Too Large',
      severity: TraceSeverity.ERROR,
    });

    openInputTooLarge.value = true;
  };

  enum MessageType {
    USER = 'user',
    SYSTEM = 'system',
  }

  // Add message to display to the user
  const updateAllMessagesToDisplay = (newMessage: string, messageType: MessageType) => {
    visible.value = 'false';
    messageId.value += 1;
    allMessagesToDisplay.value = [
      ...allMessagesToDisplay.value,
      { role: messageType, content: newMessage, id: messageId.value },
    ];
  };

  // Find and update the system message with the "thinking" gif after the API responds
  const updateSystemMessageFromApiResponse = (systemMessage: string) => {
    allMessagesToDisplay.value = allMessagesToDisplay.value.map(message => {
      if (message.id === messageId.value) {
        return { ...message, content: systemMessage };
      }
      return message;
    });
  };

  // For the conversation to keep context we include past messages when calling the OpenAI API
  // The number of past messages is configurable in the settings
  const getPastMessagesToSendToOpenAiApi = () => {
    // First remove the id attribute of the messages as the OpenAI API Contract does not accept them
    const allMessagesToDisplayWithoutId = allMessagesToDisplay.value.map(
      ({ id, ...messagesWithOutIds }) => messagesWithOutIds,
    );
    // If all messages is greater than the pastMessages value configured in the settings
    // then remove both the welcome message and the last user/system(bot) question/response messages
    // Otherwise just remove the welcome message
    return allMessagesToDisplayWithoutId.length > pastMessages.value
      ? allMessagesToDisplayWithoutId.slice(3)
      : allMessagesToDisplayWithoutId.slice(1);
  };

  const gatherMetricsOnConfigurableSettings = () => {
    if (temperature.value !== DEFAULT_TEMPERATURE) {
      // Tracking in app insights
      MetricsClient.sendEvent({
        name: `Temperature sent as ${temperature}`,
      });
    }

    if (topP.value !== DEFAULT_TOP_P) {
      // Tracking in app insights
      MetricsClient.sendEvent({
        name: `TopP sent as ${topP}`,
      });
    }

    if (maxTokens.value !== DEFAULT_MAX_TOKENS) {
      // Tracking in app insights
      MetricsClient.sendEvent({
        name: `Max Tokens sent as ${maxTokens}`,
      });
    }

    if (pastMessages.value !== DEFAULT_PAST_MESSAGES) {
      // Tracking in app insights
      MetricsClient.sendEvent({
        name: `Past Messages sent as ${pastMessages}`,
      });
    }

    if (APITimeout.value !== DEFAULT_API_TIMEOUT) {
      // Tracking in app insights
      MetricsClient.sendEvent({
        name: `API Timeout sent as ${APITimeout}`,
      });
    }
  };

  const sendNewMessageToOpenAiAPI = async (
    newMessageToSend: string,
    pastMessagesToInclude: PastMessage[],
  ) => {
    // constructing data for the OpenAI API Call
    const SEND_PROMPT_DATA: SendPromptData = {
      systemMessageValue: systemMessageValue.value,
      pastMessages: pastMessagesToInclude,
      messageToSend: newMessageToSend,
      temperature: temperature.value,
      topP: topP.value,
      maxTokens: maxTokens.value,
      APITimeout: APITimeout.value,
    };

    // Calling OpenAI
    OpenAIClient.sendPrompt(SEND_PROMPT_DATA)
      .then(responseData => {
        tokenCount.value = responseData.usage.total_tokens;
        const USED_MORE_THAN_MAX_TOKENS = responseData.usage.total_tokens > maxTokens;

        if (USED_MORE_THAN_MAX_TOKENS) {
          // Tracking in app insights
          MetricsClient.sendTrace({
            message: 'ChatApp Used tokens is greater than max tokens',
            severity: TraceSeverity.WARNING,
            properties: { maxTokens, totalTokens: responseData.usage.total_tokens },
          });
        }

        tokenMessage.value = USED_MORE_THAN_MAX_TOKENS ? t('max-tokens-reached') : '';

        updateSystemMessageFromApiResponse(responseData.choices[0].message.content);

        displayValue.value = 'flex';
        // enable send box
        disabledBool.value = false;
        disabledInput.value = false;
      })
      .catch(error => {
        // Remove the last message i.e. the System message with the "thikning" gif
        allMessagesToDisplay.value = [...allMessagesToDisplay.value.slice(0, -1)];

        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        if (error.response?.status === 401) {
          // Authentication error
          handleSessionExpiredOpen();
        } else if (error.response?.status === 429) {
          // Rate Limit error
          handleAPIRateLimitOpen();
        } else if (error.request) {
          // Axios timeout will trigger this flow
          handleAPITimeoutOpen();
        } else {
          // Every other type of error
          handleAPIErrorOpen();
        }
      });
  };

  const checkTokenLimit = (newMessage: string, pastMessagesToInclude: PastMessage[]) => {
    const chat = [
      { role: 'system', content: systemMessageValue.value },
      ...pastMessagesToInclude,
      { role: 'user', content: newMessage },
    ];

    return isWithinTokenLimit(chat as ChatMessage[], MAX_INPUT_TOKENS);
  };

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    disabledInput.value = true;
    disabledBool.value = true;
    visible.value = 'true';

    gatherMetricsOnConfigurableSettings();

    // Save a copy of the new message
    const newMessageToSend = promptInputText.value;

    // clear send message box while waiting
    promptInputText.value = '';

    // Display users message
    updateAllMessagesToDisplay(newMessageToSend, MessageType.USER);
    // Initially display system response as blank
    // This will show a gif to indicate the bot is "thinking"
    updateAllMessagesToDisplay('', MessageType.SYSTEM);

    const pastMessagesToInclude = getPastMessagesToSendToOpenAiApi();

    if (!checkTokenLimit(newMessageToSend, pastMessagesToInclude)) {
      handleInputTooLargeOpen();
      return;
    }

    sendNewMessageToOpenAiAPI(newMessageToSend, pastMessagesToInclude);
  };

  const handleChatMessageTyping = (event: { [x: string]: any; preventDefault: () => void }) => {
    promptInputText.value = event.target.value;

    if (event.target.value === '') {
      disabledBool.value = true;
    } else {
      disabledBool.value = false;
    }
  };

  const handleKeyDown = (event: { [x: string]: any; preventDefault: () => void }) => {
    // Allow Shift and Enter to create a new line
    if (event.key === 'Enter' && !event.shiftKey) {
      handleSubmit(event);
    }
  };

  const checkForExpiredCookie = () => {
    // The below logic doesn't work for some browsers e.g. Safari
    // Only including supported browsers, other browsers won't get a proactive popup
    // notifying them of their expired session, they will find out when they hit the send button
    if (isChrome || isEdge) {
      // Because the cookie is a HTTPOnly cookie it means the react app can't access
      // the cookie to check if it exists, a workaround for this is
      // to try set a cookie with the same name, if the cookie exists after
      // setting the cookie then we know the cookie didn't exist in the first place
      const DATE = new Date();
      DATE.setTime(DATE.getTime() + 1000);
      const EXPIRES = `expires=${DATE.toUTCString()}`;
      const COOKIE_NAME = 'mt-openai-chat';
      document.cookie = `${COOKIE_NAME}=new_value;path=/;${EXPIRES}`;

      const doesCookieExist = document.cookie.indexOf(`${COOKIE_NAME}=`) === -1;

      if (!doesCookieExist) {
        handleSessionExpiredOpen();
      }
    }
  };

  const inputRef = useRef(null);
  useEffect(() => {
    // set focus to input field
    (inputRef.current as any).focus();

    const AUTH_INTERVAL = setInterval(async () => {
      checkForExpiredCookie();
    }, 30000); // every 30 seconds check if the user is authenticated
    return () => {
      clearInterval(AUTH_INTERVAL);
    };
  }, []);

  return (
    <>
      <form onSubmit={handleSubmit} style={{ marginLeft: '20px', marginTop: '20px' }}>
        <Paper
          sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, height: '110px' }}
          elevation={3}
        >
          <Stack direction="row">
            <Paper style={{ width: '100%', backgroundColor: '#f8f8f8' }}>
              <Stack direction="row">
                <Stack direction="column" style={{ marginLeft: 20, width: '100%' }}>
                  <Grid item xs={4} style={{ marginTop: 0 }}>
                    <Button
                      variant="contained"
                      style={{ backgroundColor: '#005A8C', marginTop: 5, marginLeft: 7 }}
                    >
                      {t('token-count')}: {tokenCount}
                    </Button>
                    {tokenMessage}
                  </Grid>
                  <textarea
                    ref={inputRef}
                    // {...(disabledInput.value && { disabled: true })}
                    autoComplete="off"
                    title="sendmessage"
                    placeholder={t('type-message')}
                    name="chatsession"
                    onChange={handleChatMessageTyping}
                    onKeyDown={handleKeyDown}
                    value={promptInputText.value}
                    style={{
                      marginTop: 0,
                      marginLeft: 7,
                      marginBottom: 25,
                      // margin: '7px',
                      width: '100%',
                      fontFamily: 'sans-serif',
                      padding: 10,
                      boxSizing: 'border-box',
                      border: '1',
                      borderRadius: '4px',
                      fontSize: '16px',
                      resize: 'none',
                    }}
                  />
                  <input type="submit" style={{ display: 'none' }} />
                </Stack>
                <Stack>
                  <CustomButton
                    title="send"
                    variant="contained"
                    type="submit"
                    {...(disabledBool.value && { disabled: true })}
                    style={{ marginLeft: '25px', width: '150px', marginTop: 42 }}
                  >
                    {t('buttons.send')}
                    <TelegramIcon style={{ marginLeft: 10, marginBottom: 5, marginTop: 5 }} />
                  </CustomButton>
                </Stack>
                <Stack>
                  <CustomButton
                    title="reset"
                    variant="contained"
                    onClick={handleResetChatSessionOpen}
                    style={{
                      marginLeft: '10px',
                      width: '150px',
                      marginTop: 42,
                      height: 43,
                      marginRight: 60,
                    }}
                  >
                    {t('buttons.reset-chat')}
                    <CachedIcon style={{ marginLeft: 5, marginBottom: 5, marginTop: 5 }} />
                  </CustomButton>
                </Stack>
              </Stack>
            </Paper>
          </Stack>
        </Paper>
      </form>
      <PopupDialogs />
    </>
  );
};

export default SendMessage;
