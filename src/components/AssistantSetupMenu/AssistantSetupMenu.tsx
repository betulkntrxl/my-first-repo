import React, { useEffect } from 'react';
import { signal } from '@preact/signals-react';
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

import { useTranslation } from 'react-i18next';
import { SelectChangeEvent } from '@mui/material/Select';
import MetricsClient from '../../clients/MetricsClient';

export const systemMessageValue = signal('');

const AssistantSetupMenu = () => {
  const { t } = useTranslation();

  const handleSystemMessageValueChange = (event: { target: { name: any; value: any } }) => {
    systemMessageValue.value = event.target.value;
  };

  const handlesystemMessageTemplateChange = (event: SelectChangeEvent) => {
    // Tracking in app insights
    MetricsClient.sendEvent({
      name: 'ChatApp System Message Template Changed',
    });
    handleSystemMessageValueChange(event);
  };

  return (
    <>
      <Typography style={{ marginBottom: 10, marginTop: 10, color: 'dimgray' }}>
        {t('menu.assistant-setup.message-template.title')}
      </Typography>
      <FormControl fullWidth>
        <InputLabel id="systemMessageTemplate-label">
          {t('menu.assistant-setup.message-template.system-message-template.title')}
        </InputLabel>
        <Select
          fullWidth
          labelId="systemMessageTemplate-label"
          id="systemMessageTemplate"
          value={systemMessageValue.value}
          label={t('menu.assistant-setup.message-template.system-message-template.title')}
          onChange={handlesystemMessageTemplateChange}
          aria-label="system-message-template"
        >
          <MenuItem
            aria-label="template1"
            value={t('menu.assistant-setup.message-template.system-message-template.template1')}
          >
            {t('menu.assistant-setup.message-template.system-message-template.template1')}
          </MenuItem>
          <MenuItem
            value={t('menu.assistant-setup.message-template.system-message-template.template2')}
          >
            {t('menu.assistant-setup.message-template.system-message-template.template2')}
          </MenuItem>
          <MenuItem
            value={t('menu.assistant-setup.message-template.system-message-template.template3')}
          >
            {t('menu.assistant-setup.message-template.system-message-template.template3')}
          </MenuItem>
          <MenuItem
            value={t('menu.assistant-setup.message-template.system-message-template.template4')}
          >
            {t('menu.assistant-setup.message-template.system-message-template.template4')}
          </MenuItem>
        </Select>
      </FormControl>
      <br />
      <br />
      <div style={{ marginBottom: 10, color: 'dimgray' }}>
        {t('menu.assistant-setup.system-message.title')}:
        <Tooltip title={t('menu.assistant-setup.system-message.tooltip')}>
          <InfoOutlinedIcon />
        </Tooltip>
      </div>
      <TextField
        id="outlined-multiline-static"
        label={t('menu.assistant-setup.system-message.title')}
        multiline
        fullWidth
        rows={4}
        value={systemMessageValue.value}
        onChange={handleSystemMessageValueChange}
        inputProps={{
          title: 'system-message-input',
        }}
      />
    </>
  );
};

export default AssistantSetupMenu;
