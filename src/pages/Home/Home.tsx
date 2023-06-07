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

  async function sendMessage() {
    setDisabledBool(true);
    setDisplayValue('none');
    setData({ ...data, response: '' });
    setVisible(true);
    // remove system message to replace with System message parameter
    const newmessage = [...messages].slice(1);
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
    const responseData = await response.json();
    setVisible(false);
    setData({ ...data, response: responseData.choices[0].message.content, chatsession: '' });
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
    setTokenCount(
      tokenCount + data.chatsession.length / 4 + responseData.choices[0].message.content.length / 4
    );
    setDisplayValue('flex');
  }

  const bottomRef: any = useRef();

  async function handleSubmit(event: { preventDefault: () => void }) {
    event.preventDefault();
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
    <>
      <Menu
        temperature={temperature}
        handleTemperatureChange={handleTemperatureChange}
        topP={topP}
        handleTopPChange={handleTopPChange}
        maxTokens={maxTokens}
        handleMaxTokensChange={handleMaxTokensChange}
        handleSystemMessageValueChange={handleSystemMessageValueChange}
        systemMessageValue={systemMessageValue}
      />
      <br />
      <Messages
        bottomRef={bottomRef}
        messagesDisplay={messagesDisplay}
        displayValue={displayValue}
        visible={visible}
      />
      <form onSubmit={handleSubmit} style={{ marginLeft: '20px', marginTop: '20px' }}>
        <SendMessage
          handleChatsessionChange={handleChatsessionChange}
          data={data}
          tokenCount={tokenCount}
          disabledBool={disabledBool}
          temperature={temperature}
          handleTemperatureChange={handleTemperatureChange}
          topP={topP}
          handleTopPChange={handleTopPChange}
          maxTokens={maxTokens}
          handleMaxTokensChange={handleMaxTokensChange}
        />
      </form>
    </>
  );
};

export default Home;
