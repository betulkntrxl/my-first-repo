import React from 'react';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import Slider from '@mui/material/Slider';
import { Box, Typography } from '@mui/material';

const ToolBar = (props: {
  temperature: number;
  handleTemperatureChange: (event: Event, value: number | number[], activeThumb: number) => void;
  topP: number;
  handleTopPChange: (event: Event, value: number | number[], activeThumb: number) => void;
  maxTokens: number;
  handleMaxTokensChange:
    | ((event: Event, value: number | number[], activeThumb: number) => void)
    | undefined;
}) => {
  const {
    temperature,
    handleTemperatureChange,
    topP,
    handleTopPChange,
    maxTokens,
    handleMaxTokensChange,
  } = props;

  return (
    <Paper sx={{ position: 'fixed', top: 50, left: 10, right: 0, height: '50px' }} elevation={3}>
      <Stack direction="row">
        <Stack direction="row" spacing={2} style={{ width: '100%', padding: '2px' }}>
          <Paper
            style={{
              width: '30%',
              padding: 3,
              marginTop: 0,
              marginBottom: 20,
              marginLeft: 20,
              float: 'right',
              whiteSpace: 'nowrap',
            }}
          >
            <Typography id="temperature-slider" style={{ float: 'left' }}>
              Temperature{' '}
              <Tooltip title="Controls randomness. Lowering the temperature means that the model will produce more repetitive and deterministic responses. Increasing the temperature will result in more unexpected or creative responses. Try adjusting temperature or Top P but not both.">
                <InfoOutlinedIcon />
              </Tooltip>
              :{' '}
            </Typography>
            <div style={{ float: 'left' }}> &nbsp;</div>
            <Box sx={{ width: '50%', whiteSpace: 'nowrap', float: 'left' }}>
              <Slider
                aria-labelledby="temperature-slider"
                valueLabelDisplay="auto"
                min={0}
                max={1}
                step={0.1}
                value={temperature}
                defaultValue={0.7}
                aria-label="Temperature"
                onChange={handleTemperatureChange}
              />
            </Box>
          </Paper>
          <Paper style={{ width: '30%', padding: 5, marginTop: 2, marginBottom: 20 }}>
            <Typography id="top-p-slider" style={{ float: 'left' }}>
              Top P:{' '}
              <Tooltip title="Similar to temperature, this controls randomness but uses a different method. Lowering Top P will narrow the model’s token selection to likelier tokens. Increasing Top P will let the model choose from tokens with both high and low likelihood. Try adjusting temperature or Top P but not both.">
                <InfoOutlinedIcon />
              </Tooltip>
            </Typography>
            <div style={{ float: 'left' }}> &nbsp;</div>
            <Box sx={{ width: '50%', whiteSpace: 'nowrap', float: 'left' }}>
              <Slider
                valueLabelDisplay="auto"
                min={0}
                max={1}
                step={0.05}
                value={topP}
                defaultValue={0.95}
                aria-label="Top P"
                onChange={handleTopPChange}
              />
            </Box>
          </Paper>
          <Paper style={{ width: '30%', padding: 5, marginTop: 2, marginBottom: 20 }}>
            <Typography id="top-p-slider" style={{ float: 'left' }}>
              Max response:{' '}
              <Tooltip title="Set a limit on the number of tokens per model response. The API supports a maximum of 4000 tokens shared between the prompt (including system message, examples, message history, and user query) and the model's response. One token is roughly 4 characters for typical English text.">
                <InfoOutlinedIcon />
              </Tooltip>
            </Typography>
            <div style={{ float: 'left' }}> &nbsp;</div>
            <Box sx={{ width: '50%', whiteSpace: 'nowrap', float: 'left' }}>
              <Slider
                valueLabelDisplay="auto"
                min={0}
                max={4096}
                step={1}
                value={maxTokens}
                defaultValue={800}
                aria-label="Max Tokens"
                onChange={handleMaxTokensChange}
              />
            </Box>
          </Paper>
        </Stack>
      </Stack>
    </Paper>
  );
};

export default ToolBar;
