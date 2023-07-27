import React, { useState, useRef } from 'react';
import axios from 'axios';
import axiosRetry from 'axios-retry';

import Menu from './Menu';
import Messages from './Messages';
import SendMessage from './SendMessage';
import ContinueCancelDialog from './ContinueCancelDialog';
import OKDialog from './OkDialog';

export interface DialogTitleProps {
  id: string;
  children?: React.ReactNode;
  onClose: () => void;
}

const Home = () => {
  const [data, setData] = useState({ chatsession: '', response: '' });
  const [visible, setVisible] = useState(true);
  const [temperature, setTemperature] = useState<number>(0.7);
  const [topP, setTopP] = useState(0.95);
  const [maxTokens, setMaxTokens] = useState(200);
  const [pastMessages, setPastMessages] = useState(10);
  const [APITimeout, setAPITimeout] = useState(10);

  const [displayValue, setDisplayValue] = useState('block');
  const [tokenMessage, setTokenMessage] = useState('');

  const [tokenCount, setTokenCount] = useState(0);
  const [disabledBool, setDisabledBool] = useState(false);
  const [disabledInput, setDisabledInput] = useState(false);

  const [systemMessageValue, setSystemMessageValue] = useState(
    'Assistant is a large language model trained by OpenAI.'
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
  const conversationDisplay = [
    systemMessageDisplay,
    { role: 'system', content: "Hello, I'm the McKesson ChatApp. How can I help?", id: '1' },
  ];
  const [messages, setMessages] = useState(conversation);
  const [messagesDisplay, setMessagesDisplay] = useState(conversationDisplay);
  const [openResetChatSession, setOpenResetChatSession] = React.useState(false);
  const [openSessionExpired, setOpenSessionExpired] = React.useState(false);
  const [openAPIRateLimit, setOpenAPIRateLimit] = React.useState(false);
  const [openAPITimeout, setOpenAPITimeout] = React.useState(false);
  const [openAPIError, setOpenAPIError] = React.useState(false);

  const handleResetChatSessionOpen = () => {
    setOpenResetChatSession(true);
  };

  const handleResetChatSessionClose = () => {
    setOpenResetChatSession(false);
  };

  const handleResetChatSessionContinue = () => {
    setOpenResetChatSession(false);
    // refresh the page
    window.history.go(0);
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
    window.location.href = '/api/auth/login';
  };

  const handleAPIRateLimitOpen = () => {
    setOpenAPIRateLimit(true);
  };

  const handleAPIRateLimitClose = () => {
    setOpenAPIRateLimit(false);
    // enable send box
    setDisabledBool(false);
    setDisabledInput(false);
  };

  const handleAPITimeoutOpen = () => {
    setOpenAPITimeout(true);
  };

  const handleAPITimeoutClose = () => {
    setOpenAPITimeout(false);
    // enable send box
    setDisabledBool(false);
    setDisabledInput(false);
  };

  const handleAPIErrorOpen = () => {
    setOpenAPIError(true);
  };

  const handleAPIErrorClose = () => {
    setOpenAPIError(false);
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

  async function sendMessage() {
    const messageToSend = data.chatsession;
    // clear send message box while waiting
    setData({ ...data, response: '', chatsession: '' });
    setDisabledBool(true);

    setVisible(true);
    // remove system message to replace with System message parameter
    // check for past messages greater than 10 then remove earliest message and response
    const newmessage =
      [...messages].length > pastMessages + 1 ? [...messages].slice(3) : [...messages].slice(1);

    axiosRetry(axios, {
      retries: 3,
      shouldResetTimeout: true,
      retryCondition: error => {
        const errorReponse = JSON.parse(JSON.stringify(error));
        return (
          axiosRetry.isNetworkOrIdempotentRequestError(error) ||
          error.code === 'ECONNABORTED' ||
          (errorReponse.config?.method === 'post' && errorReponse.status === 500)
        );
      },
    });

    await axios
      .post(
        '/api/prompt',
        {
          messages: [
            { role: 'system', content: systemMessageValue },
            ...newmessage,
            { role: 'user', content: messageToSend },
          ],
          temperature,
          top_p: topP,
          frequency_penalty: 0,
          presence_penalty: 0,
          max_tokens: maxTokens,
          stop: null,
        },
        {
          timeout: APITimeout * 1000, // axios expects timeout in milliseconds
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
      .then(response => {
        const responseData = response.data;
        setData({ ...data, response: responseData.choices[0].message.content, chatsession: '' });
        setTokenCount(responseData.usage.total_tokens);
        setTokenMessage(
          responseData.usage.total_tokens > maxTokens
            ? '  ** Is the answer cut short? Increase the Max Tokens in the Configuration Menu.'
            : ''
        );
        // add response to conversation
        setMessages([
          { role: 'system', content: systemMessageValue },
          ...newmessage,
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
    setSystemMessageValue(event.target.value);
  };

  return (
    <div>
      <Menu
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
          headerText: 'Reset Chat',
          bodyText: 'This will reset your chat session. Do you want to continue?',
        }}
      />

      <ContinueCancelDialog
        {...{
          handleClose: handleSessionExpiredClose,
          openDialog: openSessionExpired,
          handleContinue: handleSessionExpiredContinue,
          headerText: 'Session Expired',
          bodyText: 'Your session has expired. Do you want to continue?',
        }}
      />

      <OKDialog
        {...{
          handleClose: handleAPIErrorClose,
          openDialog: openAPIError,
          headerText: 'Unexpected Error',
          bodyText:
            'An error has occured. The server may be busy.\nPlease try again at a later time.',
        }}
      />

      <OKDialog
        {...{
          handleClose: handleAPITimeoutClose,
          openDialog: openAPITimeout,
          headerText: 'API Timeout',
          bodyText:
            'Is your question complex? If so the API could take a bit more time to respond.\nYou can increase the API Timeout in the Configuration Menu.',
        }}
      />

      <OKDialog
        {...{
          handleClose: handleAPIRateLimitClose,
          openDialog: openAPIRateLimit,
          headerText: 'Server is busy',
          bodyText: 'The server is currently busy.\nPlease try again at a later time.',
        }}
      />
    </div>
  );
};

export default Home;
