import AppBar from '@mui/material/AppBar';
import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Typography from '@mui/material/Typography';
import React from 'react';
import Paper from '@mui/material/Paper';
import Slider from '@mui/material/Slider';
import Tooltip from '@mui/material/Tooltip';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

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
}) => {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawerWidth = 240;
  const {
    temperature,
    handleTemperatureChange,
    topP,
    handleTopPChange,
    maxTokens,
    handleMaxTokensChange,
    handleSystemMessageValueChange,
    systemMessageValue,
  } = props;

  const drawer = (
    <div>
      <Paper elevation={1} style={{ maxWidth: 500, padding: '10px', float: 'right' }}>
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
            <Typography variant="h6" color="inherit" component="div">
              Chat App
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
