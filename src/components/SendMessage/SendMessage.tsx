import React, { useEffect, useRef } from 'react';
import { useSignal, signal } from '@preact/signals-react';
import { useTranslation } from 'react-i18next';
import Grid from '@mui/material/Grid';
import TelegramIcon from '@mui/icons-material/Telegram';
import CachedIcon from '@mui/icons-material/Cached';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { PopupDialogOpenHandlers } from './PopupDialogHandlers';
import { CustomButton, CustomIcon, CustomButtonText, CustomTextarea } from './SendMessage.styles';
import { SendPromptData, PastMessage } from '../../clients/models/PromptModel';
import OpenAIClient from '../../clients/OpenAIClient';
import gatherMetricsOnConfigurableSettings from './MetricsOnConfigurableSettings';
import {
  AllDisplayMessages,
  MessageType,
  updateAllMessagesToDisplay,
  updateSystemMessageFromApiResponse,
  getPastMessagesToSendToOpenAiApi,
  getUsedTokensIsGreaterThanMaxTokensMessage,
} from './MessagesHelper';
import { hasCookieExpired, isRequestWithinTokenLimit } from './AdHocHelper';
import { systemMessageValue } from '../AssistantSetupMenu/AssistantSetupMenu';
import {
  model,
  tokenLimit,
  temperature,
  topP,
  maxTokens,
  APITimeout,
} from '../ConfigurationMenu/ConfigurationMenu';
import PopupDialogs from './PopupDialogs';
import DownloadConversation from '../DownloadConversation/DownloadConversation';

export const messageInputDisabled = signal(false);
export const displayValue = signal<string>('flex');
export const icondisplayvalue = signal<string>('flex');
export const allMessagesToDisplay = signal<AllDisplayMessages[]>([]);
export const heightChange = signal<string>('');

const SendMessage = () => {
  const { t } = useTranslation();
  const welcomeMessage = t('welcome-message');
  const promptInputText = useSignal<string>('');
  const sendButtonDisabled = useSignal<boolean>(true);
  const tokenMessage = useSignal<string>('');
  const tokenCount = useSignal<number>(0);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const MAX_HEIGHT = 165;

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
      systemMessageValue.value = t(
        'menu.assistant-setup.message-template.system-message-template.template1',
      );
    }
    const AUTH_INTERVAL = setInterval(() => {
      if (hasCookieExpired()) {
        PopupDialogOpenHandlers.openSessionExpiredDialog();
      }
    }, 30000); // every 30 seconds check if the user is authenticated
    return () => {
      clearInterval(AUTH_INTERVAL);
    };
  }, [messageInputDisabled, messageInputDisabled.value, t, welcomeMessage]);

  const adjustTextareaHeight = () => {
    if (inputRef.current) {
      if (inputRef.current) {
        inputRef.current.style.overflowY = 'hidden';
        inputRef.current.style.maxHeight = `${MAX_HEIGHT}px`;
        inputRef.current.style.height = 'auto';
        if (inputRef.current.scrollHeight >= MAX_HEIGHT) {
          inputRef.current.style.overflowY = 'scroll';
        }
        inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
        heightChange.value = inputRef.current.style.height; // update the message box scroll to bottom on textarea height change.
      }
    }
  };
  useEffect(() => {
    adjustTextareaHeight();
  }, [promptInputText.value]);

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
    OpenAIClient.sendPrompt(SEND_PROMPT_DATA, model.value)
      .then(response => {
        const responseData = response.data;

        tokenCount.value = responseData.usage.total_tokens;
        tokenMessage.value = t(
          getUsedTokensIsGreaterThanMaxTokensMessage(tokenCount.value, maxTokens.value),
        );

        // Update system message i.e. the thinking gif
        allMessagesToDisplay.value = updateSystemMessageFromApiResponse(
          responseData.choices[0].message.content,
          allMessagesToDisplay.value,
        );

        displayValue.value = 'flex';
        // enable send box
        messageInputDisabled.value = false;
      })
      .catch(error => {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx

        // Remove the last message i.e. the System message with the "thikning" gif
        allMessagesToDisplay.value = [...allMessagesToDisplay.value.slice(0, -1)];

        if (error.response) {
          // Authentication error
          if (error.response.status === 401) {
            PopupDialogOpenHandlers.openSessionExpiredDialog();
          }
          // Authorized error
          else if (error.response.status === 403) {
            PopupDialogOpenHandlers.openNotAuthorizedDialog(model.value);
          }
          // Rate Limit error
          else if (error.response.status === 429) {
            PopupDialogOpenHandlers.openAPIRateLimitDialog();
          }
          // Input too large error
          else if (
            error.response.status === 413 ||
            (error.response.status === 400 &&
              error.response.data &&
              error.response.data.openAIErrorCode &&
              error.response.data.openAIErrorCode === 'context_length_exceeded')
          ) {
            PopupDialogOpenHandlers.openInputTooLargeDialog();
          }
          // Azure OpenAI's Content Filter Error
          else if (
            error.response.status === 400 &&
            error.response.data &&
            error.response.data.openAIErrorCode &&
            error.response.data.openAIErrorCode === 'content_filter'
          ) {
            PopupDialogOpenHandlers.openContentFilterDialog();
          }
          // Every other type of error with an error response
          else {
            PopupDialogOpenHandlers.openAPIGeneralErrorDialog();
          }
        }
        // Axios timeout will trigger this flow
        else if (error.request) {
          PopupDialogOpenHandlers.openAPITimeoutDialog();
        }
        // Something happened in setting up the request that triggered an Error
        else {
          // Every other type of error
          PopupDialogOpenHandlers.openAPIGeneralErrorDialog();
        }
      });
  };

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    messageInputDisabled.value = true;
    sendButtonDisabled.value = true;

    gatherMetricsOnConfigurableSettings(model.value);

    // Save a copy of the new message
    const newMessageToSend = promptInputText.value;

    // clear send message box while waiting
    promptInputText.value = '';

    const pastMessagesToInclude = getPastMessagesToSendToOpenAiApi(allMessagesToDisplay.value);

    // Check if it's going to break the token limit
    if (
      !isRequestWithinTokenLimit(
        systemMessageValue.value,
        pastMessagesToInclude,
        newMessageToSend,
        tokenLimit.value,
      )
    ) {
      PopupDialogOpenHandlers.openInputTooLargeDialog();
      return;
    }

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
    <Box
      onSubmit={handleSubmit}
      component="form"
      sx={{ display: 'flex', paddingBottom: '2px', paddingTop: '10px' }}
    >
      <Stack sx={{ width: '100%', alignItems: 'start' }}>
        <Grid
          container
          spacing={{ xs: 1, sm: 6 }}
          sx={{ px: 2 }}
          alignContent="center"
          alignItems="center"
        >
          <Grid item xs sx={{ alignSelf: 'flex-end' }}>
            <Box sx={{ display: 'flex', paddingBottom: '0px' }}>
              <CustomTextarea
                sx={{
                  '& .MuiOutlinedInput-root': {
                    padding: '8px',
                    borderRadius: '8px',
                    border: '1px solid rgba(0, 0, 0, 0.12)',
                    outline: 'none',
                  },

                  '&.Mui-focused fieldset': {
                    borderColor: 'black',
                  },

                  /* '&:active': { outlineColor: 'black' } */
                }}
                ref={inputRef}
                {...(messageInputDisabled.value && { disabled: true })}
                autoComplete="off"
                title="sendmessage"
                placeholder={t('type-message')}
                name="chatsession"
                data-testid="sendmessage"
                onChange={handleChatMessageTyping}
                onKeyDown={handleKeyDown}
                value={promptInputText.value}
                rows={1}
              />
            </Box>
          </Grid>

          {/* <Grid item sx={{ display: 'flex', alignSelf: 'flex-end', paddingBottom: '7px' }}>
          <Grid container display="inline-flex" columnSpacing={{ xs: 1, sm: 2 }}>
            <DownloadConversation />
            <Grid item xs sx={{ paddingTop: '5px' }}>
              <CustomButton
                fullWidth
                variant="contained"
                title="send"
                type="submit"
                // disabled={sendButtonDisabled.value}
                {...(sendButtonDisabled.value && { disabled: true })}
                aria-disabled={sendButtonDisabled.value}
              />

            </Grid>

          </Grid>
        </Grid> */}

          <Grid className="textareabottom" item xs={12}>
            <Grid container alignItems="center" sx={{ justifyContent: 'space-between' }}>
              <Grid>
                <Box sx={{ display: 'flex' }}>
                  <DownloadConversation />
                </Box>
              </Grid>

              <Grid item>
                <Grid container columnSpacing={{ xs: 1, sm: 2 }}>
                  <Grid item>
                    <CustomButton
                      fullWidth
                      variant="contained"
                      title="send"
                      type="submit"
                      // disabled={sendButtonDisabled.value}
                      {...(sendButtonDisabled.value && { disabled: true })}
                      aria-disabled={sendButtonDisabled.value}
                    >
                      <CustomButtonText>{t('buttons.send')}</CustomButtonText>
                      <CustomIcon>
                        <TelegramIcon />
                      </CustomIcon>
                    </CustomButton>
                  </Grid>
                  <Grid item>
                    <CustomButton
                      fullWidth
                      variant="contained"
                      title="reset"
                      onClick={PopupDialogOpenHandlers.openResetChatDialog}
                    >
                      <CustomButtonText>{t('buttons.reset-chat')}</CustomButtonText>
                      <CustomIcon>
                        <CachedIcon />
                      </CustomIcon>
                    </CustomButton>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            {/* </Paper> */}
          </Grid>
        </Grid>
      </Stack>
      <PopupDialogs />
    </Box>
  );
};

export default SendMessage;
