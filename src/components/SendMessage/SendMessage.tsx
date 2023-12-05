import React, { useEffect, useRef } from 'react';
import { useSignal, signal } from '@preact/signals-react';
import { useTranslation } from 'react-i18next';

import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import TelegramIcon from '@mui/icons-material/Telegram';
import CachedIcon from '@mui/icons-material/Cached';
import { PopupDialogOpenHandlers } from './PopupDialogHandlers';
import CustomButton from './SendMessage.styles';
import { SendPromptData, PastMessage } from '../../clients/models/PromptModel';
import { TraceSeverity } from '../../clients/models/MetricsModel';
import MetricsClient from '../../clients/MetricsClient';
import OpenAIClient from '../../clients/OpenAIClient';
import gatherMetricsOnConfigurableSettings from './MetricsOnConfigurableSettings';
import {
  AllDisplayMessages,
  MessageType,
  updateAllMessagesToDisplay,
  updateSystemMessageFromApiResponse,
  getPastMessagesToSendToOpenAiApi,
} from './MessagesHelper';
import { hasCookieExpired, isRequestWithinTokenLimit } from './AdHocHelper';

import { systemMessageValue } from '../AssistantSetupMenu/AssistantSetupMenu';
import { temperature, topP, maxTokens, APITimeout } from '../ConfigurationMenu/ConfigurationMenu';

import PopupDialogs from './PopupDialogs';

export const messageInputDisabled = signal(false);

export const displayValue = signal<string>('block');

export const allMessagesToDisplay = signal<AllDisplayMessages[]>([]);

const SendMessage = () => {
  const { t } = useTranslation();
  const welcomeMessage = t('welcome-message');
  const promptInputText = useSignal<string>('');
  const sendButtonDisabled = useSignal<boolean>(true);
  const tokenMessage = useSignal<string>('');
  const tokenCount = useSignal<number>(0);
  const inputRef = useRef(null);

  useEffect(() => {
    // set focus to input field
    (inputRef.current as any).focus();

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

    const AUTH_INTERVAL = setInterval(async () => {
      if (hasCookieExpired()) {
        PopupDialogOpenHandlers.openSessionExpiredDialog();
      }
    }, 30000); // every 30 seconds check if the user is authenticated
    return () => {
      clearInterval(AUTH_INTERVAL);
    };
  }, []);

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
      .then(response => {
        const responseData = response.data;
        tokenCount.value = responseData.usage.total_tokens;
        const USED_MORE_THAN_MAX_TOKENS = responseData.usage.total_tokens > maxTokens.value;

        if (USED_MORE_THAN_MAX_TOKENS) {
          // Tracking in app insights
          MetricsClient.sendTrace({
            message: 'ChatApp Used tokens is greater than max tokens',
            severity: TraceSeverity.WARNING,
            properties: {
              maxTokens: maxTokens.value,
              totalTokens: responseData.usage.total_tokens,
            },
          });
        }

        tokenMessage.value = USED_MORE_THAN_MAX_TOKENS ? t('max-tokens-reached') : '';

        allMessagesToDisplay.value = updateSystemMessageFromApiResponse(
          responseData.choices[0].message.content,
          allMessagesToDisplay.value,
        );

        displayValue.value = 'flex';
        // enable send box
        messageInputDisabled.value = false;
      })
      .catch(error => {
        // Remove the last message i.e. the System message with the "thikning" gif
        allMessagesToDisplay.value = [...allMessagesToDisplay.value.slice(0, -1)];

        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        if (error.response?.status === 401) {
          // Authentication error
          PopupDialogOpenHandlers.openSessionExpiredDialog();
        } else if (error.response?.status === 429) {
          // Rate Limit error
          PopupDialogOpenHandlers.openAPIRateLimitDialog();
        } else if (
          error.response.status === 413 ||
          (error.response.status === 400 &&
            error.response.data &&
            error.response.data.openAIErrorCode &&
            error.response.data.openAIErrorCode === 'context_length_exceeded')
        ) {
          // Input too large error
          PopupDialogOpenHandlers.openInputTooLargeDialog();
        } else if (error.request) {
          // Axios timeout will trigger this flow
          PopupDialogOpenHandlers.openAPITimeoutDialog();
        } else {
          // Every other type of error
          PopupDialogOpenHandlers.openAPIGeneralErrorDialog();
        }
      });
  };

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    messageInputDisabled.value = true;
    sendButtonDisabled.value = true;

    gatherMetricsOnConfigurableSettings();

    // Save a copy of the new message
    const newMessageToSend = promptInputText.value;

    // clear send message box while waiting
    promptInputText.value = '';

    // Display users message
    allMessagesToDisplay.value = updateAllMessagesToDisplay(
      newMessageToSend,
      MessageType.USER,
      allMessagesToDisplay.value,
    );
    // Initially display system response as blank
    // This will show a gif to indicate the bot is "thinking"
    allMessagesToDisplay.value = updateAllMessagesToDisplay(
      '',
      MessageType.SYSTEM,
      allMessagesToDisplay.value,
    );

    const pastMessagesToInclude = getPastMessagesToSendToOpenAiApi(allMessagesToDisplay.value);

    if (
      !isRequestWithinTokenLimit(systemMessageValue.value, pastMessagesToInclude, newMessageToSend)
    ) {
      PopupDialogOpenHandlers.openInputTooLargeDialog();
      return;
    }

    sendNewMessageToOpenAiAPI(newMessageToSend, pastMessagesToInclude);
  };

  const handleChatMessageTyping = (event: { [x: string]: any; preventDefault: () => void }) => {
    promptInputText.value = event.target.value;

    if (event.target.value === '') {
      sendButtonDisabled.value = true;
    } else {
      sendButtonDisabled.value = false;
    }
  };

  const handleKeyDown = (event: { [x: string]: any; preventDefault: () => void }) => {
    // Allow Shift and Enter to create a new line
    if (event.key === 'Enter' && !event.shiftKey) {
      handleSubmit(event);
    }
  };

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
                    {...(messageInputDisabled.value && { disabled: true })}
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
                    {...(sendButtonDisabled.value && { disabled: true })}
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
                    onClick={PopupDialogOpenHandlers.openSessionExpiredDialog}
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
