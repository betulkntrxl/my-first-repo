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
      // bottomRef.current.scrollTo({
      // top: bottomRef.current.scrollHeight,
      bottomRef.current.scrollTop = bottomRef.current.scrollHeight + 200;
      // behavior: 'smooth',
      // block: 'start',
      // });
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

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  const container = window !== undefined ? () => window.document.body : undefined;
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
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
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
          style={{ maxHeight: 450, overflow: 'auto' }}
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
        <Paper
          sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, height: '80px' }}
          elevation={3}
        >
          <textarea
            ref={input => input && input.focus()}
            name="chatsession"
            onChange={handleChatsessionChange}
            rows={2}
            cols={50}
            value={data.chatsession}
            style={{ margin: '10px' }}
          />
          <CustomButton
            variant="contained"
            type="submit"
            style={{ marginTop: '-30px', marginLeft: '10px' }}
          >
            Send
          </CustomButton>
          <Stack
            direction="row"
            spacing={2}
            style={{ width: '50%', padding: '10px', float: 'right' }}
          >
            <Paper style={{ width: '150px', padding: 10 }}>
              Temperature: <br />{' '}
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
            <Paper style={{ width: '150px', padding: 10 }}>
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
            <Paper style={{ width: '150px', padding: 10 }}>
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
          </Stack>
        </Paper>
      </form>
    </>
  );
};

export default Home;
