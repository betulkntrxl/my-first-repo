import React, { useEffect, useState } from 'react';
import { signal, useSignal } from '@preact/signals-react';

import { useTranslation } from 'react-i18next';

import AppBar from '@mui/material/AppBar';
import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import LogoutIcon from '@mui/icons-material/Logout';
import LanguageIcon from '@mui/icons-material/Language';
import Divider from '@mui/material/Divider';
import CloseIcon from '@mui/icons-material/Close';
import Paper from '@mui/material/Paper';
import MetricsClient from '../../clients/MetricsClient';
import McKessonLogo from '../../assets/mckesson-logo.jpg';
import UsonLogo from '../../assets/uson-logo.png';
import MenuDrawer from './MenuDrawer';
import { orgDeployment } from '../../pages/Home/Home';
import { systemMessageValue } from '../AssistantSetupMenu/AssistantSetupMenu';
import VersionAndOrgClient from '../../clients/VersionAndOrgClient';
import { TraceSeverity } from '../../clients/models/MetricsModel';

export const menuDrawerOpen = signal(false);
export const drawerWidth = 400;

const NavBar = () => {
  const { t, i18n } = useTranslation();
  const version = useSignal('');

  const handleDrawerToggle = () => {
    menuDrawerOpen.value = !menuDrawerOpen.value;
  };

  const handleLanguage = () => {
    const changeLanguageTo = t('current-language').toLowerCase() === 'en' ? 'fr' : 'en';

    // Persist to local storage
    localStorage.setItem('i18nextLng', changeLanguageTo);

    // Tracking in app insights
    MetricsClient.sendEvent({
      name: `ChatApp Language Changed to ${changeLanguageTo}`,
    });

    // To translate the System Message, we need to get the resource bundle
    // and get the key/values for the systemMessageTemplates
    const resourceBundle = i18n.getResourceBundle(t('current-language').toLowerCase(), '');
    const systemMessageTemplates =
      resourceBundle.menu['assistant-setup']['message-template']['system-message-template'];

    // We then need to get the key for the current System message
    // so we're doing a reverse lookup i.e. given the value what is the key
    let systemMessageKey: string;
    Object.keys(systemMessageTemplates).forEach(key => {
      const value = systemMessageTemplates[key];

      if (value === systemMessageValue.value) {
        systemMessageKey = key;
      }
    });

    // Change the language for the ChatApp
    i18n.changeLanguage(changeLanguageTo, (error, translate) => {
      // If we found a key that matches the system message value
      // then use that key to translate the system message.
      // If we don't find a key then the system message value must be a custom
      // message typed in by the user, we ignore  this and leave this text in place
      if (systemMessageKey) {
        systemMessageValue.value = translate(
          `menu.assistant-setup.message-template.system-message-template.${systemMessageKey}`,
        );
      }
    });
  };

  const handleLogout = () => {
    // Tracking in app insights
    MetricsClient.sendEvent({
      name: 'ChatApp Logout Clicked',
    });

    window.location.href = '/api/auth/logout';
  };

  const getVersion = async () => {
    VersionAndOrgClient.getApplicationVersion()
      .then(response => {
        version.value = response.data.version;
      })
      .catch(error => {
        MetricsClient.sendTrace({
          message: 'ChatApp failed to retrieve version',
          severity: TraceSeverity.ERROR,
          properties: { errorResponse: error.response },
        });
      });
  };

  useEffect(() => {
    getVersion();
  }, [version]);

  return (
    <>
      {/* <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static" style={{ backgroundColor: 'white' }}>
          <Toolbar variant="regular" style={{ width: '95%' }}>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open-menu"
              sx={{ mr: 1 }}
              onClick={handleDrawerToggle}
            >
              <MenuIcon color="primary" />
            </IconButton>
            <img
              alt={orgDeployment.value}
              width={150}
              src={orgDeployment.value === 'uson' ? UsonLogo : McKessonLogo}
            />

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
            <IconButton
              style={{ color: 'white', fontSize: '16' }}
              aria-label="language"
              onClick={handleLanguage}
            >
              <LanguageIcon color="primary" style={{ fontWeight: 'bold' }} />
              <Typography color="primary"> {t('current-language')}</Typography>
            </IconButton>
          </Toolbar>
        </AppBar>
      </Box> */}
      {/* <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="Settings"
      > */}
      {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
      {/* <Drawer
          variant="temporary"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open={menuDrawerOpen.value}
          onClose={handleDrawerToggle}
        >
          <MenuDrawer />
        </Drawer>
      </Box> */}
      <AppBar sx={{ background: 'white' }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            // onClick={() => setIsDrawerOpen(true)}
            onClick={handleDrawerToggle}
          >
            <MenuIcon color="primary" />
          </IconButton>
          <img
            alt={orgDeployment.value}
            width={150}
            src={orgDeployment.value === 'uson' ? UsonLogo : McKessonLogo}
          />
          <Typography
            variant="h6"
            color="#005A8C"
            component="div"
            sx={{ fontWeight: 'bold', fontFamily: 'arial', marginLeft: 1 }}
            title="menutitle"
          >
            ChatApp
          </Typography>

          {/* <Drawer open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} > */}
          <Drawer
            open={menuDrawerOpen.value}
            onClose={() => handleDrawerToggle}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
            sx={{
              '& .MuiDrawer-paper': {
                boxSizing: 'border-box',
                maxWidth: { xs: '320px', sm: drawerWidth },
              },
            }}
          >
            <List sx={{ height: '100%' }}>
              <ListItem>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  spacing={2}
                  sx={{ width: '100%' }}
                >
                  <div
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      color: '#007BC7',
                      fontSize: '18px',
                      fontWeight: 'bolder',
                      fontFamily: 'Arial',
                      marginLeft: 8,
                      // marginTop: 30,
                      // marginBottom: 10,
                    }}
                  >
                    {t('menu.title')}
                  </div>
                  <IconButton color="inherit" aria-label="close-menu" onClick={handleDrawerToggle}>
                    <CloseIcon style={{ color: '#007BC7', fontWeight: 'bold' }} />
                  </IconButton>
                </Stack>
              </ListItem>
              <Divider sx={{ background: '#007BC7', height: '1px' }} />
              <ListItem>
                <IconButton
                  style={{ color: 'white', fontSize: '16' }}
                  aria-label="logout"
                  onClick={handleLogout}
                >
                  <LogoutIcon color="primary" style={{ fontWeight: 'bold' }} />
                  <Typography color="primary"> {t('buttons.logout')}</Typography>
                </IconButton>
              </ListItem>

              <ListItem>
                <IconButton
                  style={{ color: 'white', fontSize: '16' }}
                  aria-label="language"
                  onClick={handleLanguage}
                >
                  <LanguageIcon color="primary" style={{ fontWeight: 'bold' }} />
                  <Typography color="primary"> {t('current-language')}</Typography>
                </IconButton>
              </ListItem>
              <Divider />

              <ListItem>
                <MenuDrawer />
              </ListItem>

              <ListItem sx={{ position: 'absolute', bottom: 0 }}>
                <Paper
                  elevation={1}
                  sx={{
                    backgroundColor: '#e6e6e6',
                    // position: 'absolute',
                    // bottom: 0,
                    width: '100%',
                    // // maxWidth: 500,
                    // maxWidth: { xs: '320px', sm: drawerWidth },
                    padding: '10px',
                    // margin: 10,
                    // float: 'left',
                    // minHeight: '6vh',
                    // maxHeight: '6vh',
                  }}
                >
                  <div style={{ color: '#007BC7', fontWeight: 'bold', fontFamily: 'Arial' }}>
                    {t('menu.about')}
                  </div>

                  <div style={{ float: 'left' }}>
                    {t('menu.version')}: {version.value}
                  </div>
                </Paper>
              </ListItem>
            </List>
          </Drawer>
        </Toolbar>
      </AppBar>
    </>
  );
};

export default NavBar;
