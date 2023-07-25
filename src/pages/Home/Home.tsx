import React, { useState, useRef } from 'react';

import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';

import Menu from './Menu';
import Messages from './Messages';
import SendMessage from './SendMessage';
import ResetChatDialog from './ResetChatDialog';
import SessionExpiredDialog from './SessionExpiredDialog';
import APIErrorDialog from './APIErrorDialog';
import MaxTokensLimitDialog from './MaxTokensLimitDialog';

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
  const [displayValue, setDisplayValue] = useState('block');
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
  const [openAPIError, setOpenAPIError] = React.useState(false);
  const [openMaxTokensLimit, setOpenMaxTokensLimit] = React.useState(false);
  const [openMaxTokensLimitSnackbar, setOpenMaxTokensLimitSnackbar] = React.useState(false);

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

  const handleAPIErrorOpen = () => {
    setOpenAPIError(true);
  };

  const handleAPIErrorClose = () => {
    setOpenAPIError(false);
    // enable send box
    setDisabledBool(false);
    setDisabledInput(false);
  };

  const handleCloseMaxTokensLimitSnackbar = () => {
    setOpenMaxTokensLimitSnackbar(false);
  };

  const handleMaxTokensLimitClose = () => {
    setOpenMaxTokensLimit(false);
  };

  const handleMaxTokensLimitContinue = () => {
    setOpenMaxTokensLimit(false);
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
    const response = await fetch('/api/prompt', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
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
      }),
    });
    const contentType = response.headers.get('content-type');
    // check for response status 200 else display error message immediately
    if (contentType && contentType.indexOf('application/json') !== -1 && response.status === 200) {
      const responseData = await response.json();
      setData({ ...data, response: responseData.choices[0].message.content, chatsession: '' });
      setTokenCount(responseData.usage.total_tokens);
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
      // check for max token limit exceeded and display message
      if (responseData.usage.total_tokens >= maxTokens) {
        setOpenMaxTokensLimitSnackbar(true);
      }
    } else if (response.status !== 401) {
      // turn off typing animation
      setVisible(false);
      setMessagesDisplay([
        ...messagesDisplay,
        { role: 'user', content: data.chatsession, id: data.chatsession },
      ]);
      // Display API error if response is not 200 or 401
      handleAPIErrorOpen();
    } else {
      // turn off typing animation
      setVisible(false);
      setMessagesDisplay([
        ...messagesDisplay,
        { role: 'user', content: data.chatsession, id: data.chatsession },
      ]);
      // display Session Expired message
      handleSessionExpiredOpen();
    }
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
    // console.log('User pressed: ', event.key);

    if (event.key === 'Enter' && !event.shiftKey) {
      //  your logic here
      handleSubmit(event);
      // console.log('Enter key pressed ');
    }
  };

  const handleSystemMessageValueChange = (event: { target: { name: any; value: any } }) => {
    setSystemMessageValue(event.target.value);
  };

  const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
      padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
      padding: theme.spacing(1),
    },
  }));

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
            disabledBool={disabledBool}
            disabledInput={disabledInput}
            handleResetChatSessionOpen={handleResetChatSessionOpen}
            handleKeyDown={handleKeyDown}
          />
        </form>
      </div>

      <ResetChatDialog
        {...{
          handleResetChatSessionClose,
          openResetChatSession,
          handleResetChatSessionContinue,
        }}
      />

      <SessionExpiredDialog
        {...{
          handleSessionExpiredClose,
          openSessionExpired,
          handleSessionExpiredContinue,
        }}
      />
      <APIErrorDialog
        {...{
          handleAPIErrorClose,
          openAPIError,
        }}
      />
      <MaxTokensLimitDialog
        {...{
          handleMaxTokensLimitClose,
          openMaxTokensLimit,
          handleMaxTokensLimitContinue,
        }}
      />
      <Snackbar
        open={openMaxTokensLimitSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseMaxTokensLimitSnackbar}
      >
        <Alert
          onClose={handleCloseMaxTokensLimitSnackbar}
          severity="warning"
          sx={{ width: '100%', marginLeft: 25, marginBottom: 5 }}
        >
          The Max Tokens Limit has been exceeded. Increase the size of Max Tokens in the
          Configuration Menu.
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Home;
