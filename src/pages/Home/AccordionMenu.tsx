import {
  Accordion,
  AccordionDetails,
  AccordionProps,
  AccordionSummary,
  Divider,
  Grid,
  IconButton,
  Input,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Slider,
  Stack,
  Tooltip,
  Typography,
  styled,
} from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionSummary, { AccordionSummaryProps } from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import React from 'react';
import { SelectChangeEvent } from '@mui/material/Select';
import { ThemeProvider, createTheme } from '@mui/material/styles';

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

  const [systemMessageTemplate, setsystemMessageTemplate] = React.useState('as an assistant');
  const [version, setVersion] = React.useState('');
  async function getVersion() {
    try {
      // GET request using fetch with async/await
      await fetch('/api/version').then(async response2 => {
        if (typeof response2 !== 'undefined') {
          const dataver = await response2.json();
          setVersion(dataver.version);
        }
      });
    } catch {
      return '';
    }
    return null;
  }

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
            border: `1px solid ${theme.palette.divider}`,
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

  const Accordion2 = styled((props: AccordionProps) => (
    <MuiAccordion disableGutters elevation={0} square {...props} />
  ))(({ theme }) => ({
    border: `1px solid ${theme.palette.divider}`,
    '&:not(:last-child)': {
      borderBottom: 0,
    },
    '&:before': {
      display: 'none',
    },
  }));

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
              theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, .05)' : 'rgba(0, 0, 0, .03)',
            flexDirection: 'row',
            '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
              transform: 'rotate(180deg)',
            },
            '& .MuiAccordionSummary-content': {
              marginLeft: theme.spacing(1),
            },
          }),
        },
      },
    },
  });

  const AccordionSummary2 = styled((props: AccordionSummaryProps) => (
    <MuiAccordionSummary
      style={{ flexGrow: 0 }}
      expandIcon={<ExpandMoreIcon sx={{ fontSize: '0.9rem' }} />}
      {...props}
    />
  ))(({ theme }) => ({
    backgroundColor:
      theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, .05)' : 'rgba(0, 0, 0, .03)',
    flexDirection: 'row',
    '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
      transform: 'rotate(180deg)',
    },
    '& .MuiAccordionSummary-content': {
      marginLeft: theme.spacing(1),
    },
  }));

  const AccordionDetailsTheme = createTheme({
    components: {
      MuiAccordionSummary: {
        styleOverrides: {
          root: ({ theme }) => ({
            padding: theme.spacing(2),
            borderTop: '1px solid rgba(0, 0, 0, .125)',
          }),
        },
      },
    },
  });

  const AccordionDetails2 = styled(MuiAccordionDetails)(({ theme }) => ({
    padding: theme.spacing(2),
    borderTop: '1px solid rgba(0, 0, 0, .125)',
  }));

  const [expanded, setExpanded] = React.useState<string | false>('panel1');

  const handleChange = (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
    setExpanded(newExpanded ? panel : false);
  };

  const [tempValue, setTempValue] = React.useState<number | string | Array<number | string>>(0.7);
  const [topPValue, setTopPValue] = React.useState<number | string | Array<number | string>>(0.95);
  const [maxTokensValue, setMaxTokensValue] = React.useState<
    number | string | Array<number | string>
  >(800);
  const [pastMessagesValue, setPastMessagesValue] = React.useState<
    number | string | Array<number | string>
  >(10);

  const handlesystemMessageTemplateChange = (event: SelectChangeEvent) => {
    setsystemMessageTemplate(event.target.value as string);
    handleSystemMessageValueChange(event);
  };

  const handleTemperatureSliderChange = (event: Event, newValue: number | number[]) => {
    setTempValue(newValue);
    handleTemperatureChange(event, newValue, 1);
  };

  const handleTopPSliderChange = (event: Event, newValue: number | number[]) => {
    setTopPValue(newValue);
    handleTopPChange(event, newValue, 1);
  };
  const handleMaxTokensSliderChange = (event: Event, newValue: number | number[]) => {
    setMaxTokensValue(newValue);
    handleMaxTokensChange(event, newValue, 1);
  };
  const handlePastMessagesSliderChange = (event: Event, newValue: number | number[]) => {
    setPastMessagesValue(newValue);
    handlePastMessagesChange(event, newValue, 1);
  };

  const handleTemperatureInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (Number(event.target.value) < 0) {
      handleTemperatureChange(new Event('0'), 0, 1);
      setTempValue(0);
    } else if (Number(event.target.value) > 1) {
      handleTemperatureChange(new Event('1'), 1, 1);
      setTempValue(1);
    } else {
      handleTemperatureChange(new Event(event.target.value), Number(event.target.value), 1);
      setTempValue(Number(event.target.value));
    }
  };
  const handleTopPInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (Number(event.target.value) < 0) {
      handleTopPChange(new Event('0'), 0, 1);
      setTopPValue(0);
    } else if (Number(event.target.value) > 1) {
      handleTopPChange(new Event('1'), 1, 1);
      setTopPValue(1);
    } else {
      handleTopPChange(new Event(event.target.value), Number(event.target.value), 1);
      setTopPValue(Number(event.target.value));
    }
  };

  const handleMaxTokensInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (Number(event.target.value) <= 0) {
      handleMaxTokensChange(new Event('0'), 0, 1);
      setMaxTokensValue(0);
    } else if (Number(event.target.value) > 4096) {
      handleMaxTokensChange(new Event('4096'), 4096, 1);
      setMaxTokensValue(4096);
    } else {
      handleMaxTokensChange(new Event(event.target.value), Number(event.target.value), 1);
      setMaxTokensValue(Number(event.target.value).toFixed(0));
    }
  };
  const handlePastMessagesInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const tmpval = Number(event.target.value);
    if (tmpval <= 0) {
      handlePastMessagesChange(new Event('0'), 0, 1);
      setPastMessagesValue(0);
    } else if (tmpval > 20) {
      handlePastMessagesChange(new Event('20'), 20, 1);
      setPastMessagesValue(20);
    } else {
      handlePastMessagesChange(new Event(tmpval.toString()), tmpval, 1);
      setPastMessagesValue(event.target.value === '' ? '' : Number(event.target.value).toFixed(0));
    }
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
              <Typography style={{ color: '#007BC7', fontWeight: 'bold', fontFamily: 'Arial' }}>
                Assistant Setup
              </Typography>
            </AccordionSummary>
          </ThemeProvider>
          <Divider variant="middle" />
          <ThemeProvider theme={AccordionDetailsTheme}>
            <AccordionDetails>
              <Typography>
                <InputLabel id="systemMessageTemplate">System Message Template</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={systemMessageTemplate}
                  label="Age"
                  onChange={handlesystemMessageTemplateChange}
                >
                  <MenuItem value="as an assistant">as an assistant</MenuItem>
                  <MenuItem value="as a agent understanding the sentiment">
                    as a agent understanding the sentiment
                  </MenuItem>
                  <MenuItem value="as a mentor using the Socratic method">
                    as a mentor using the Socratic method
                  </MenuItem>
                </Select>
                <br />
                <br />
                System message:
                <Tooltip title="Give the model instructions about how it should behave and any context it should reference when generating a response. You can describe the assistant’s personality, tell it what it should and shouldn’t answer, and tell it how to format responses. There’s no token limit for this section, but it will be included with every API call, so it counts against the overall token limit.">
                  <InfoOutlinedIcon />
                </Tooltip>{' '}
                <textarea
                  placeholder="Type the system message here."
                  ref={input => input && input.focus()}
                  name="systemMessage"
                  onChange={handleSystemMessageValueChange}
                  rows={5}
                  cols={50}
                  value={systemMessageValue}
                  style={{
                    margin: '7px',
                    width: '98%',
                    fontFamily: 'sans-serif',
                    padding: '5px 5px',
                    boxSizing: 'border-box',
                    border: '1',
                    borderRadius: '4px',
                    backgroundColor: '#f8f8f8',
                    fontSize: '16px',
                    resize: 'none',
                  }}
                />
              </Typography>
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
              <Typography style={{ color: '#007BC7', fontWeight: 'bold', fontFamily: 'Arial' }}>
                Configuration
              </Typography>
            </AccordionSummary>
          </ThemeProvider>
          <Divider variant="middle" />
          <ThemeProvider theme={AccordionDetailsTheme}>
            <AccordionDetails>
              <Typography>
                Temperature:{' '}
                <Tooltip title="Controls randomness. Lowering the temperature means that the model will produce more repetitive and deterministic responses. Increasing the temperature will result in more unexpected or creative responses. Try adjusting temperature or Top P but not both.">
                  <InfoOutlinedIcon />
                </Tooltip>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs>
                    <Slider
                      valueLabelDisplay="auto"
                      min={0}
                      max={1}
                      step={0.1}
                      value={temperature}
                      defaultValue={0.7}
                      aria-label="Temperature"
                      onChange={handleTemperatureSliderChange}
                      aria-labelledby="temperature-input-label"
                    />
                  </Grid>
                  <Grid item>
                    <Input
                      title="temperature-input"
                      value={tempValue}
                      size="small"
                      onChange={handleTemperatureInputChange}
                      inputProps={{
                        step: 0.1,
                        min: 0,
                        max: 1,
                        type: 'number',
                        'aria-labelledby': 'temperature-input-label',
                      }}
                    />
                  </Grid>
                </Grid>
                Top_P:{' '}
                <Tooltip title="Similar to temperature, this controls randomness but uses a different method. Lowering Top P will narrow the model’s token selection to likelier tokens. Increasing Top P will let the model choose from tokens with both high and low likelihood. Try adjusting temperature or Top P but not both.">
                  <InfoOutlinedIcon />
                </Tooltip>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs>
                    <Slider
                      valueLabelDisplay="auto"
                      min={0}
                      max={1}
                      step={0.05}
                      value={topP}
                      defaultValue={0.95}
                      aria-label="Top P"
                      onChange={handleTopPSliderChange}
                      aria-labelledby="topp-input-label"
                    />
                  </Grid>
                  <Grid item>
                    <Input
                      title="topP-input"
                      value={topPValue}
                      size="small"
                      onChange={handleTopPInputChange}
                      inputProps={{
                        step: 0.1,
                        min: 0,
                        max: 1,
                        type: 'number',
                        'aria-labelledby': 'topp-input-label',
                      }}
                    />
                  </Grid>
                </Grid>
                Max Tokens:{' '}
                <Tooltip title="Set a limit on the number of tokens per model response. The API supports a maximum of 4000 tokens shared between the prompt (including system message, examples, message history, and user query) and the model's response. One token is roughly 4 characters for typical English text.">
                  <InfoOutlinedIcon />
                </Tooltip>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs>
                    <Slider
                      valueLabelDisplay="auto"
                      min={0}
                      max={4096}
                      step={1}
                      value={maxTokens}
                      defaultValue={800}
                      aria-label="Max Tokens"
                      onChange={handleMaxTokensSliderChange}
                      aria-labelledby="maxtokens-input-label"
                    />
                  </Grid>
                  <Grid item>
                    <Input
                      title="maxTokens-input"
                      value={maxTokensValue}
                      size="small"
                      onChange={handleMaxTokensInputChange}
                      inputProps={{
                        step: 1,
                        min: 0,
                        max: 4096,
                        type: 'number',
                        'aria-labelledby': 'maxtokens-input-label',
                      }}
                    />
                  </Grid>
                </Grid>
                <Typography>
                  Past messages included:{' '}
                  <Tooltip title="Select the number of past messages to include in each new API request. This helps give the model context for new user queries. Setting this number to 10 will include 5 user queries and 5 system responses.">
                    <InfoOutlinedIcon />
                  </Tooltip>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs>
                      <Slider
                        valueLabelDisplay="auto"
                        min={0}
                        max={20}
                        step={1}
                        value={pastMessages}
                        defaultValue={10}
                        aria-label="Past messages included"
                        onChange={handlePastMessagesSliderChange}
                        aria-labelledby="pastmessages-input-label"
                      />
                    </Grid>
                    <Grid item>
                      <Input
                        title="pastMessages-input"
                        value={pastMessagesValue}
                        size="small"
                        onChange={handlePastMessagesInputChange}
                        inputProps={{
                          step: 1,
                          min: 0,
                          max: 20,
                          type: 'number',
                          'aria-labelledby': 'pastmessages-input-label',
                        }}
                      />
                    </Grid>
                  </Grid>
                </Typography>
              </Typography>
            </AccordionDetails>
          </ThemeProvider>
        </Accordion>
      </ThemeProvider>
    </>
  );
};

export default AccordionMenu;
