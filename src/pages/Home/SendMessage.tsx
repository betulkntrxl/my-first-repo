import React, { useRef, useEffect } from 'react';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/system';
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import Slider from '@mui/material/Slider';

const SendMessage = (props: {
  handleChatsessionChange: (event: { target: { name: any; value: any } }) => void;
  data: { chatsession: string; response: string };
  tokenCount: number;
  disabledBool: boolean;
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
    handleChatsessionChange,
    data,
    tokenCount,
    disabledBool,
    temperature,
    handleTemperatureChange,
    topP,
    handleTopPChange,
    maxTokens,
    handleMaxTokensChange,
  } = props;
  const blue = {
    500: '#007FFF',
    600: '#0072E5',
    700: '#0059B2',
  };

  const CustomButton = styled(Button)`
    font-family: IBM Plex Sans, sans-serif;
    font-weight: bold;
    font-size: 0.875rem;
    background-color: ${blue[500]};
    padding: 12px 24px;
    border-radius: 12px;
    color: white;
    transition: all 150ms ease;
    cursor: pointer;
    border: none;

    &:hover {
      background-color: ${blue[600]};
    }
  `;

  const inputRef = useRef(null);

  useEffect(() => {
    // inputRef.current.focus()
  });

  return (
    <Paper sx={{ position: 'fixed', bottom: 0, left: 10, right: 0, height: '80px' }} elevation={3}>
      <Stack direction="row">
        <Paper style={{ width: '50%' }}>
          <Stack direction="row">
            <Stack direction="column" style={{ width: '80%' }}>
              <textarea
                title="sendmessage"
                placeholder="Type your message here."
                // ref={input => input && input.focus()}
                name="chatsession"
                onChange={handleChatsessionChange}
                rows={2}
                cols={50}
                value={data.chatsession}
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
              <Grid item xs={4} style={{ marginLeft: '10px', marginTop: -10 }}>
                Token Count: {tokenCount}
              </Grid>
            </Stack>
            <Stack>
              <CustomButton
                title="send"
                variant="contained"
                type="submit"
                {...(disabledBool && { disabled: true })}
                style={{ margin: '10px', width: '90px' }}
              >
                <SendIcon />
              </CustomButton>
            </Stack>
          </Stack>
        </Paper>
        <Stack direction="row" spacing={2} style={{ width: '50%', padding: '5px', float: 'right' }}>
          <Paper
            style={{
              width: '170px',
              padding: 5,
              marginTop: 2,
              marginBottom: 15,
              marginLeft: 20,
              float: 'right',
            }}
          >
            Temperature:{' '}
            <Tooltip title="Controls randomness. Lowering the temperature means that the model will produce more repetitive and deterministic responses. Increasing the temperature will result in more unexpected or creative responses. Try adjusting temperature or Top P but not both.">
              <InfoOutlinedIcon />
            </Tooltip>
            <br />{' '}
            <Slider
              valueLabelDisplay="auto"
              min={0}
              max={1}
              step={0.1}
              value={temperature}
              defaultValue={0.7}
              aria-label="Temperature"
              onChange={handleTemperatureChange}
            />
          </Paper>
          <Paper style={{ width: '170px', padding: 5, marginTop: 2, marginBottom: 15 }}>
            Top P:{' '}
            <Tooltip title="Similar to temperature, this controls randomness but uses a different method. Lowering Top P will narrow the model’s token selection to likelier tokens. Increasing Top P will let the model choose from tokens with both high and low likelihood. Try adjusting temperature or Top P but not both.">
              <InfoOutlinedIcon />
            </Tooltip>
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
          </Paper>
          <Paper style={{ width: '170px', padding: 5, marginTop: 2, marginBottom: 15 }}>
            Max response:{' '}
            <Tooltip title="Set a limit on the number of tokens per model response. The API supports a maximum of 4000 tokens shared between the prompt (including system message, examples, message history, and user query) and the model's response. One token is roughly 4 characters for typical English text.">
              <InfoOutlinedIcon />
            </Tooltip>
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
          </Paper>
        </Stack>
      </Stack>
    </Paper>
  );
};

export default SendMessage;
