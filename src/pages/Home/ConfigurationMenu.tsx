import { Grid, Input, Slider, Tooltip, Typography } from '@mui/material';
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
  } = props;

  const [tempValue, setTempValue] = React.useState<number | string | Array<number | string>>(0.7);
  const [topPValue, setTopPValue] = React.useState<number | string | Array<number | string>>(0.95);
  const [maxTokensValue, setMaxTokensValue] = React.useState<
    number | string | Array<number | string>
  >(800);
  const [pastMessagesValue, setPastMessagesValue] = React.useState<
    number | string | Array<number | string>
  >(10);

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
    <Typography>
      <Typography
        id="temperature-input-label"
        style={{ fontFamily: 'Roboto, Helvetica, Arial, sans-serif' }}
      >
        Temperature:{' '}
        <Tooltip title="Controls randomness. Lowering the temperature means that the model will produce more repetitive and deterministic responses. Increasing the temperature will result in more unexpected or creative responses. Try adjusting temperature or Top P but not both.">
          <InfoOutlinedIcon />
        </Tooltip>
      </Typography>
      <Grid container spacing={2} alignItems="center" style={{ width: 370 }}>
        <Grid item xs>
          <Slider
            style={{ width: 240 }}
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
      <Typography id="topp-input-label">
        Top_P:{' '}
        <Tooltip title="Similar to temperature, this controls randomness but uses a different method. Lowering Top P will narrow the model’s token selection to likelier tokens. Increasing Top P will let the model choose from tokens with both high and low likelihood. Try adjusting temperature or Top P but not both.">
          <InfoOutlinedIcon />
        </Tooltip>
      </Typography>
      <Grid container spacing={2} alignItems="center" style={{ width: 370 }}>
        <Grid item xs>
          <Slider
            style={{ width: 240 }}
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
      <Typography id="maxtokens-input-label">
        Max Tokens:{' '}
        <Tooltip title="Set a limit on the number of tokens per model response. The API supports a maximum of 4000 tokens shared between the prompt (including system message, examples, message history, and user query) and the model's response. One token is roughly 4 characters for typical English text.">
          <InfoOutlinedIcon />
        </Tooltip>
      </Typography>
      <Grid container spacing={2} alignItems="center" style={{ width: 370 }}>
        <Grid item xs>
          <Slider
            style={{ width: 240 }}
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
        <Typography id="pastmessages-input-label">
          Past messages included:{' '}
          <Tooltip title="Select the number of past messages to include in each new API request. This helps give the model context for new user queries. Setting this number to 10 will include 5 user queries and 5 system responses.">
            <InfoOutlinedIcon />
          </Tooltip>
        </Typography>
        <Grid container spacing={2} alignItems="center" style={{ width: 370 }}>
          <Grid item xs>
            <Slider
              style={{ width: 240 }}
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
  );
};

export default ConfigurationMenu;
