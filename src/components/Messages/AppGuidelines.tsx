import React from 'react';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';

export const AppGuidelines = () => {
  const { t } = useTranslation();
  const getAppGuidelineBulletPoint = (bulletPoint: string) => (
    <li>
      <Typography variant="body2">{bulletPoint}</Typography>
    </li>
  );
  return (
    <Box
      sx={{ display: { xs: 'none', sm: 'none', md: 'block', lg: 'block' } }}
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
          {getAppGuidelineBulletPoint(t('background.bullet1'))}
          {getAppGuidelineBulletPoint(t('background.bullet2'))}
          {getAppGuidelineBulletPoint(t('background.bullet3'))}
          {getAppGuidelineBulletPoint(t('background.bullet4'))}
          {getAppGuidelineBulletPoint(t('background.bullet5'))}
          {getAppGuidelineBulletPoint(t('background.bullet6'))}
          {getAppGuidelineBulletPoint(t('background.bullet7'))}
          {getAppGuidelineBulletPoint(t('background.bullet8'))}
        </ul>
      </div>
    </Box>
  );
};
