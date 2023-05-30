import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import Button from '@mui/material/Button';
import { styled } from '@mui/system';
import { Card, CardActionArea, CardActions } from '@mui/material';
import CardContent from '@mui/material/CardContent';
import Paper from '@mui/material/Paper';

const Home = () => {
  const [data, setData] = useState({ chatsession: '', response: '' });
  const [sent, setSent] = useState('');
  const [visible, setVisible] = useState(false);
  const [temperature, setTemperature] = useState<number>(0.7);
  const [topP, setTopP] = useState(0.95);
  const [displayValue, setDisplayValue] = useState('none');

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
  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    setSent(data.chatsession);
    setDisplayValue('none');
    setData({ ...data, response: '' });
    setVisible(true);
    const response = await fetch(
      'https://openai-nonprod-test4.openai.azure.com/openai/deployments/openai-nonprod-gpt35-turbo-test4/chat/completions?api-version=2023-03-15-preview',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': 'd80a347c4f164802b2f241afb298db34',
        },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: 'Assistant is a large language model trained by OpenAI.' },
            { role: 'user', content: data.chatsession },
          ],
          temperature,
          top_p: topP,
          frequency_penalty: 0,
          presence_penalty: 0,
          max_tokens: 800,
          stop: null,
        }),
      }
    );
    const responseData = await response.json();
    setVisible(false);
    setData({ ...data, response: responseData.choices[0].message.content, chatsession: '' });
    setDisplayValue('flex');
    console.log(responseData);
  };

  const handleChatsessionChange = (event: { target: { name: any; value: any } }) => {
    setData({ ...data, [event.target.name]: event.target.value });
  };

  const handleTemperatureChange = (
    event: Event,
    newValue: number | number[],
    activeThumb: number
  ) => {
    setTemperature(newValue as number);
  };

  const handleTopPChange = (event: Event, newValue: number | number[], activeThumb: number) => {
    setTopP(newValue as number);
  };
  return (
    <>
      <h1 style={{ marginLeft: '20px', marginTop: '20px' }}>Chat App</h1>
      <form onSubmit={handleSubmit} style={{ marginLeft: '20px', marginTop: '20px' }}>
        <Card variant="elevation" sx={{ maxWidth: 445 }}>
          <CardActionArea>
            <CardContent>
              <div style={{ float: 'right' }}>Sent:</div> <br />
              <Paper
                elevation={3}
                style={{
                  padding: '10px',
                  display: displayValue,
                  justifyContent: 'flex-end',
                  float: 'right',
                }}
              >
                {sent}
              </Paper>
              <br />
              <br />
              <br />
              Response: <br />
              {visible ? <img src="/typing.gif" alt="typing" width="50px" /> : null}
              <Paper
                elevation={3}
                style={{ padding: '10px', float: 'left', display: displayValue }}
              >
                {data.response}
              </Paper>
              <br />
              <br />
            </CardContent>
          </CardActionArea>
        </Card>
        <br />

        <Paper elevation={1} sx={{ maxWidth: 500 }} style={{ padding: '10px' }}>
          Chat session: <br />
          <textarea
            name="chatsession"
            onChange={handleChatsessionChange}
            rows={3}
            cols={50}
            value={data.chatsession}
          />
          <CustomButton variant="contained" type="submit" style={{ marginTop: '-50px' }}>
            Send
          </CustomButton>
          <Paper elevation={1} style={{ maxWidth: 345, padding: '10px' }}>
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
          </Paper>
        </Paper>
      </form>
    </>
  );
};

export default Home;
