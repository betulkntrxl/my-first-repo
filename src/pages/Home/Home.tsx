import React, { useState, useRef } from 'react';
import Menu from './Menu';
import Messages from './Messages';
import SendMessage from './SendMessage';

const Home = () => {
  const [data, setData] = useState({ chatsession: '', response: '' });
  const [visible, setVisible] = useState(false);
  const [temperature, setTemperature] = useState<number>(0.7);
  const [topP, setTopP] = useState(0.95);
  const [maxTokens, setMaxTokens] = useState(800);
  const [pastMessages, setPastMessages] = useState(10);
  const [displayValue, setDisplayValue] = useState('none');
  const [tokenCount, setTokenCount] = useState(0);

  const [disabledBool, setDisabledBool] = useState(true);
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
  const conversationDisplay = [systemMessageDisplay];
  const [messages, setMessages] = useState(conversation);
  const [messagesDisplay, setMessagesDisplay] = useState(conversationDisplay);

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
      setMessagesDisplay([
        ...messagesDisplay,
        { role: 'user', content: data.chatsession, id: data.chatsession },
        { role: 'system', content: responseData.choices[0].message.content, id: responseData.id },
      ]);
      setVisible(false);

      setDisplayValue('flex');
    } else {
      // refresh the page
      window.history.go(0);
    }
  }

  const bottomRef: any = useRef();

  async function handleSubmit(event: { preventDefault: () => void }) {
    event.preventDefault();
    // display user message while waiting for response
    setMessagesDisplay([
      ...messagesDisplay,
      { role: 'user', content: data.chatsession, id: data.chatsession },
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
      {/* <ToolBar
        temperature={temperature}
        handleTemperatureChange={handleTemperatureChange}
        topP={topP}
        handleTopPChange={handleTopPChange}
        maxTokens={maxTokens}
        handleMaxTokensChange={handleMaxTokensChange}
      /> */}
      <div
        style={{
          //         background: 'url("/chatapp.png")',
          backgroundAttachment: 'fixed',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center 90px',
          width: '100%',
          float: 'right',
          margin: 10,
          height: 500,
        }}
      >
        {messages.length < 2 ? ( // hide background when chat starts
          <div
            style={{
              position: 'absolute',
              // color:'#B3CEDD',
              color: 'steelblue',
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
          />
        </form>
      </div>
    </div>
  );
};

export default Home;
