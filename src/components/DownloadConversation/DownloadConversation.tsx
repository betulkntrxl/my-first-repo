import React from 'react';
import DownloadForOfflineOutlinedIcon from '@mui/icons-material/DownloadForOfflineOutlined';
import { Grid, Tooltip } from '@mui/material';
import { t } from 'i18next';
import { CustomIcon } from '../SendMessage/SendMessage.styles';
import { allMessagesToDisplay } from '../SendMessage/SendMessage';

const DownloadConversation = () => {
  const downloadAsText = () => {
    const messageArray: string[] = [];
    allMessagesToDisplay.value.map(value =>
      value.role === 'user'
        ? messageArray.push(`user: ${value.content}`)
        : messageArray.push(`machine: ${value.content}`),
    );

    const filename = `ChatApp - ${Date.now()}.txt`;
    const text = messageArray.join(`\n`);
    const element = document.createElement('a');
    element.setAttribute('href', `data:text/plain;charset=utf-8,${encodeURIComponent(text)}`);
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <Grid item xs sx={{ paddingTop: '0px' }}>
      <Tooltip title={t('text-download')}>
        <CustomIcon onClick={downloadAsText} data-testid="textIcon">
          <DownloadForOfflineOutlinedIcon
            data-testid="downloadIcon"
            style={{
              width: '40px',
              height: '40px',
              color: 'white',
              backgroundColor: 'rgb(0, 114, 229)',
              borderRadius: '50%',
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
