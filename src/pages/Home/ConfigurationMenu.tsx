import { Grid, Slider, TextField, Tooltip, Typography } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import React from 'react';

const ConfigurationMenu = (props: {
  temperature: number;
  handleTemperatureChange: (event: Event, value: number | number[], activeThumb: number) => void;
  topP: number;
  handleTopPChange: (event: Event, value: number | number[], activeThumb: number) => void;
  maxTokens: number;
  handleMaxTokensChange: (event: Event, value: number | number[], activeThumb: number) => void;
  handlePastMessagesChange: (event: Event, value: number | number[], activeThumb: number) => void;
  pastMessages: number;
  handleAPITimeoutChange: (event: Event, value: number | number[], activeThumb: number) => void;
  APITimeout: number;
}) => {
  const {
    temperature,
    handleTemperatureChange,
    topP,
    handleTopPChange,
    maxTokens,
    handleMaxTokensChange,
    handlePastMessagesChange,
    pastMessages,
    handleAPITimeoutChange,
    APITimeout,
  } = props;

  const handleTemperatureSliderChange = (event: Event, newValue: number | number[]) => {
    handleTemperatureChange(event, newValue, 1);
  };

  const handleTopPSliderChange = (event: Event, newValue: number | number[]) => {
    handleTopPChange(event, newValue, 1);
  };
  const handleMaxTokensSliderChange = (event: Event, newValue: number | number[]) => {
    handleMaxTokensChange(event, newValue, 1);
  };
  const handlePastMessagesSliderChange = (event: Event, newValue: number | number[]) => {
    handlePastMessagesChange(event, newValue, 1);
  };
  const handleAPITimeoutSliderChange = (event: Event, newValue: number | number[]) => {
    handleAPITimeoutChange(event, newValue, 1);
  };

  const handleTemperatureInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (Number(event.target.value) > 1) {
      handleTemperatureChange(new Event('1'), 1, 1);
    } else {
      handleTemperatureChange(new Event(event.target.value), Number(event.target.value), 1);
    }
  };

  const handleTopPInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (Number(event.target.value) > 1) {
      handleTopPChange(new Event('1'), 1, 1);
    } else {
      handleTopPChange(new Event(event.target.value), Number(event.target.value), 1);
    }
  };

  const handleMaxTokensInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (Number(event.target.value) < 1) {
      handleMaxTokensChange(new Event('1'), 1, 1);
    } else if (Number(event.target.value) > 4096) {
      handleMaxTokensChange(new Event('4096'), 4096, 1);
    } else {
      handleMaxTokensChange(new Event(event.target.value), Number(event.target.value), 1);
    }
  };

  const handlePastMessagesInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const tmpval = Number(event.target.value);
    if (tmpval > 20) {
      handlePastMessagesChange(new Event('20'), 20, 1);
    } else {
      handlePastMessagesChange(new Event(tmpval.toString()), tmpval, 1);
    }
  };
  const handleAPITimeoutInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const tmpval = Number(event.target.value);
    if (tmpval <= 5) {
      handleAPITimeoutChange(new Event('5'), 5, 1);
    } else if (tmpval > 60) {
      handleAPITimeoutChange(new Event('60'), 60, 1);
    } else {
      handleAPITimeoutChange(new Event(tmpval.toString()), tmpval, 1);
    }
  };

  return (
    <Typography>
      <Typography
        id="temperature-input-label"
        style={{ fontFamily: 'Roboto, Helvetica, Arial, sans-serif', color: 'dimgray' }}
      >
        Temperature:{' '}
        <Tooltip title="Controls randomness. Lowering the temperature means that the model will produce more repetitive and deterministic responses. Increasing the temperature will result in more unexpected or creative responses. Try adjusting temperature or Top P but not both.">
          <InfoOutlinedIcon />
        </Tooltip>
      </Typography>
      <Grid container spacing={2} alignItems="center" style={{ width: 370 }}>
        <Grid item xs>
          <Slider
            style={{ width: 230 }}
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
          <TextField
            style={{ width: 85 }}
            value={temperature}
            size="small"
            onChange={handleTemperatureInputChange}
            inputProps={{
              step: 0.1,
              min: 0,
              max: 1,
              type: 'number',
              'aria-labelledby': 'temperature-input-label',
              title: 'temperature-input',
              'aria-label': 'temperature-input',
            }}
          />
        </Grid>
      </Grid>
      <Typography id="topp-input-label" style={{ color: 'dimgray' }}>
        Top_P:{' '}
        <Tooltip title="Similar to temperature, this controls randomness but uses a different method. Lowering Top P will narrow the model’s token selection to likelier tokens. Increasing Top P will let the model choose from tokens with both high and low likelihood. Try adjusting temperature or Top P but not both.">
          <InfoOutlinedIcon />
        </Tooltip>
      </Typography>
      <Grid container spacing={2} alignItems="center" style={{ width: 370 }}>
        <Grid item xs>
          <Slider
            style={{ width: 230 }}
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
          <TextField
            style={{ width: 85 }}
            value={topP}
            size="small"
            onChange={handleTopPInputChange}
            inputProps={{
              step: 0.1,
              min: 0,
              max: 1,
              type: 'number',
              'aria-labelledby': 'topp-input-label',
              title: 'topP-input',
            }}
          />
        </Grid>
      </Grid>
      <Typography id="maxtokens-input-label" style={{ color: 'dimgray' }}>
        Max Tokens:{' '}
        <Tooltip title="Set a limit on the number of tokens per model response. The API supports a maximum of 4000 tokens shared between the prompt (including system message, examples, message history, and user query) and the model's response. One token is roughly 4 characters for typical English text.">
          <InfoOutlinedIcon />
        </Tooltip>
      </Typography>
      <Grid container spacing={2} alignItems="center" style={{ width: 370 }}>
        <Grid item xs>
          <Slider
            style={{ width: 230 }}
            valueLabelDisplay="auto"
            min={1}
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
          <TextField
            style={{ width: 85 }}
            value={maxTokens}
            size="small"
            onChange={handleMaxTokensInputChange}
            inputProps={{
              step: 1,
              min: 1,
              max: 4096,
              type: 'number',
              'aria-labelledby': 'maxtokens-input-label',
              title: 'maxTokens-input',
            }}
          />
        </Grid>
      </Grid>
      <Typography>
        <Typography id="pastmessages-input-label" style={{ color: 'dimgray' }}>
          Past messages included:{' '}
          <Tooltip title="Select the number of past messages to include in each new API request. This helps give the model context for new user queries. Setting this number to 10 will include 5 user queries and 5 system responses.">
            <InfoOutlinedIcon />
          </Tooltip>
        </Typography>
        <Grid container spacing={2} alignItems="center" style={{ width: 370 }}>
          <Grid item xs>
            <Slider
              style={{ width: 230 }}
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
            <TextField
              style={{ width: 85 }}
              value={pastMessages}
              size="small"
              onChange={handlePastMessagesInputChange}
              inputProps={{
                step: 1,
                min: 0,
                max: 20,
                type: 'number',
                'aria-labelledby': 'pastmessages-input-label',
                title: 'pastMessages-input',
              }}
            />
          </Grid>
        </Grid>
      </Typography>
      <Typography>
        <Typography id="apitimeout-input-label" style={{ color: 'dimgray' }}>
          API Timeout:{' '}
          <Tooltip title="API Timeout is the maximum amount of time allowed for the API to respond to a request. If the API takes longer than the specified timeout period to respond, the request will be terminated. This may need to be increased for complex prompts as the Azure OpenAI API can take time to process the request.">
            <InfoOutlinedIcon />
          </Tooltip>
        </Typography>
        <Grid container spacing={2} alignItems="center" style={{ width: 370 }}>
          <Grid item xs>
            <Slider
              style={{ width: 230 }}
              valueLabelDisplay="auto"
              min={5}
              max={60}
              step={1}
              value={APITimeout}
              defaultValue={10}
              aria-label="API Timeout"
              onChange={handleAPITimeoutSliderChange}
              aria-labelledby="apitimeout-input-label"
            />
          </Grid>
          <Grid item>
            <TextField
              style={{ width: 85 }}
              value={APITimeout}
              defaultValue={APITimeout}
              size="small"
              onChange={handleAPITimeoutInputChange}
              inputProps={{
                step: 1,
                min: 5,
                max: 60,
                type: 'number',
                'aria-labelledby': 'apitimeout-input-label',
                title: 'apitimeout-input',
              }}
            />
          </Grid>
        </Grid>
      </Typography>
    </Typography>
  );
};

export default ConfigurationMenu;
