import React, { useState, useEffect, useRef } from 'react';
import Slider from '@mui/material/Slider';
import Button from '@mui/material/Button';
import { styled } from '@mui/system';
import { Card, CardActionArea } from '@mui/material';
import CardContent from '@mui/material/CardContent';
import Paper from '@mui/material/Paper';

const Home = () => {
  const [data, setData] = useState({ chatsession: '', response: '' });
  const [sent, setSent] = useState('');
  const [visible, setVisible] = useState(false);
  const [temperature, setTemperature] = useState<number>(0.7);
  const [topP, setTopP] = useState(0.95);
  const [maxTokens, setMaxTokens] = useState(800);
  const [displayValue, setDisplayValue] = useState('none');
  const [tokenCount, setTokenCount] = useState(0);
  const systemMessage = {
    role: 'system',
    content: 'Assistant is a large language model trained by OpenAI.',
  };
  const conversation = [systemMessage];
  const [messages, setMessages] = useState(conversation);
  const blue = {
    500: '#007FFF',
    600: '#0072E5',
    700: '#0059B2',
  };

  const CustomButton = styled(Button)`
    font-family: IBM Plex Sans, sans-serif;
    font-weight: bold;
    font-size: 0.875rem;
    background-color: ${blue[500]};
    padding: 12px 24px;
    border-radius: 12px;
    color: white;
    transition: all 150ms ease;
    cursor: pointer;
    border: none;

    &:hover {
      background-color: ${blue[600]};
    }
  `;

  async function sendMessage() {
    setSent(data.chatsession);
    setDisplayValue('none');
    setData({ ...data, response: '' });
    setVisible(true);
    const response = await fetch('/api/prompt', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [...messages, { role: 'user', content: data.chatsession }],
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
      ...messages,
      { role: 'user', content: data.chatsession },
      { role: 'system', content: responseData.choices[0].message.content },
    ]);
    setTokenCount(
      tokenCount + data.chatsession.length / 4 + responseData.choices[0].message.content.length / 4
    );
    setDisplayValue('flex');
  }

  const bottomRef: any = useRef();

  const scrollToBottom = () => {
    if (bottomRef.current) {
      bottomRef.current.scrollTo({
        top: bottomRef.current.scrollHeight,
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  async function handleSubmit(event: { preventDefault: () => void }) {
    event.preventDefault();
    sendMessage();
    scrollToBottom();
    // console.log(responseData);
  }

  useEffect(() => {
    sendMessage();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleChatsessionChange = (event: { target: { name: any; value: any } }) => {
    setData({ ...data, [event.target.name]: event.target.value });
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

  return (
    <>
      <h1 style={{ marginLeft: '20px', marginTop: '20px' }}>Chat App</h1>
      <form onSubmit={handleSubmit} style={{ marginLeft: '20px', marginTop: '20px' }}>
        <Card
          variant="elevation"
          sx={{ Width: '100%' }}
          style={{ maxHeight: 300, overflow: 'auto' }}
          ref={bottomRef}
        >
          <CardActionArea>
            <CardContent>
              {messages.map((value, index, array) => {
                if (value.role === 'user' && index !== 0) {
                  return (
                    <>
                      <br />
                      <br />
                      <Paper
                        key={value.content}
                        elevation={3}
                        style={{
                          padding: '10px',
                          display: value.content.length === 0 ? 'none' : 'block',
                          justifyContent: 'flex-end',
                          float: 'right',
                        }}
                      >
                        {value.content}
                        {/* sent */}
                      </Paper>
                      <br />
                    </>
                  );
                }
                if (value.role === 'system' && index !== 0) {
                  return (
                    <>
                      <br />
                      <br />
                      <Paper
                        key={value.content}
                        elevation={3}
                        style={{ padding: '10px', float: 'left', display: displayValue }}
                      >
                        {/* data.response */}
                        {value.content}
                      </Paper>
                      <br />
                      <br />
                    </>
                  );
                }
                return (
                  <>
                    <br />
                    <br />
                  </>
                );
              })}
              {scrollToBottom()}
              <br />
              <br />
              {visible ? <img src="/typing.gif" alt="typing" width="50px" /> : null}
              <br />
            </CardContent>
          </CardActionArea>
        </Card>
        Token Count: {tokenCount}
        <br />
        <br />
        <Paper elevation={1} sx={{ maxWidth: 800 }} style={{ padding: '10px', height: '200px' }}>
          <textarea
            ref={input => input && input.focus()}
            name="chatsession"
            onChange={handleChatsessionChange}
            rows={2}
            cols={50}
            value={data.chatsession}
          />
          <CustomButton
            variant="contained"
            type="submit"
            style={{ marginTop: '-30px', marginLeft: '10px' }}
          >
            Send
          </CustomButton>
          <Paper elevation={1} style={{ maxWidth: 245, padding: '10px', float: 'right' }}>
            Temperature:{' '}
            <Slider
              valueLabelDisplay="auto"
              min={0}
              max={1}
              step={0.1}
              value={temperature}
              defaultValue={0.7}
              aria-label="Temperature"
              onChange={handleTemperatureChange}
            />
            Top_P:{' '}
            <Slider
              valueLabelDisplay="auto"
              min={0}
              max={1}
              step={0.05}
              value={topP}
              defaultValue={0.95}
              aria-label="Top P"
              onChange={handleTopPChange}
            />
            Max Tokens:{' '}
            <Slider
              valueLabelDisplay="auto"
              min={0}
              max={4096}
              step={1}
              value={maxTokens}
              defaultValue={800}
              aria-label="Max Tokens"
              onChange={handleMaxTokensChange}
            />
          </Paper>
        </Paper>
      </form>
    </>
  );
};

export default Home;
