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
import React from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { SelectChangeEvent } from '@mui/material/Select';

const AssistantSetupMenu = (props: {
  handleSystemMessageValueChange: (event: { target: { name: any; value: any } }) => void;
  systemMessageValue: string;
}) => {
  const { t } = useTranslation();

  const { handleSystemMessageValueChange, systemMessageValue } = props;

  const handlesystemMessageTemplateChange = (event: SelectChangeEvent) => {
    // Tracking in app insights
    axios.post('/api/app-insights-event', {
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
          value={systemMessageValue}
          label={t('menu.assistant-setup.message-template.system-message-template.title')}
          onChange={handlesystemMessageTemplateChange}
          aria-label="system-message-template"
        >
          <MenuItem
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
        value={systemMessageValue}
        onChange={handleSystemMessageValueChange}
        inputProps={{
          title: 'system-message-input',
        }}
      />
    </>
  );
};

export default AssistantSetupMenu;
