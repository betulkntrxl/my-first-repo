import React from 'react';
import { signal } from '@preact/signals-react';
import { FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';

import { useTranslation } from 'react-i18next';
import { SelectChangeEvent } from '@mui/material/Select';
import MetricsClient from '../../clients/MetricsClient';
import AccordionItemTitleAndTooltip from '../AccordionItemTitleAndTooltip/AccordionItemTitleAndTooltip';

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
      <AccordionItemTitleAndTooltip
        title={t('menu.assistant-setup.message-template.title')}
        id="systemMessageTemplate"
      />
      <FormControl fullWidth sx={{ marginTop: '15px' }}>
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

      <AccordionItemTitleAndTooltip
        title={t('menu.assistant-setup.system-message.title')}
        tooltipTitle={t('menu.assistant-setup.system-message.tooltip')}
        id="outlined-multiline-static"
      />
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
        sx={{ marginTop: '15px' }}
      />
    </>
  );
};

export default AssistantSetupMenu;
