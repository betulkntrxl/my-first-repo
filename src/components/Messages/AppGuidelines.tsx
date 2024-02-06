import React from 'react';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';

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

        <ul style={{ textAlign: 'left', paddingLeft: '0px' }}>
          <li>{t('background.bullet1')}</li>
          <li>{t('background.bullet2')}</li>
          <li>{t('background.bullet3')}</li>
          <li>{t('background.bullet4')}</li>
          <li>{t('background.bullet5')}</li>
          <li>{t('background.bullet6')}</li>
          <li>{t('background.bullet7')}</li>
          <li>{t('background.bullet8')}</li>
        </ul>
      </div>
    </Box>
  );
};
