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

const Menu = (props: {
  temperature: number;
  handleTemperatureChange: (event: Event, value: number | number[], activeThumb: number) => void;
  topP: number;
  handleTopPChange: (event: Event, value: number | number[], activeThumb: number) => void;
  maxTokens: number;
  handleMaxTokensChange:
    | ((event: Event, value: number | number[], activeThumb: number) => void)
    | undefined;
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
  } = props;

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
