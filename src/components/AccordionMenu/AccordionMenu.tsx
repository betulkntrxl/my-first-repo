import React from 'react';
import { useTranslation } from 'react-i18next';
import { Accordion, AccordionDetails, AccordionSummary, Divider, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import ConfigurationMenu from '../ConfigurationMenu/ConfigurationMenu';
import AssistantSetupMenu from '../AssistantSetupMenu/AssistantSetupMenu';

const AccordionMenu = () => {
  const { t } = useTranslation();

  const AccordionTheme = createTheme({
    components: {
      MuiAccordion: {
        defaultProps: {
          disableGutters: true,
          elevation: 0,
          square: true,
        },
        styleOverrides: {
          root: ({ theme }) => ({
            border: `0px solid ${theme.palette.divider}`,
            '&:not(:last-child)': {
              borderBottom: '1px solid',
              marginLeft: 20,
              marginRight: 20,
              color: '#e6e6e6',
            },
            '&:before': {
              display: 'none',
            },
          }),
        },
      },
    },
  });

  const AccordionSummaryTheme = createTheme({
    components: {
      MuiAccordionSummary: {
        defaultProps: {
          expandIcon: <ExpandMoreIcon sx={{ fontSize: '0.9rem' }} />,
        },
        styleOverrides: {
          root: ({ theme }) => ({
            style: 'flexGrow: 0',
            backgroundColor:
              theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, .05)' : 'rgba(0, 0, 0, 0)',
            flexDirection: 'row',
            '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
              transform: 'rotate(180deg)',
            },
            '& .MuiAccordionSummary-content': {
              marginLeft: -15,
            },
          }),
        },
      },
    },
  });

  const AccordionDetailsTheme = createTheme({
    components: {
      MuiAccordionDetails: {
        styleOverrides: {
          root: ({ theme }) => ({
            color: 'black',
            padding: theme.spacing(0),
          }),
        },
      },
    },
  });

  const [expanded, setExpanded] = React.useState<string | false>('panel1');

  const handleChange = (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
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
