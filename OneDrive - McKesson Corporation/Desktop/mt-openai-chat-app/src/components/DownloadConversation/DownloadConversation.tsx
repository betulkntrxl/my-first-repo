import React from 'react';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import { Grid, Tooltip } from '@mui/material';
import { t } from 'i18next';
import { CustomIcon } from '../SendMessage/SendMessage.styles';
import { allMessagesToDisplay } from '../SendMessage/SendMessage';
import MetricsClient from '../../clients/MetricsClient';

const DownloadConversation = () => {
  const downloadAsText = () => {
    const messageArray: string[] = [];
    allMessagesToDisplay.value.map(value =>
      value.role === 'user'
        ? messageArray.push(`user: ${value.content}`)
        : messageArray.push(`bot: ${value.content}`),
    );
    const filename = `ChatApp - ${Date.now()}.txt`;
    const text = messageArray.join(`\n\n`);
    const element = document.createElement('a');
    element.setAttribute('href', `data:text/plain;charset=utf-8,${encodeURIComponent(text)}`);
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    MetricsClient.sendEvent({
      name: `ChatApp download conversation clicked.`,
    });
  };

  return (
    <Grid item xs sx={{ paddingTop: '0px' }}>
      <Tooltip title={t('text-download')}>
        <CustomIcon onClick={downloadAsText} data-testid="textIcon">
          <FileDownloadOutlinedIcon
            data-testid="downloadIcon"
            style={{
              width: '30px',
              height: '30px',
              padding: '2px',
              cursor: 'pointer',
            }}
          />
        </CustomIcon>
      </Tooltip>
    </Grid>
  );
};

export default DownloadConversation;
