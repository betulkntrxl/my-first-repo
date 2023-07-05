import React, { useState, useRef } from 'react';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import Typography from '@mui/material/Typography';
import DialogContent from '@mui/material/DialogContent';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';

import { Paper, Stack } from '@mui/material';
import Menu from './Menu';
import Messages from './Messages';
import SendMessage from './SendMessage';
import SystemIcon from './systemIntro.jpg';

export interface DialogTitleProps {
  id: string;
  children?: React.ReactNode;
  onClose: () => void;
}

function BootstrapDialogTitle(props: DialogTitleProps) {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: theme => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
}

const Home = () => {
  const [data, setData] = useState({ chatsession: '', response: '' });
  const [visible, setVisible] = useState(true);
  const [temperature, setTemperature] = useState<number>(0.7);
  const [topP, setTopP] = useState(0.95);
  const [maxTokens, setMaxTokens] = useState(800);
  const [pastMessages, setPastMessages] = useState(10);
  const [displayValue, setDisplayValue] = useState('block');
  const [tokenCount, setTokenCount] = useState(0);

  const [disabledBool, setDisabledBool] = useState(true);
  const [systemMessageValue, setSystemMessageValue] = useState(
    'Assistant is a large language model trained by OpenAI."'
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
  const conversationDisplay = [systemMessageDisplay];
  const [messages, setMessages] = useState(conversation);
  const [messagesDisplay, setMessagesDisplay] = useState(conversationDisplay);
  const [openResetChatSession, setOpenResetChatSession] = React.useState(false);
  const [openSessionExpired, setOpenSessionExpired] = React.useState(false);
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
    setDisabledBool(true);
    setData({ ...data, response: '' });
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
          { role: 'user', content: data.chatsession },
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
    if (contentType && contentType.indexOf('application/json') !== -1) {
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
      setVisible(false);

      setDisplayValue('flex');
    } else if (response.status !== 401) {
      // Display API error if response is not 200 or 401
      handleAPIErrorOpen();
    } else {
      // display Session Expired message
      handleSessionExpiredOpen();
    }
  }

  const bottomRef: any = useRef();

  async function handleSubmit(event: { preventDefault: () => void }) {
    event.preventDefault();
    // display user message while waiting for response
    setMessagesDisplay([
      ...messagesDisplay,
      { role: 'user', content: data.chatsession, id: data.chatsession },
      { role: 'system', content: '', id: messagesDisplay.length.toString() },
    ]);
    sendMessage();
  }

  const handleChatsessionChange = (event: { target: { name: any; value: any } }) => {
    setData({ ...data, [event.target.name]: event.target.value });
    if (event.target.value === '') {
      setDisabledBool(true);
    } else {
      setDisabledBool(false);
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
        {messagesDisplay.length < 2 ? ( // hide background when chat starts
          <div
            style={{
              position: 'absolute',
              // color:'#B3CEDD',
              color: 'steelblue',
              backgroundColor: '#E5EFF3',
              opacity: 0.6,
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
              zIndex: -1,
              overflow: 'hidden',
              fontFamily: 'arial',
            }}
          >
            <div style={{ fontSize: 20, textAlign: 'center', marginTop: 150 }}>Welcome to</div>
            <div style={{ fontSize: 56, textAlign: 'center', margin: 30 }}>McKesson Chat App</div>
            <div style={{ fontSize: 14, textAlign: 'center', margin: 30 }}>
              Enter an instruction or select a preset, and watch the API respond with a completion
              that attempts to match the context or pattern you provided.
              <br />
              <br />
              Use good judgment when sharing outputs, and attribute them to your name or company.
              <br />
              <br />
              Requests submitted to our API will not be used to train or improve future models.
              <br />
              <br />
              Our default models&apos; training data cuts off in 2021, so they may not have
              knowledge of current events.
            </div>
            <div style={{ fontSize: 14, textAlign: 'center', margin: 30 }}>
              Please note that McKesson Security teams and Microsoft will be monitoring all use in
              this McKesson GPT environment. Anyone using this application expressly consents to
              such monitoring and is advised that if such monitoring reveals possible criminal
              activity, system personnel may provide the evidence of such monitoring to law
              enforcement officials.
            </div>
            {/* introduction */}
            <Stack
              direction="row"
              style={{ position: 'fixed', bottom: 120, float: 'left', color: 'black' }}
            >
              <img
                alt="assistant"
                src={SystemIcon}
                style={{
                  width: 40,
                  height: 40,
                  marginTop: 20,
                  marginLeft: 20,
                  marginRight: 10,
                }}
              />
              <Paper
                key={-1}
                elevation={3}
                style={{
                  backgroundColor: 'white',
                  color: 'black',
                  marginTop: 40,
                  marginBottom: 20,
                  padding: '10px',
                  float: 'left',
                  display: displayValue,
                  whiteSpace: 'pre-wrap',
                }}
              >
                <Typography style={{ color: 'black' }}>
                  Hello, I&apos;m the McKesson Azure OpenAI GPT35-Turbo Chatbot. How can I help?
                </Typography>
              </Paper>
            </Stack>
          </div>
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
            handleResetChatSessionOpen={handleResetChatSessionOpen}
          />
        </form>
      </div>
      <BootstrapDialog
        onClose={handleResetChatSessionClose}
        aria-labelledby="customized-dialog-title"
        open={openResetChatSession}
      >
        <BootstrapDialogTitle id="customized-dialog-title" onClose={handleResetChatSessionClose}>
          <div style={{ color: 'steelblue', fontWeight: 'bold', fontFamily: 'arial' }}>
            Reset Chat
          </div>
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <Typography gutterBottom>
            This will reset your chat session. Do you want to continue?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={handleResetChatSessionClose}>
            Cancel
          </Button>
          <Button variant="contained" autoFocus onClick={handleResetChatSessionContinue}>
            Continue
          </Button>
        </DialogActions>
      </BootstrapDialog>
      <BootstrapDialog
        onClose={handleSessionExpiredClose}
        aria-labelledby="customized-dialog-title"
        open={openSessionExpired}
      >
        <BootstrapDialogTitle id="customized-dialog-title" onClose={handleSessionExpiredClose}>
          <div style={{ color: 'steelblue', fontWeight: 'bold', fontFamily: 'arial' }}>
            Session Expired
          </div>
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <Typography gutterBottom>Your session has expired. Do you want to continue?</Typography>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={handleSessionExpiredClose}>
            Cancel
          </Button>
          <Button variant="contained" autoFocus onClick={handleSessionExpiredContinue}>
            Continue
          </Button>
        </DialogActions>
      </BootstrapDialog>
      <BootstrapDialog
        onClose={handleAPIErrorClose}
        aria-labelledby="customized-dialog-title"
        open={openAPIError}
      >
        <BootstrapDialogTitle id="customized-dialog-title" onClose={handleAPIErrorClose}>
          <div style={{ color: 'red', fontWeight: 'bold' }}>Error !</div>
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <Typography gutterBottom>
            An error has occured. Please try again at a later time.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={handleAPIErrorClose}>
            Ok
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </div>
  );
};

export default Home;
