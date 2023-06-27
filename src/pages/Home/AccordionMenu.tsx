import { Accordion, AccordionDetails, AccordionSummary, Divider, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import ConfigurationMenu from './ConfigurationMenu';
import AssistantSetupMenu from './AssistantSetupMenu';

const AccordionMenu = (propsAccordianMenu: {
  temperature: number;
  handleTemperatureChange: (event: Event, value: number | number[], activeThumb: number) => void;
  topP: number;
  handleTopPChange: (event: Event, value: number | number[], activeThumb: number) => void;
  maxTokens: number;
  handleMaxTokensChange: (event: Event, value: number | number[], activeThumb: number) => void;
  handleSystemMessageValueChange: (event: { target: { name: any; value: any } }) => void;
  systemMessageValue: string;
  handlePastMessagesChange: (event: Event, value: number | number[], activeThumb: number) => void;
  pastMessages: number;
}) => {
  const {
    temperature,
    handleTemperatureChange,
    topP,
    handleTopPChange,
    maxTokens,
    handleMaxTokensChange,
    handleSystemMessageValueChange,
    systemMessageValue,
    handlePastMessagesChange,
    pastMessages,
  } = propsAccordianMenu;

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
              borderBottom: 0,
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
              marginLeft: 3,
            },
          }),
        },
      },
    },
  });

  const AccordionDetailsTheme = createTheme({
    components: {
      MuiAccordionSummary: {
        styleOverrides: {
          root: ({ theme }) => ({
            padding: theme.spacing(2),
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
                Assistant Setup
              </Typography>
            </AccordionSummary>
          </ThemeProvider>
          <Divider variant="middle" />
          <ThemeProvider theme={AccordionDetailsTheme}>
            <AccordionDetails>
              <AssistantSetupMenu
                handleSystemMessageValueChange={handleSystemMessageValueChange}
                systemMessageValue={systemMessageValue}
              />
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
              <Typography style={{ color: '#007BC7', fontFamily: 'Arial' }}>
                Configuration
              </Typography>
            </AccordionSummary>
          </ThemeProvider>
          <Divider variant="middle" />
          <ThemeProvider theme={AccordionDetailsTheme}>
            <AccordionDetails>
              <ConfigurationMenu
                temperature={temperature}
                handleTemperatureChange={handleTemperatureChange}
                topP={topP}
                handleTopPChange={handleTopPChange}
                maxTokens={maxTokens}
                handleMaxTokensChange={handleMaxTokensChange}
                handlePastMessagesChange={handlePastMessagesChange}
                pastMessages={pastMessages}
              />
            </AccordionDetails>
          </ThemeProvider>
        </Accordion>
      </ThemeProvider>
    </>
  );
};

export default AccordionMenu;
