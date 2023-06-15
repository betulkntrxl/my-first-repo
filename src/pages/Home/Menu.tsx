import AppBar from '@mui/material/AppBar';
import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import React from 'react';
import Paper from '@mui/material/Paper';
import Slider from '@mui/material/Slider';
import Tooltip from '@mui/material/Tooltip';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { Button, InputLabel, MenuItem, Stack, Typography } from '@mui/material';

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CloseIcon from '@mui/icons-material/Close';

const Menu = (props: {
  temperature: number;
  handleTemperatureChange: (event: Event, value: number | number[], activeThumb: number) => void;
  topP: number;
  handleTopPChange: (event: Event, value: number | number[], activeThumb: number) => void;
  maxTokens: number;
  handleMaxTokensChange:
    | ((event: Event, value: number | number[], activeThumb: number) => void)
    | undefined;
  handleSystemMessageValueChange: (event: { target: { name: any; value: any } }) => void;
  systemMessageValue: string;
  handlePastMessagesChange:
    | ((event: Event, value: number | number[], activeThumb: number) => void)
    | undefined;
  pastMessages: number;
}) => {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [version, setVersion] = React.useState('');

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  async function getVersion() {
    // GET request using fetch with async/await
    const response = await fetch('/api/version');
    if (typeof response !== 'undefined') {
      const dataver = await response.json();
      setVersion(dataver.version);
    }
  }

  const drawerWidth = 400;
  const {
    temperature,
    handleTemperatureChange,
    topP,
    handleTopPChange,
    maxTokens,
    handleMaxTokensChange,
    handleSystemMessageValueChange,
    systemMessageValue,
    handlePastMessagesChange,
    pastMessages,
  } = props;

  const [systemMessageTemplate, setsystemMessageTemplate] = React.useState('as an assistant');

  const handlesystemMessageTemplateChange = (event: SelectChangeEvent) => {
    setsystemMessageTemplate(event.target.value as string);
    handleSystemMessageValueChange(event);
  };

  const drawer = (
    <div>
      <Stack direction="row">
        <div
          style={{
            width: '90%',
            textAlign: 'left',
            color: 'cornflowerblue',
            fontSize: '18px',
            fontWeight: 'bolder',
            margin: 20,
          }}
        >
          Menu
        </div>
        <IconButton
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
          onClick={handleDrawerToggle}
          style={{ float: 'right' }}
        >
          <CloseIcon />
        </IconButton>
      </Stack>
      <hr />
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography style={{ color: 'cornflowerblue', fontWeight: 'bold' }}>
            Assistant Setup
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            <InputLabel id="systemMessageTemplate">System Template</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={systemMessageTemplate}
              label="Age"
              onChange={handlesystemMessageTemplateChange}
            >
              <MenuItem value="as an assistant">as an assistant</MenuItem>
              <MenuItem value="as a agent understanding the sentiment">
                as a agent understanding the sentiment
              </MenuItem>
              <MenuItem value="as a mentor using the Socratic method">
                as a mentor using the Socratic method
              </MenuItem>
            </Select>
            <br />
            System message:
            <Tooltip title="Give the model instructions about how it should behave and any context it should reference when generating a response. You can describe the assistant’s personality, tell it what it should and shouldn’t answer, and tell it how to format responses. There’s no token limit for this section, but it will be included with every API call, so it counts against the overall token limit.">
              <InfoOutlinedIcon />
            </Tooltip>{' '}
            <textarea
              placeholder="Type the system message here."
              ref={input => input && input.focus()}
              name="systemMessage"
              onChange={handleSystemMessageValueChange}
              rows={5}
              cols={50}
              value={systemMessageValue}
              style={{
                margin: '7px',
                width: '98%',
                fontFamily: 'sans-serif',
                padding: '5px 5px',
                boxSizing: 'border-box',
                border: '1',
                borderRadius: '4px',
                backgroundColor: '#f8f8f8',
                fontSize: '16px',
                resize: 'none',
              }}
            />
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2a-content"
          id="panel2a-header"
        >
          <Typography style={{ color: 'cornflowerblue', fontWeight: 'bold' }}>
            Configuration
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Temperature:{' '}
            <Tooltip title="Controls randomness. Lowering the temperature means that the model will produce more repetitive and deterministic responses. Increasing the temperature will result in more unexpected or creative responses. Try adjusting temperature or Top P but not both.">
              <InfoOutlinedIcon />
            </Tooltip>
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
            Max Tokens:{' '}
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
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel3a-content"
          id="panel3a-header"
        >
          <Typography style={{ color: 'cornflowerblue', fontWeight: 'bold' }}>Settings</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Past messages included:{' '}
            <Tooltip title="Select the number of past messages to include in each new API request. This helps give the model context for new user queries. Setting this number to 10 will include 5 user queries and 5 system responses.">
              <InfoOutlinedIcon />
            </Tooltip>
            <Slider
              valueLabelDisplay="auto"
              min={0}
              max={20}
              step={1}
              value={pastMessages}
              defaultValue={10}
              aria-label="Past messages included"
              onChange={handlePastMessagesChange}
            />
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Paper elevation={1} style={{ maxWidth: 500, padding: '10px', margin: 10, float: 'left' }}>
        <div style={{ color: 'cornflowerblue', fontWeight: 'bold' }}>About</div>
        <br />
        <Button
          style={{ float: 'left' }}
          onClick={() => {
            getVersion();
          }}
        >
          show version
        </Button>
        <div style={{ float: 'left', margin: 10 }}>version: {version}</div>
      </Paper>
    </div>
  );

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
            <Typography variant="h6" color="inherit" component="div" title="menutitle">
              McKesson Chat App
            </Typography>
          </Toolbar>
        </AppBar>
      </Box>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="Settings"
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
    </>
  );
};

export default Menu;
