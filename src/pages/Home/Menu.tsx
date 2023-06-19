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
import {
  Button,
  Divider,
  Grid,
  Input,
  InputLabel,
  MenuItem,
  Stack,
  Typography,
} from '@mui/material';

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CloseIcon from '@mui/icons-material/Close';
import LogoutIcon from '@mui/icons-material/Logout';
import HorizontalRuleIcon from '@mui/icons-material/HorizontalRule';

const Menu = (props: {
  temperature: number;
  handleTemperatureChange: (event: Event, value: number | number[], activeThumb: number) => void;
  topP: number;
  handleTopPChange: (event: Event, value: number | number[], activeThumb: number) => void;
  maxTokens: number;
  handleMaxTokensChange: (event: Event, value: number | number[], activeThumb: number) => void;
  handleSystemMessageValueChange: (event: { target: { name: any; value: any } }) => void;
  systemMessageValue: string;
  handlePastMessagesChange: (event: Event, value: number | number[], activeThumb: number) => void;
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
  const [tempValue, setTempValue] = React.useState<number | string | Array<number | string>>(0.7);
  const [topPValue, setTopPValue] = React.useState<number | string | Array<number | string>>(0.95);
  const [maxTokensValue, setMaxTokensValue] = React.useState<
    number | string | Array<number | string>
  >(800);
  const [pastMessagesValue, setPastMessagesValue] = React.useState<
    number | string | Array<number | string>
  >(10);

  const handleTemperatureSliderChange = (event: Event, newValue: number | number[]) => {
    setTempValue(newValue);
    handleTemperatureChange(event, newValue, 1);
  };
  const handleTopPSliderChange = (event: Event, newValue: number | number[]) => {
    setTopPValue(newValue);
    handleTopPChange(event, newValue, 1);
  };
  const handleMaxTokensSliderChange = (event: Event, newValue: number | number[]) => {
    setMaxTokensValue(newValue);
    handleMaxTokensChange(event, newValue, 1);
  };
  const handlePastMessagesSliderChange = (event: Event, newValue: number | number[]) => {
    setPastMessagesValue(newValue);
    handlePastMessagesChange(event, newValue, 1);
  };
  const handleTemperatureInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (Number(event.target.value) < 0) {
      handleTemperatureChange(new Event('0'), 0, 1);
      setTempValue(0);
    } else if (Number(event.target.value) > 1) {
      handleTemperatureChange(new Event('1'), 1, 1);
      setTempValue(1);
    } else {
      handleTemperatureChange(new Event(event.target.value), Number(event.target.value), 1);
      setTempValue(Number(event.target.value));
    }
  };
  const handleTopPInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (Number(event.target.value) < 0) {
      handleTopPChange(new Event('0'), 0, 1);
      setTopPValue(0);
    } else if (Number(event.target.value) > 1) {
      handleTopPChange(new Event('1'), 1, 1);
      setTopPValue(1);
    } else {
      handleTopPChange(new Event(event.target.value), Number(event.target.value), 1);
      setTopPValue(Number(event.target.value));
    }
  };

  const handleMaxTokensInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (Number(event.target.value) <= 0) {
      handleMaxTokensChange(new Event('0'), 0, 1);
      setMaxTokensValue(0);
    } else if (Number(event.target.value) > 4096) {
      handleMaxTokensChange(new Event('4096'), 4096, 1);
      setMaxTokensValue(4096);
    } else {
      handleMaxTokensChange(new Event(event.target.value), Number(event.target.value), 1);
      setMaxTokensValue(Number(event.target.value).toFixed(0));
    }
  };
  const handlePastMessagesInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const tmpval = Number(event.target.value);
    if (tmpval <= 0) {
      handlePastMessagesChange(new Event('0'), 0, 1);
      setPastMessagesValue(0);
    } else if (tmpval > 20) {
      handlePastMessagesChange(new Event('20'), 20, 1);
      setPastMessagesValue(20);
    } else {
      handlePastMessagesChange(new Event(tmpval.toString()), tmpval, 1);
      setPastMessagesValue(event.target.value === '' ? '' : Number(event.target.value).toFixed(0));
    }
  };

  const handleTemperatureBlur = () => {
    if (Number(tempValue) < 0) {
      setTempValue(0);
      handleTemperatureChange(new Event('0'), 0, 1);
    } else if (Number(tempValue) > 1) {
      setTempValue(1);
      handleTemperatureChange(new Event('1'), 1, 1);
    }
  };
  const handleTopPBlur = () => {
    if (Number(topPValue) < 0) {
      setTopPValue(0);
      handleTopPChange(new Event('0'), 0, 1);
    } else if (Number(topPValue) > 1) {
      setTopPValue(1);
      handleTopPChange(new Event('1'), 1, 1);
    }
  };
  const handleMaxTokensBlur = () => {
    if (Number(maxTokensValue) < 0) {
      setMaxTokensValue(0);
      handleMaxTokensChange(new Event('0'), 0, 1);
    } else if (Number(maxTokensValue) > 4096) {
      setMaxTokensValue(4096);
      handleMaxTokensChange(new Event('4096'), 4096, 1);
    }
  };
  const handlePastMessagesBlur = () => {
    if (Number(pastMessagesValue) < 0) {
      setPastMessagesValue(0);
      handlePastMessagesChange(new Event('0'), 0, 1);
    } else if (Number(pastMessagesValue) > 20) {
      setPastMessagesValue(20);
      handlePastMessagesChange(new Event('20'), 20, 1);
    }
  };

  const drawer = (
    <div>
      <Stack direction="column">
        <Stack direction="row">
          <div
            style={{
              width: '90%',
              textAlign: 'left',
              color: '#007BC7',
              fontSize: '18px',
              fontWeight: 'bolder',
              fontFamily: 'Arial',
              margin: 20,
              marginTop: 30,
              marginBottom: 10,
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
            <CloseIcon style={{ color: '#007BC7', fontWeight: 'bold' }} />
          </IconButton>
        </Stack>
        <HorizontalRuleIcon
          preserveAspectRatio="none"
          sx={{
            color: '#007BC7',
            marginLeft: '-70px',
            width: '530px',
            maxWidth: 600,
            fontWeight: 'bolder',
          }}
        />
      </Stack>

      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography style={{ color: '#007BC7', fontWeight: 'bold', fontFamily: 'Arial' }}>
            Assistant Setup
          </Typography>
        </AccordionSummary>
        <Divider variant="middle" />
        <AccordionDetails>
          <Typography>
            <InputLabel id="systemMessageTemplate">System Message Template</InputLabel>
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
          <Typography style={{ color: '#007BC7', fontWeight: 'bold', fontFamily: 'Arial' }}>
            Configuration
          </Typography>
        </AccordionSummary>
        <Divider variant="middle" />
        <AccordionDetails>
          <Typography>
            Temperature:{' '}
            <Tooltip title="Controls randomness. Lowering the temperature means that the model will produce more repetitive and deterministic responses. Increasing the temperature will result in more unexpected or creative responses. Try adjusting temperature or Top P but not both.">
              <InfoOutlinedIcon />
            </Tooltip>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs>
                <Slider
                  valueLabelDisplay="auto"
                  min={0}
                  max={1}
                  step={0.1}
                  value={temperature}
                  defaultValue={0.7}
                  aria-label="Temperature"
                  onChange={handleTemperatureSliderChange}
                  aria-labelledby="temperature-input-slider"
                />
              </Grid>
              <Grid item>
                <Input
                  value={tempValue}
                  size="small"
                  onChange={handleTemperatureInputChange}
                  onBlur={handleTemperatureBlur}
                  inputProps={{
                    step: 0.1,
                    min: 0,
                    max: 1,
                    type: 'number',
                    'aria-labelledby': 'temperature-input-slider',
                  }}
                />
              </Grid>
            </Grid>
            Top_P:{' '}
            <Tooltip title="Similar to temperature, this controls randomness but uses a different method. Lowering Top P will narrow the model’s token selection to likelier tokens. Increasing Top P will let the model choose from tokens with both high and low likelihood. Try adjusting temperature or Top P but not both.">
              <InfoOutlinedIcon />
            </Tooltip>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs>
                <Slider
                  valueLabelDisplay="auto"
                  min={0}
                  max={1}
                  step={0.05}
                  value={topP}
                  defaultValue={0.95}
                  aria-label="Top P"
                  onChange={handleTopPSliderChange}
                  aria-labelledby="topp-input-slider"
                />
              </Grid>
              <Grid item>
                <Input
                  value={topPValue}
                  size="small"
                  onChange={handleTopPInputChange}
                  onBlur={handleTopPBlur}
                  inputProps={{
                    step: 0.1,
                    min: 0,
                    max: 1,
                    type: 'number',
                    'aria-labelledby': 'topp-input-slider',
                  }}
                />
              </Grid>
            </Grid>
            Max Tokens:{' '}
            <Tooltip title="Set a limit on the number of tokens per model response. The API supports a maximum of 4000 tokens shared between the prompt (including system message, examples, message history, and user query) and the model's response. One token is roughly 4 characters for typical English text.">
              <InfoOutlinedIcon />
            </Tooltip>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs>
                <Slider
                  valueLabelDisplay="auto"
                  min={0}
                  max={4096}
                  step={1}
                  value={maxTokens}
                  defaultValue={800}
                  aria-label="Max Tokens"
                  onChange={handleMaxTokensSliderChange}
                  aria-labelledby="maxtokens-input-slider"
                />
              </Grid>
              <Grid item>
                <Input
                  value={maxTokensValue}
                  size="small"
                  onChange={handleMaxTokensInputChange}
                  onBlur={handleMaxTokensBlur}
                  inputProps={{
                    step: 1,
                    min: 0,
                    max: 4096,
                    type: 'number',
                    'aria-labelledby': 'maxtokens-input-slider',
                  }}
                />
              </Grid>
            </Grid>
            <Typography>
              Past messages included:{' '}
              <Tooltip title="Select the number of past messages to include in each new API request. This helps give the model context for new user queries. Setting this number to 10 will include 5 user queries and 5 system responses.">
                <InfoOutlinedIcon />
              </Tooltip>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs>
                  <Slider
                    valueLabelDisplay="auto"
                    min={0}
                    max={20}
                    step={1}
                    value={pastMessages}
                    defaultValue={10}
                    aria-label="Past messages included"
                    onChange={handlePastMessagesSliderChange}
                    aria-labelledby="pastmessages-input-slider"
                  />
                </Grid>
                <Grid item>
                  <Input
                    value={pastMessagesValue}
                    size="small"
                    onChange={handlePastMessagesInputChange}
                    onBlur={handlePastMessagesBlur}
                    inputProps={{
                      step: 1,
                      min: 0,
                      max: 20,
                      type: 'number',
                      'aria-labelledby': 'pastmessages-input-slider',
                    }}
                  />
                </Grid>
              </Grid>
            </Typography>
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Paper elevation={1} style={{ maxWidth: 500, padding: '10px', margin: 10, float: 'left' }}>
        <div style={{ color: '#007BC7', fontWeight: 'bold', fontFamily: 'Arial' }}>About</div>
        <br />
        <Button
          style={{ float: 'left' }}
          onClick={() => {
            getVersion();
          }}
        >
          show version
        </Button>
        <div style={{ float: 'left', margin: 10 }}>Version: {version}</div>
      </Paper>
    </div>
  );

  const handleLogout = () => {
    window.location.href = '/api/auth/logout';
  };

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar variant="regular" style={{ width: '95%' }}>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
              onClick={handleDrawerToggle}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              variant="h6"
              color="inherit"
              component="div"
              sx={{ flexGrow: 1 }}
              title="menutitle"
            >
              McKesson Chat GPT App
            </Typography>
            <IconButton style={{ color: 'white', fontSize: '16' }} onClick={handleLogout}>
              <LogoutIcon style={{ color: 'white' }} />
              <Typography> Logout</Typography>
            </IconButton>
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
