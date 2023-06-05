import React, { useState, useEffect, useRef } from 'react';
import Slider from '@mui/material/Slider';
import Button from '@mui/material/Button';
import { styled } from '@mui/system';
import { Card, CardActionArea } from '@mui/material';
import CardContent from '@mui/material/CardContent';
import Paper from '@mui/material/Paper';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Drawer from '@mui/material/Drawer';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import SendIcon from '@mui/icons-material/Send';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import Tooltip from '@mui/material/Tooltip';

const Home = () => {
  const [data, setData] = useState({ chatsession: '', response: '' });
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
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const blue = {
    500: '#007FFF',
    600: '#0072E5',
    700: '#0059B2',
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

  const drawer = (
    <div>
      <Paper elevation={1} style={{ maxWidth: 500, padding: '10px', float: 'right' }}>
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
    </div>
  );

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

  function scrollToBottom() {
    setTimeout(() => {
      if (bottomRef.current) {
        bottomRef.current.scrollTop = bottomRef.current.scrollHeight;
      }
    }, 1000);
    return null;
  }

  async function handleSubmit(event: { preventDefault: () => void }) {
    event.preventDefault();
    sendMessage();
  }

  useEffect(() => {
    sendMessage();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleChatsessionChange = (event: { target: { name: any; value: any } }) => {
    setData({ ...data, [event.target.name]: event.target.value });
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawerWidth = 240;

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar variant="dense">
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
              onClick={handleDrawerToggle}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" color="inherit" component="div">
              Chat App
            </Typography>
          </Toolbar>
        </AppBar>
      </Box>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Drawer
          variant="temporary"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open={mobileOpen}
          onClose={handleDrawerToggle}
        >
          {drawer}
        </Drawer>
      </Box>

      <form onSubmit={handleSubmit} style={{ marginLeft: '20px', marginTop: '20px' }}>
        <Card
          variant="elevation"
          sx={{ Width: '100%' }}
          style={{ maxHeight: '60vh', overflow: 'auto', overflowY: 'scroll' }}
          ref={bottomRef}
        >
          <CardActionArea>
            <CardContent>
              {messages.map((value, index) => {
                if (value.role === 'user' && index !== 0) {
                  return (
                    <div key={value.content + 1}>
                      <br key={value.content + 2} />
                      <br key={value.content + 3} />
                      <Paper
                        key={value.content + 4}
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
                      <br key={value.content + 5} />
                    </div>
                  );
                }
                if (value.role === 'system' && index !== 0) {
                  return (
                    <div key={value.content + 6}>
                      <br key={value.content + 7} />
                      <br key={value.content + 8} />
                      <Paper
                        key={value.content + 9}
                        elevation={3}
                        style={{ padding: '10px', float: 'left', display: displayValue }}
                      >
                        {/* data.response */}
                        {value.content}
                      </Paper>
                      <br key={value.content + 10} />
                      <br key={value.content + 11} />
                    </div>
                  );
                }
                return (
                  <div key={value.content + 12}>
                    <br key={value.content + 13} />
                    <br key={value.content + 14} />
                  </div>
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
        <br />
        <br />
        <Paper
          sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, height: '80px' }}
          elevation={3}
        >
          <Stack direction="row">
            <Paper style={{ width: '50%' }}>
              <Stack direction="row">
                <Stack direction="column" style={{ width: '80%' }}>
                  <textarea
                    ref={input => input && input.focus()}
                    name="chatsession"
                    onChange={handleChatsessionChange}
                    rows={2}
                    cols={50}
                    value={data.chatsession}
                    style={{
                      margin: '7px',
                      width: '98%',
                      fontFamily: 'sans-serif',
                      padding: '5px 5px',
                      boxSizing: 'border-box',
                      border: '2px solid #ccc',
                      borderRadius: '4px',
                      backgroundColor: '#f8f8f8',
                      fontSize: '16px',
                      resize: 'none',
                    }}
                  />
                  <Grid item xs={4} style={{ marginLeft: '10px', marginTop: -10 }}>
                    Token Count: {tokenCount}
                  </Grid>
                </Stack>
                <Stack>
                  <CustomButton
                    variant="contained"
                    type="submit"
                    style={{ margin: '10px', width: '90px' }}
                  >
                    <SendIcon />
                  </CustomButton>
                </Stack>
              </Stack>
            </Paper>
            <Stack
              direction="row"
              spacing={2}
              style={{ width: '50%', padding: '5px', float: 'right' }}
            >
              <Paper
                style={{
                  width: '170px',
                  padding: 5,
                  marginTop: 2,
                  marginBottom: 15,
                  marginLeft: 20,
                  float: 'right',
                }}
              >
                Temperature:{' '}
                <Tooltip title="Controls randomness. Lowering the temperature means that the model will produce more repetitive and deterministic responses. Increasing the temperature will result in more unexpected or creative responses. Try adjusting temperature or Top P but not both.">
                  <InfoOutlinedIcon />
                </Tooltip>
                <br />{' '}
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
              </Paper>
              <Paper style={{ width: '170px', padding: 5, marginTop: 2, marginBottom: 15 }}>
                Top_P:{' '}
                <Tooltip title="Similar to temperature, this controls randomness but uses a different method. Lowering Top P will narrow the model’s token selection to likelier tokens. Increasing Top P will let the model choose from tokens with both high and low likelihood. Try adjusting temperature or Top P but not both.">
                  <InfoOutlinedIcon />
                </Tooltip>
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
              <Paper style={{ width: '170px', padding: 5, marginTop: 2, marginBottom: 15 }}>
                Max response:{' '}
                <Tooltip title="Set a limit on the number of tokens per model response. The API supports a maximum of 4000 tokens shared between the prompt (including system message, examples, message history, and user query) and the model's response. One token is roughly 4 characters for typical English text.">
                  <InfoOutlinedIcon />
                </Tooltip>
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
            </Stack>
          </Stack>
        </Paper>
      </form>
    </>
  );
};

export default Home;
