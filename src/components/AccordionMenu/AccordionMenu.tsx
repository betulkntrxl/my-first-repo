import React, { SyntheticEvent } from 'react';
import { useSignal } from '@preact/signals-react';
import { useTranslation } from 'react-i18next';
import { Accordion, AccordionDetails, AccordionSummary, Divider, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ConfigurationMenu from '../ConfigurationMenu/ConfigurationMenu';
import AssistantSetupMenu from '../AssistantSetupMenu/AssistantSetupMenu';

const AccordionMenu = () => {
  const { t } = useTranslation();

  const expanded = useSignal<string | false>('panel1');

  const handleChange = (panel: string) => (event: SyntheticEvent, newExpanded: boolean) => {
    expanded.value = newExpanded ? panel : false;
  };

  return (
    <>
      <Accordion expanded={expanded.value === 'panel1'} onChange={handleChange('panel1')}>
        <AccordionSummary aria-controls="panel1a-content" id="panel1a-header">
          <Typography color="#007BC7">{t('menu.assistant-setup.title')}</Typography>
        </AccordionSummary>
        <Divider />
        <AccordionDetails>
          <AssistantSetupMenu />
        </AccordionDetails>
      </Accordion>
      <Divider />
      <Accordion expanded={expanded.value === 'panel2'} onChange={handleChange('panel2')}>
        <AccordionSummary aria-controls="panel2a-content" id="panel2a-header">
          <Typography color="#007BC7" aria-label="configuration">
            Configuration
          </Typography>
        </AccordionSummary>
        <Divider />
        <AccordionDetails>
          <ConfigurationMenu />
        </AccordionDetails>
      </Accordion>
    </>
  );
};

export default AccordionMenu;
