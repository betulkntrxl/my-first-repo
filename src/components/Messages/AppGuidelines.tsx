import React from 'react';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';

export const AppGuidelines = () => {
  const { t } = useTranslation();

  return (
    <Box
      sx={{ display: { xs: 'none', sm: 'none', lg: 'block' } }}
      style={{
        color: 'steelblue',
        opacity: 0.6,
        top: 0,
        left: 0,
        right: 0,
        fontFamily: 'arial',
      }}
    >
      <div style={{ fontSize: 14, textAlign: 'center', margin: 5 }}>
        {t('background.title')}

        <ul style={{ textAlign: 'left', paddingLeft: '16px' }}>
          <li>
            <Typography variant="body2">{t('background.bullet1')}</Typography>
          </li>
          <li>
            <Typography variant="body2">{t('background.bullet2')}</Typography>
          </li>
          <li>
            <Typography variant="body2">{t('background.bullet3')}</Typography>
          </li>
          <li>
            <Typography variant="body2">{t('background.bullet4')}</Typography>
          </li>
          <li>
            <Typography variant="body2">{t('background.bullet5')}</Typography>
          </li>
          <li>
            <Typography variant="body2">{t('background.bullet6')}</Typography>
          </li>
          <li>
            <Typography variant="body2">{t('background.bullet7')}</Typography>
          </li>
          <li>
            <Typography variant="body2">{t('background.bullet8')}</Typography>
          </li>
        </ul>
      </div>
    </Box>
  );
};
