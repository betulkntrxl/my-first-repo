import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ChatMessage } from 'gpt-tokenizer/esm/GptEncoding';
import { isWithinTokenLimit } from 'gpt-tokenizer/esm/model/gpt-3.5-turbo-0301';
import { isChrome, isEdge, getUA } from 'react-device-detect';

import OKDialog from '../../components/OkDialog';
import OpenAIClient from '../../clients/OpenAIClient';
import MetricsClient from '../../clients/MetricsClient';
import VersionAndOrgClient from '../../clients/VersionAndOrgClient';
import SendPromptData from '../../clients/models/PromptModel';
import { TraceSeverity } from '../../clients/models/MetricsModel';
import Menu from '../../components/Menu';
import Messages from '../../components/Messages';
import SendMessage from '../../components/SendMessage';
import ContinueCancelDialog from '../../components/ContinueCancelDialog';
import TermsAndConditions from '../../components/TermsAndConditions';

export interface DialogTitleProps {
  id: string;
  children?: React.ReactNode;
  onClose: () => void;
}

const Home = () => {
  const { t } = useTranslation();
  const MAX_INPUT_TOKENS_3_5_TURBO = 4000;
  const MAX_INPUT_TOKENS = MAX_INPUT_TOKENS_3_5_TURBO;
  const DEFAULT_TEMPERATURE = 0.7;
  const DEFAULT_TOP_P = 0.95;
  const DEFAULT_MAX_TOKENS = 2000;
  const DEFAULT_PAST_MESSAGES = 10;
  const DEFAULT_API_TIMEOUT = 10;
  const [orgDeployment, setOrgDeployment] = useState('');
  const [data, setData] = useState({ chatsession: '', response: '' });
  const [visible, setVisible] = useState(true);
  const [temperature, setTemperature] = useState<number>(DEFAULT_TEMPERATURE);
  const [topP, setTopP] = useState(DEFAULT_TOP_P);
  const [maxTokens, setMaxTokens] = useState(DEFAULT_MAX_TOKENS);
  const [pastMessages, setPastMessages] = useState(DEFAULT_PAST_MESSAGES);
  const [APITimeout, setAPITimeout] = useState(DEFAULT_API_TIMEOUT);

  const [displayValue, setDisplayValue] = useState('block');
  const [tokenMessage, setTokenMessage] = useState('');

  const [tokenCount, setTokenCount] = useState(0);
  const [disabledBool, setDisabledBool] = useState(false);
  const [disabledInput, setDisabledInput] = useState(false);

  const [systemMessageValue, setSystemMessageValue] = useState(
    t('menu.assistant-setup.message-template.system-message-template.template1'),
  );
  const systemMessageDisplay = {
    role: 'system',
    content: systemMessageValue,
    id: '0',
  };
  const systemMessage = {
    role: 'system',
    content: systemMessageValue,
  };
  const conversation = [systemMessage];
  const welcomeMessage = t('welcome-message');
  const conversationDisplay = [
    systemMessageDisplay,
    { role: 'system', content: welcomeMessage, id: '1' },
  ];
  const [messages, setMessages] = useState(conversation);
  const [messagesDisplay, setMessagesDisplay] = useState(conversationDisplay);
  const [openResetChatSession, setOpenResetChatSession] = React.useState(false);
  const [openSessionExpired, setOpenSessionExpired] = React.useState(false);
  const [openAPIRateLimit, setOpenAPIRateLimit] = React.useState(false);
  const [openAPITimeout, setOpenAPITimeout] = React.useState(false);
  const [openAPIError, setOpenAPIError] = React.useState(false);
  const [openInputTooLarge, setOpenInputTooLarge] = React.useState(false);

  async function getOrgDeployment() {
    VersionAndOrgClient.getOrgDeployment()
      .then(responseData => {
        setOrgDeployment(responseData.orgDeployment);
      })
      .catch(error => {
        MetricsClient.sendTrace({
          message: 'ChatApp failed to retrieve Org',
          severity: TraceSeverity.CRITICAL,
          properties: { errorResponse: error.response },
        });
      });
  }

  const handleResetChatSessionOpen = () => {
    // Tracking in app insights
    MetricsClient.sendEvent({
      name: 'ChatApp Reset Chat Clicked',
    });
    setOpenResetChatSession(true);
  };

  const handleResetChatSessionClose = () => {
    // Tracking in app insights
    MetricsClient.sendEvent({
      name: 'ChatApp Reset Chat Closed',
    });

    setOpenResetChatSession(false);
  };

  const handleResetChatSessionContinue = () => {
    // Tracking in app insights
    MetricsClient.sendEvent({
      name: 'ChatApp Reset Chat Continue',
    });

    setOpenResetChatSession(false);
    // refresh the page
    window.location.href = '/';
  };

  const handleSessionExpiredOpen = () => {
    setOpenSessionExpired(true);
  };

  const handleSessionExpiredClose = () => {
    setOpenSessionExpired(false);
    // enable send box
    setDisabledBool(false);
    setDisabledInput(false);
  };

  const handleSessionExpiredContinue = () => {
    setOpenSessionExpired(false);
    // redirect to login
    window.location.href = '/';
  };

  const handleAPIRateLimitOpen = () => {
    // Tracking in app insights
    MetricsClient.sendTrace({
      message: 'ChatApp Rate Limit Hit',
      severity: TraceSeverity.ERROR,
    });

    setOpenAPIRateLimit(true);
  };

  const handleAPIRateLimitClose = () => {
    setOpenAPIRateLimit(false);
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

    setOpenAPITimeout(true);
  };

  const handleAPITimeoutClose = () => {
    setOpenAPITimeout(false);
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

    setOpenAPIError(true);
  };

  const handleAPIErrorClose = () => {
    setOpenAPIError(false);
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

    setOpenInputTooLarge(true);
  };

  const handleInputTooLargeClose = () => {
    setOpenInputTooLarge(false);
    // enable send box
    setDisabledBool(false);
    setDisabledInput(false);
  };

  const handleTemperatureChange = (event: Event, newValue: number | number[]): void => {
    setTemperature(newValue as number);
  };

  const handleTopPChange = (event: Event, newValue: number | number[]) => {
    setTopP(newValue as number);
  };

  const handleMaxTokensChange = (event: Event, newValue: number | number[]): void => {
    setMaxTokens(newValue as number);
  };

  const handlePastMessagesChange = (event: Event, newValue: number | number[]): void => {
    setPastMessages(newValue as number);
  };

  const handleAPITimeoutChange = (event: Event, newValue: number | number[]): void => {
    setAPITimeout(newValue as number);
  };

  useEffect(() => {
    // Tracking in app insights
    MetricsClient.sendTrace({
      message: `ChatApp Browser Details ${getUA}`,
      severity: TraceSeverity.INFORMATIONAL,
    });

    MetricsClient.sendTrace({
      message: `ChatApp default language set to ${t('current-language').toLowerCase()}`,
      severity: TraceSeverity.INFORMATIONAL,
    });

    getOrgDeployment();

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
  }, [t]);

  async function sendMessage() {
    const messageToSend = data.chatsession;
    // clear send message box while waiting
    setData({ ...data, response: '', chatsession: '' });
    setDisabledBool(true);

    setVisible(true);
    // remove system message to replace with System message parameter
    // check for past messages greater than 10 then remove earliest message and response
    const newMessage =
      [...messages].length > pastMessages + 1 ? [...messages].slice(3) : [...messages].slice(1);

    if (temperature !== DEFAULT_TEMPERATURE) {
      // Tracking in app insights
      MetricsClient.sendEvent({
        name: `Temperature sent as ${temperature}`,
      });
    }

    if (topP !== DEFAULT_TOP_P) {
      // Tracking in app insights
      MetricsClient.sendEvent({
        name: `TopP sent as ${topP}`,
      });
    }

    if (maxTokens !== DEFAULT_MAX_TOKENS) {
      // Tracking in app insights
      MetricsClient.sendEvent({
        name: `Max Tokens sent as ${maxTokens}`,
      });
    }

    if (pastMessages !== DEFAULT_PAST_MESSAGES) {
      // Tracking in app insights
      MetricsClient.sendEvent({
        name: `Past Messages sent as ${pastMessages}`,
      });
    }

    if (APITimeout !== DEFAULT_API_TIMEOUT) {
      // Tracking in app insights
      MetricsClient.sendEvent({
        name: `API Timeout sent as ${APITimeout}`,
      });
    }

    const SEND_PROMPT_DATA: SendPromptData = {
      systemMessageValue,
      newMessage,
      messageToSend,
      temperature,
      topP,
      maxTokens,
      APITimeout,
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
        setMessages([
          { role: 'system', content: systemMessageValue },
          ...newMessage,
          { role: 'user', content: data.chatsession },
          { role: 'system', content: responseData.choices[0].message.content },
        ]);
        // trim last empty assistant message and add new user and assistant reaponse
        setMessagesDisplay([
          ...messagesDisplay,
          { role: 'user', content: data.chatsession, id: data.chatsession },
          { role: 'system', content: responseData.choices[0].message.content, id: responseData.id },
        ]);
        // turn off typing animation
        setVisible(false);

        setDisplayValue('flex');
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
            setVisible(false);
            setMessagesDisplay([
              ...messagesDisplay,
              { role: 'user', content: data.chatsession, id: data.chatsession },
            ]);

            handleSessionExpiredOpen();
          }
          // Rate Limit error
          else if (error.response.status === 429) {
            // turn off typing animation
            setVisible(false);
            setMessagesDisplay([
              ...messagesDisplay,
              { role: 'user', content: data.chatsession, id: data.chatsession },
            ]);

            handleAPIRateLimitOpen();
          }
          // Every other type of error
          else {
            // turn off typing animation
            setVisible(false);
            setMessagesDisplay([
              ...messagesDisplay,
              { role: 'user', content: data.chatsession, id: data.chatsession },
            ]);

            handleAPIErrorOpen();
          }
        }
        // Axios timeout will trigger this flow
        else if (error.request) {
          // turn off typing animation
          setVisible(false);
          setMessagesDisplay([
            ...messagesDisplay,
            { role: 'user', content: data.chatsession, id: data.chatsession },
          ]);

          handleAPITimeoutOpen();
        }
        // Something happened in setting up the request that triggered an Error
        else {
          // turn off typing animation
          setVisible(false);
          setMessagesDisplay([
            ...messagesDisplay,
            { role: 'user', content: data.chatsession, id: data.chatsession },
          ]);

          handleAPIErrorOpen();
        }
      });
  }

  const bottomRef: any = useRef();

  async function handleSubmit(event: { preventDefault: () => void }) {
    event.preventDefault();
    setDisabledInput(true);
    setDisabledBool(true);

    const messageToSend = data.chatsession;

    const newmessage =
      [...messages].length > pastMessages + 1 ? [...messages].slice(3) : [...messages].slice(1);

    const chat = [
      { role: 'system', content: systemMessageValue },
      ...newmessage,
      { role: 'user', content: messageToSend },
    ];

    const withinTokenLimit = isWithinTokenLimit(chat as ChatMessage[], MAX_INPUT_TOKENS);

    if (!withinTokenLimit) {
      handleInputTooLargeOpen();
      return;
    }

    // display user message while waiting for response
    setMessagesDisplay([
      ...messagesDisplay,
      { role: 'user', content: data.chatsession, id: data.chatsession },
      { role: 'system', content: '', id: messagesDisplay.length.toString() },
    ]);
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

  const handleKeyDown = (event: { [x: string]: any; preventDefault: () => void }) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      //  handle Enter key but not shift-Enter
      handleSubmit(event);
    }
  };

  const handleSystemMessageValueChange = (event: { target: { name: any; value: any } }) => {
    // Tracking in app insights
    MetricsClient.sendEvent({
      name: 'System Message Changed',
    });

    setSystemMessageValue(event.target.value);
  };

  return (
    // Wait for the Org Deployment to be set before rendering
    !orgDeployment ? null : (
      <div>
        {orgDeployment === 'uson' && <TermsAndConditions />}
        <Menu
          orgDeployment={orgDeployment}
          temperature={temperature}
          handleTemperatureChange={handleTemperatureChange}
          topP={topP}
          handleTopPChange={handleTopPChange}
          maxTokens={maxTokens}
          handleMaxTokensChange={handleMaxTokensChange}
          handleSystemMessageValueChange={handleSystemMessageValueChange}
          systemMessageValue={systemMessageValue}
          handlePastMessagesChange={handlePastMessagesChange}
          pastMessages={pastMessages}
          handleAPITimeoutChange={handleAPITimeoutChange}
          APITimeout={APITimeout}
        />

        <div
          style={{
            backgroundAttachment: 'fixed',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center 90px',
            width: '100%',
            float: 'right',
            margin: 10,
            height: 500,
          }}
        >
          {messagesDisplay.length < 3 ? ( // hide background when chat starts
            <div
              style={{
                position: 'absolute',
                // color:'#B3CEDD',
                color: 'steelblue',
                //  backgroundColor: '#E5EFF3',
                opacity: 0.6,
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                zIndex: -1,
                overflow: 'hidden',
                fontFamily: 'arial',
              }}
            />
          ) : (
            ''
          )}

          <div style={{ float: 'right', width: '100%' }}>
            <Messages
              bottomRef={bottomRef}
              messagesDisplay={messagesDisplay}
              displayValue={displayValue}
              visible={visible}
            />
          </div>

          <form onSubmit={handleSubmit} style={{ marginLeft: '20px', marginTop: '20px' }}>
            <SendMessage
              handleChatsessionChange={handleChatsessionChange}
              data={data}
              tokenCount={tokenCount}
              tokenMessage={tokenMessage}
              disabledBool={disabledBool}
              disabledInput={disabledInput}
              handleResetChatSessionOpen={handleResetChatSessionOpen}
              handleKeyDown={handleKeyDown}
            />
          </form>
        </div>

        <ContinueCancelDialog
          {...{
            handleClose: handleResetChatSessionClose,
            openDialog: openResetChatSession,
            handleContinue: handleResetChatSessionContinue,
            headerText: t('popup-messages.reset-chat-header'),
            bodyText: t('popup-messages.reset-chat-body'),
          }}
        />

        <ContinueCancelDialog
          {...{
            handleClose: handleSessionExpiredClose,
            openDialog: openSessionExpired,
            handleContinue: handleSessionExpiredContinue,
            headerText: t('popup-messages.session-expired-header'),
            bodyText: t('popup-messages.session-expired-body'),
          }}
        />

        <OKDialog
          {...{
            handleClose: handleAPIErrorClose,
            openDialog: openAPIError,
            headerText: t('popup-messages.unexpected-error-header'),
            bodyText: t('popup-messages.unexpected-error-body'),
          }}
        />

        <OKDialog
          {...{
            handleClose: handleAPITimeoutClose,
            openDialog: openAPITimeout,
            headerText: t('popup-messages.api-timeout-header'),
            bodyText: t('popup-messages.api-timeout-body'),
          }}
        />

        <OKDialog
          {...{
            handleClose: handleAPIRateLimitClose,
            openDialog: openAPIRateLimit,
            headerText: t('popup-messages.server-busy-header'),
            bodyText: t('popup-messages.server-busy-body'),
          }}
        />

        <OKDialog
          {...{
            handleClose: handleInputTooLargeClose,
            openDialog: openInputTooLarge,
            headerText: t('popup-messages.input-too-large-header'),
            bodyText: t('popup-messages.input-too-large-body'),
          }}
        />
      </div>
    )
  );
};

export default Home;
