import React, { useEffect, useState, useRef } from 'react';
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
import OKDialog from './OkDialog';
import ContinueCancelDialog from './ContinueCancelDialog';
import SendPromptData from '../clients/models/PromptModel';
import { TraceSeverity } from '../clients/models/MetricsModel';
import MetricsClient from '../clients/MetricsClient';
import OpenAIClient from '../clients/OpenAIClient';
import i18n from '../i18n';

import { systemMessageValue } from './AssistantSetupMenu';
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
} from './ConfigurationMenu';

export const visible = signal<boolean>(true);
export const displayValue = signal<string>('block');
const welcomeMessage: string = i18n.t('welcome-message');
export const messagesDisplay = signal([
  {
    role: 'system',
    content: systemMessageValue.value,
    id: '0',
  },
  { role: 'system', content: welcomeMessage, id: '1' },
]);

const SendMessage = () => {
  const { t } = useTranslation();

  const systemMessage = {
    role: 'system',
    content: systemMessageValue.value,
  };

  const conversation = [systemMessage];
  const messages = useSignal(conversation);
  const openResetChatSession = useSignal<boolean>(false);
  const openSessionExpired = useSignal<boolean>(false);
  const openAPIRateLimit = useSignal<boolean>(false);
  const openAPITimeout = useSignal<boolean>(false);
  const openAPIError = useSignal<boolean>(false);
  const openInputTooLarge = useSignal<boolean>(false);

  const MAX_INPUT_TOKENS_3_5_TURBO = 4000;
  const MAX_INPUT_TOKENS = MAX_INPUT_TOKENS_3_5_TURBO;

  const [tokenMessage, setTokenMessage] = useState('');

  const [tokenCount, setTokenCount] = useState(0);
  const [disabledBool, setDisabledBool] = useState(false);
  const [disabledInput, setDisabledInput] = useState(false);
  const [data, setData] = useState({ chatsession: '', response: '' });

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

  const handleResetChatSessionClose = () => {
    // Tracking in app insights
    MetricsClient.sendEvent({
      name: 'ChatApp Reset Chat Closed',
    });

    openResetChatSession.value = false;
  };

  const handleResetChatSessionContinue = () => {
    // Tracking in app insights
    MetricsClient.sendEvent({
      name: 'ChatApp Reset Chat Continue',
    });

    openResetChatSession.value = false;
    // refresh the page
    window.location.href = '/';
  };

  const handleSessionExpiredOpen = () => {
    openSessionExpired.value = true;
  };

  const handleSessionExpiredClose = () => {
    openSessionExpired.value = false;
    // enable send box
    setDisabledBool(false);
    setDisabledInput(false);
  };

  const handleSessionExpiredContinue = () => {
    openSessionExpired.value = false;
    // redirect to login
    window.location.href = '/';
  };

  const handleAPIRateLimitOpen = () => {
    // Tracking in app insights
    MetricsClient.sendTrace({
      message: 'ChatApp Rate Limit Hit',
      severity: TraceSeverity.ERROR,
    });

    openAPIRateLimit.value = true;
  };

  const handleAPIRateLimitClose = () => {
    openAPIRateLimit.value = false;
    // enable send box
    setDisabledBool(false);
    setDisabledInput(false);
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

  const handleAPITimeoutClose = () => {
    openAPITimeout.value = false;
    // enable send box
    setDisabledBool(false);
    setDisabledInput(false);
  };

  const handleAPIErrorOpen = () => {
    // Tracking in app insights
    MetricsClient.sendTrace({
      message: 'ChatApp Unexplained Error',
      severity: TraceSeverity.ERROR,
    });

    openAPIError.value = true;
  };

  const handleAPIErrorClose = () => {
    openAPIError.value = false;
    // enable send box
    setDisabledBool(false);
    setDisabledInput(false);
  };

  const handleInputTooLargeOpen = () => {
    // Tracking in app insights
    MetricsClient.sendTrace({
      message: 'ChatApp Input Too Large',
      severity: TraceSeverity.ERROR,
    });

    openInputTooLarge.value = true;
  };

  const handleInputTooLargeClose = () => {
    openInputTooLarge.value = false;
    // enable send box
    setDisabledBool(false);
    setDisabledInput(false);
  };

  async function sendMessage() {
    const messageToSend = data.chatsession;
    // clear send message box while waiting
    setData({ ...data, response: '', chatsession: '' });
    setDisabledBool(true);

    visible.value = true;
    // remove system message to replace with System message parameter
    // check for past messages greater than 10 then remove earliest message and response
    const newMessage =
      [...messages.value].length > pastMessages.value + 1
        ? [...messages.value].slice(3)
        : [...messages.value].slice(1);

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

    const SEND_PROMPT_DATA: SendPromptData = {
      systemMessageValue: systemMessageValue.value,
      newMessage,
      messageToSend,
      temperature: temperature.value,
      topP: topP.value,
      maxTokens: maxTokens.value,
      APITimeout: APITimeout.value,
    };

    OpenAIClient.sendPrompt(SEND_PROMPT_DATA)
      .then(responseData => {
        setData({ ...data, response: responseData.choices[0].message.content, chatsession: '' });
        setTokenCount(responseData.usage.total_tokens);
        const USED_MORE_THAN_MAX_TOKENS = responseData.usage.total_tokens > maxTokens;

        if (USED_MORE_THAN_MAX_TOKENS) {
          // Tracking in app insights
          MetricsClient.sendTrace({
            message: 'ChatApp Used tokens is greater than max tokens',
            severity: TraceSeverity.WARNING,
            properties: { maxTokens, totalTokens: responseData.usage.total_tokens },
          });
        }

        setTokenMessage(USED_MORE_THAN_MAX_TOKENS ? t('max-tokens-reached') : '');

        // add response to conversation
        messages.value = [
          { role: 'system', content: systemMessageValue.value },
          ...newMessage,
          { role: 'user', content: data.chatsession },
          { role: 'system', content: responseData.choices[0].message.content },
        ];
        // trim last empty assistant message and add new user and assistant reaponse
        messagesDisplay.value = [
          ...messagesDisplay.value,
          { role: 'user', content: data.chatsession, id: data.chatsession },
          { role: 'system', content: responseData.choices[0].message.content, id: responseData.id },
        ];
        // turn off typing animation
        visible.value = false;

        displayValue.value = 'flex';
        // enable send box
        setDisabledBool(false);
        setDisabledInput(false);
      })
      .catch(error => {
        console.log(`error.response ${error.response}`);
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        if (error.response) {
          // Authentication error
          if (error.response.status === 401) {
            // turn off typing animation
            visible.value = false;
            messagesDisplay.value = [
              ...messagesDisplay.value,
              { role: 'user', content: data.chatsession, id: data.chatsession },
            ];

            handleSessionExpiredOpen();
          }
          // Rate Limit error
          else if (error.response.status === 429) {
            // turn off typing animation
            visible.value = false;
            messagesDisplay.value = [
              ...messagesDisplay.value,
              { role: 'user', content: data.chatsession, id: data.chatsession },
            ];

            handleAPIRateLimitOpen();
          }
          // Every other type of error
          else {
            // turn off typing animation
            visible.value = false;
            messagesDisplay.value = [
              ...messagesDisplay.value,
              { role: 'user', content: data.chatsession, id: data.chatsession },
            ];

            handleAPIErrorOpen();
          }
        }
        // Axios timeout will trigger this flow
        else if (error.request) {
          // turn off typing animation
          visible.value = false;
          messagesDisplay.value = [
            ...messagesDisplay.value,
            { role: 'user', content: data.chatsession, id: data.chatsession },
          ];

          handleAPITimeoutOpen();
        }
        // Something happened in setting up the request that triggered an Error
        else {
          // turn off typing animation
          visible.value = false;
          messagesDisplay.value = [
            ...messagesDisplay.value,
            { role: 'user', content: data.chatsession, id: data.chatsession },
          ];

          handleAPIErrorOpen();
        }
      });
  }

  async function handleSubmit(event: { preventDefault: () => void }) {
    event.preventDefault();
    setDisabledInput(true);
    setDisabledBool(true);

    const messageToSend = data.chatsession;

    const newmessage =
      [...messages.value].length > pastMessages.value + 1
        ? [...messages.value].slice(3)
        : [...messages.value].slice(1);

    const chat = [
      { role: 'system', content: systemMessageValue.value },
      ...newmessage,
      { role: 'user', content: messageToSend },
    ];

    const withinTokenLimit = isWithinTokenLimit(chat as ChatMessage[], MAX_INPUT_TOKENS);

    if (!withinTokenLimit) {
      handleInputTooLargeOpen();
      return;
    }

    // display user message while waiting for response
    messagesDisplay.value = [
      ...messagesDisplay.value,
      { role: 'user', content: data.chatsession, id: data.chatsession },
      { role: 'system', content: '', id: messagesDisplay.value.length.toString() },
    ];
    sendMessage();
  }

  const handleChatsessionChange = (event: { [x: string]: any; preventDefault: () => void }) => {
    setData({ ...data, [event.target.name]: event.target.value });

    if (event.target.value === '') {
      setDisabledBool(true);
    } else {
      setDisabledBool(false);
    }
  };

  const handleSendChange = (event: { [x: string]: any; preventDefault: () => void }) => {
    handleChatsessionChange(event);
  };

  const handleKeyDown = (event: { [x: string]: any; preventDefault: () => void }) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      //  handle Enter key but not shift-Enter
      handleSubmit(event);
    }
  };

  const inputRef = useRef(null);
  useEffect(() => {
    // set focus to input field
    (inputRef.current as any).focus();
    const AUTH_INTERVAL = setInterval(async () => {
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
    }, 30000); // every 30 seconds check if the user is authenticated
    return () => {
      clearInterval(AUTH_INTERVAL);
    };
  }, [disabledInput]);

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
                    {...(disabledInput && { disabled: true })}
                    autoComplete="off"
                    title="sendmessage"
                    placeholder={t('type-message')}
                    name="chatsession"
                    onChange={handleSendChange}
                    onKeyDown={handleKeyDown}
                    value={data.chatsession}
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
                    {...(disabledBool && { disabled: true })}
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
      <ContinueCancelDialog
        {...{
          handleClose: handleResetChatSessionClose,
          openDialog: openResetChatSession.value,
          handleContinue: handleResetChatSessionContinue,
          headerText: t('popup-messages.reset-chat-header'),
          bodyText: t('popup-messages.reset-chat-body'),
        }}
      />

      <ContinueCancelDialog
        {...{
          handleClose: handleSessionExpiredClose,
          openDialog: openSessionExpired.value,
          handleContinue: handleSessionExpiredContinue,
          headerText: t('popup-messages.session-expired-header'),
          bodyText: t('popup-messages.session-expired-body'),
        }}
      />

      <OKDialog
        {...{
          handleClose: handleAPIErrorClose,
          openDialog: openAPIError.value,
          headerText: t('popup-messages.unexpected-error-header'),
          bodyText: t('popup-messages.unexpected-error-body'),
        }}
      />

      <OKDialog
        {...{
          handleClose: handleAPITimeoutClose,
          openDialog: openAPITimeout.value,
          headerText: t('popup-messages.api-timeout-header'),
          bodyText: t('popup-messages.api-timeout-body'),
        }}
      />

      <OKDialog
        {...{
          handleClose: handleAPIRateLimitClose,
          openDialog: openAPIRateLimit.value,
          headerText: t('popup-messages.server-busy-header'),
          bodyText: t('popup-messages.server-busy-body'),
        }}
      />

      <OKDialog
        {...{
          handleClose: handleInputTooLargeClose,
          openDialog: openInputTooLarge.value,
          headerText: t('popup-messages.input-too-large-header'),
          bodyText: t('popup-messages.input-too-large-body'),
        }}
      />
    </>
  );
};

export default SendMessage;
