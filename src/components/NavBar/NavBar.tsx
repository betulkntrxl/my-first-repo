import React from 'react';
import { signal } from '@preact/signals-react';
import { useTranslation } from 'react-i18next';

import AppBar from '@mui/material/AppBar';
import Drawer from '@mui/material/Drawer';
import Stack from '@mui/material/Stack';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import LogoutIcon from '@mui/icons-material/Logout';
import LanguageIcon from '@mui/icons-material/Language';
import Divider from '@mui/material/Divider';
import CloseIcon from '@mui/icons-material/Close';
import MetricsClient from '../../clients/MetricsClient';
import McKessonLogo from '../../assets/mckesson-logo.jpg';
import UsonLogo from '../../assets/uson-logo.png';
import MenuDrawer from './MenuDrawer';
import { orgDeployment } from '../../pages/Home/Home';
import { systemMessageValue } from '../AssistantSetupMenu/AssistantSetupMenu';
import { About } from './About';
import { AboutListItem, ChatAppLogo, MenuDivider } from './NavBar.styles';

export const menuDrawerOpen = signal(false);
export const drawerWidth = 400;

const NavBar = () => {
  const { t, i18n } = useTranslation();

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

  return (
    <AppBar sx={{ background: 'white' }}>
      <Toolbar sx={{ height: '66px' }}>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={() => handleDrawerToggle()}
        >
          <MenuIcon color="primary" />
        </IconButton>

        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          spacing={0}
          sx={{ width: '100%' }}
        >
          <Stack direction="row" alignItems="center" spacing={1}>
            <img
              alt={orgDeployment.value}
              width={150}
              src={orgDeployment.value === 'uson' ? UsonLogo : McKessonLogo}
            />
            <ChatAppLogo title="ChatApp">ChatApp</ChatAppLogo>
          </Stack>
          <IconButton aria-label="language" onClick={handleLanguage}>
            <LanguageIcon color="primary" />
            <Typography color="primary"> {t('current-language')}</Typography>
          </IconButton>
        </Stack>

        <Drawer
          variant="temporary"
          open={menuDrawerOpen.value}
          onClose={() => handleDrawerToggle()}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              maxWidth: { xs: '100%', sm: drawerWidth },
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
                <Typography fontWeight="bold" color="#007BC7" fontSize="18px">
                  {' '}
                  {t('menu.title')}{' '}
                </Typography>
                <IconButton
                  color="inherit"
                  aria-label="close-menu"
                  onClick={() => handleDrawerToggle()}
                >
                  <CloseIcon sx={{ color: '#007BC7' }} />
                </IconButton>
              </Stack>
            </ListItem>
            <MenuDivider />

            {/* <ListItem>
              <IconButton aria-label="language" onClick={handleLanguage}>
                <LanguageIcon color="primary" />
                <Typography color="primary"> {t('current-language')}</Typography>
              </IconButton>
            </ListItem> */}
            <Divider />

            <ListItem>
              <MenuDrawer />
            </ListItem>

            <Divider />

            <ListItem>
              <IconButton sx={{ color: 'white' }} aria-label="logout" onClick={handleLogout}>
                <LogoutIcon color="primary" />
                <Typography color="primary"> {t('buttons.logout')}</Typography>
              </IconButton>
            </ListItem>

            <Divider />

            <AboutListItem>
              <About />
            </AboutListItem>
          </List>
        </Drawer>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
