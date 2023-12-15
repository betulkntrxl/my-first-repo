import React, { useEffect } from 'react';
import { useSignal } from '@preact/signals-react';

import { useTranslation } from 'react-i18next';

import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import { Stack } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import HorizontalRuleIcon from '@mui/icons-material/HorizontalRule';
import { TraceSeverity } from '../../clients/models/MetricsModel';
import VersionAndOrgClient from '../../clients/VersionAndOrgClient';
import MetricsClient from '../../clients/MetricsClient';
import AccordionMenu from '../AccordionMenu/AccordionMenu';
import { menuDrawerOpen } from './NavBar';

const MenuDrawer = () => {
  const { t } = useTranslation();
  const version = useSignal('');

  const handleDrawerClose = () => {
    menuDrawerOpen.value = false;
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
    <div style={{ overflowX: 'hidden', minHeight: '88vh', maxHeight: '88vh' }}>
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
            aria-label="close-menu"
            sx={{ mr: 2 }}
            onClick={handleDrawerClose}
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

      <AccordionMenu />

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
          minHeight: '6vh',
          maxHeight: '6vh',
        }}
      >
        <div style={{ color: '#007BC7', fontWeight: 'bold', fontFamily: 'Arial' }}>
          {t('menu.about')}
        </div>

        <div style={{ float: 'left', marginLeft: 10 }}>
          {t('menu.version')}: {version.value}
        </div>
      </Paper>
    </div>
  );
};

export default MenuDrawer;
