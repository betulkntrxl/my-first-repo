import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import AppBar from '@mui/material/AppBar';
import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Paper from '@mui/material/Paper';
import { Stack, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import LogoutIcon from '@mui/icons-material/Logout';
import LanguageIcon from '@mui/icons-material/Language';
import HorizontalRuleIcon from '@mui/icons-material/HorizontalRule';
import AccordionMenu from './AccordionMenu';
import Logo from './webimage-B31D6248-7763-4327-92184864D7920A7C.jpg';

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
  handleAPITimeoutChange: (event: Event, value: number | number[], activeThumb: number) => void;
  APITimeout: number;
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [version, setVersion] = useState('');
  const [state, setState] = useState({});
  const { t, i18n } = useTranslation();

  const handleDrawerToggle = () => {
    if (!mobileOpen) {
      // Tracking in app insights
      axios.post('/api/app-insights-event', {
        name: 'Menu opened',
      });
    }

    setMobileOpen(!mobileOpen);
  };

  async function getVersion() {
    try {
      await axios('/api/version').then(response => {
        if (response && response.data) {
          const { data } = response;
          setVersion(data.version);
        }
      });
    } catch {
      return '';
    }
    return null;
  }

  useEffect(() => {
    getVersion();
    return () => {
      setState({}); // clean state
    };
  }, [state]);

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
    handleAPITimeoutChange,
    APITimeout,
  } = props;

  const drawer = (
    <div style={{ overflowX: 'hidden' }}>
      <Stack direction="column">
        <Stack direction="row">
          <div
            style={{
              width: 340,
              textAlign: 'left',
              color: '#007BC7',
              fontSize: '18px',
              fontWeight: 'bolder',
              fontFamily: 'Arial',
              marginLeft: 20,
              marginTop: 30,
              marginBottom: 10,
            }}
          >
            {t('menu.title')}
          </div>
          <IconButton
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={handleDrawerToggle}
            style={{ float: 'right', marginRight: 5 }}
          >
            <CloseIcon style={{ color: '#007BC7', fontWeight: 'bold' }} />
          </IconButton>
        </Stack>
        <HorizontalRuleIcon
          preserveAspectRatio="none"
          sx={{
            color: '#007BC7',
            marginLeft: '-70px',
            width: '540px',
            maxWidth: 600,
            fontWeight: 'bolder',
          }}
        />
      </Stack>

      <AccordionMenu
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
        handleAPITimeoutChange={handleAPITimeoutChange}
        APITimeout={APITimeout}
      />

      <Paper
        elevation={1}
        style={{
          backgroundColor: '#e6e6e6',
          position: 'fixed',
          bottom: 0,
          width: 320,
          maxWidth: 500,
          padding: '10px',
          margin: 10,
          float: 'left',
        }}
      >
        <div style={{ color: '#007BC7', fontWeight: 'bold', fontFamily: 'Arial' }}>
          {t('menu.about')}
        </div>

        <div style={{ float: 'left', marginLeft: 10 }}>
          {t('menu.version')}: {version}
        </div>
      </Paper>
    </div>
  );

  const handleLanguage = () => {
    // Tracking in app insights
    axios.post('/api/app-insights-event', {
      name: 'ChatApp Language Changed',
    });

    i18n.changeLanguage(t('current-language') === 'en' ? 'cf' : 'en');
  };

  const handleLogout = () => {
    // Tracking in app insights
    axios.post('/api/app-insights-event', {
      name: 'ChatApp Logout Clicked',
    });

    window.location.href = '/api/auth/logout';
  };

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static" style={{ backgroundColor: 'white' }}>
          <Toolbar variant="regular" style={{ width: '95%' }}>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 1 }}
              onClick={handleDrawerToggle}
            >
              <MenuIcon color="primary" />
            </IconButton>
            <img alt="McKesson" width={150} src={Logo} />
            <Typography
              variant="h6"
              color="#005A8C"
              component="div"
              sx={{ flexGrow: 1, fontWeight: 'bold', fontFamily: 'arial', marginLeft: 1 }}
              title="menutitle"
            >
              ChatApp
            </Typography>
            <IconButton
              style={{ color: 'white', fontSize: '16' }}
              aria-label="logout"
              onClick={handleLogout}
            >
              <LogoutIcon color="primary" style={{ fontWeight: 'bold' }} />
              <Typography color="primary"> {t('buttons.logout')}</Typography>
            </IconButton>
            <IconButton style={{ color: 'white', fontSize: '16' }} onClick={handleLanguage}>
              <LanguageIcon color="primary" style={{ fontWeight: 'bold' }} />
              <Typography color="primary"> {t('current-language')}</Typography>
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
