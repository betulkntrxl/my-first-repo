import React, { useState, SyntheticEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Accordion, AccordionDetails, AccordionSummary, Divider, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { ThemeProvider } from '@mui/material/styles';
import {
  AccordionTheme,
  AccordionSummaryTheme,
  AccordionDetailsTheme,
} from './AccordingMenu.styles';
import ConfigurationMenu from '../ConfigurationMenu/ConfigurationMenu';
import AssistantSetupMenu from '../AssistantSetupMenu/AssistantSetupMenu';

const AccordionMenu = () => {
  const { t } = useTranslation();

  const [expanded, setExpanded] = useState<string | false>('panel1');

  const handleChange = (panel: string) => (event: SyntheticEvent, newExpanded: boolean) => {
    setExpanded(newExpanded ? panel : false);
  };

  return (
    <>
      <ThemeProvider theme={AccordionTheme}>
        <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
          <ThemeProvider theme={AccordionSummaryTheme}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography style={{ color: '#007BC7', fontFamily: 'Arial' }}>
                {t('menu.assistant-setup.title')}
              </Typography>
            </AccordionSummary>
          </ThemeProvider>
          <Divider />
          <ThemeProvider theme={AccordionDetailsTheme}>
            <AccordionDetails>
              <AssistantSetupMenu />
            </AccordionDetails>
          </ThemeProvider>
        </Accordion>
      </ThemeProvider>
      <ThemeProvider theme={AccordionTheme}>
        <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
          <ThemeProvider theme={AccordionSummaryTheme}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel2a-content"
              id="panel2a-header"
            >
              <Typography
                style={{ color: '#007BC7', fontFamily: 'Arial' }}
                aria-label="configuration"
              >
                Configuration
              </Typography>
            </AccordionSummary>
          </ThemeProvider>
          <Divider />
          <ThemeProvider theme={AccordionDetailsTheme}>
            <AccordionDetails>
              <ConfigurationMenu />
            </AccordionDetails>
          </ThemeProvider>
        </Accordion>
      </ThemeProvider>
    </>
  );
};

export default AccordionMenu;
