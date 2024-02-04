import React, { useEffect } from 'react';
import Paper from '@mui/material/Paper';
import { useSignal } from '@preact/signals-react';
import { useTranslation } from 'react-i18next';
import { Typography } from '@mui/material';
import VersionAndOrgClient from '../../clients/VersionAndOrgClient';
import MetricsClient from '../../clients/MetricsClient';
import { TraceSeverity } from '../../clients/models/MetricsModel';

export const About = () => {
  const version = useSignal('');
  const { t } = useTranslation();

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
    <Paper
      elevation={1}
      sx={{
        backgroundColor: '#e6e6e6',
        width: '100%',
        padding: '10px',
      }}
    >
      <Typography color="#007BC7" fontWeight="bold">
        {t('menu.about')}
      </Typography>

      <Typography>
        {t('menu.version')}: {version.value}
      </Typography>
    </Paper>
  );
};
