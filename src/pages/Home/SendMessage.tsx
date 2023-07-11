import React, { useEffect, useRef } from 'react';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/system';
import Button from '@mui/material/Button';
import TelegramIcon from '@mui/icons-material/Telegram';
import CachedIcon from '@mui/icons-material/Cached';
import ReactDOM from 'react-dom';
import { TextField } from '@mui/material';

const SendMessage = (props: {
  handleChatsessionChange: (event: { target: { name: any; value: any } }) => void;
  data: { chatsession: string; response: string };
  tokenCount: number;
  disabledBool: boolean;
  disabledInput: boolean;
  handleResetChatSessionOpen: () => void;
  refInput: any;
}) => {
  const {
    handleChatsessionChange,
    data,
    tokenCount,
    disabledBool,
    disabledInput,
    handleResetChatSessionOpen,
    refInput,
  } = props;
  const blue = {
    500: '#007FFF',
    600: '#0072E5',
    700: '#0059B2',
  };

  const CustomButton = styled(Button)`
    font-family: Arial, sans-serif;
    font-size: 0.875rem;
    background-color: ${blue[500]};
    padding: 4px 10px;
    border-radius: 8px;
    color: white;
    transition: all 150ms ease;
    cursor: pointer;
    border: none;
    margin-right: 10px;

    &:hover {
      background-color: ${blue[600]};
    }
  `;

  const handleSendChange = (event: { target: { name: any; value: any } }) => {
    handleChatsessionChange(event);
  };

  const inputRef = useRef(null);
  useEffect(() => {
    // set focus to input field
    (inputRef.current as any).focus();
  }, [disabledInput]);

  return (
    <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, height: '110px' }} elevation={3}>
      <Stack direction="row">
        <Paper style={{ width: '100%', backgroundColor: '#f8f8f8' }}>
          <Stack direction="row">
            <Stack direction="column" style={{ marginLeft: 20, width: '100%' }}>
              <Grid item xs={4} style={{ marginTop: 0 }}>
                <Button
                  variant="contained"
                  style={{ backgroundColor: '#005A8C', marginTop: 5, marginLeft: 7 }}
                >
                  Token Count: {tokenCount}
                </Button>
              </Grid>
              <input
                ref={inputRef}
                {...(disabledInput && { disabled: true })}
                autoComplete="off"
                title="sendmessage"
                placeholder="Type your message here."
                name="chatsession"
                onChange={handleSendChange}
                value={data.chatsession}
                style={{
                  marginTop: 0,
                  marginLeft: 7,
                  marginBottom: 25,
                  // margin: '7px',
                  width: '100%',
                  fontFamily: 'sans-serif',
                  padding: 10,
                  boxSizing: 'border-box',
                  border: '1',
                  borderRadius: '4px',
                  fontSize: '16px',
                  resize: 'none',
                }}
              />
              <input type="submit" style={{ display: 'none' }} />
            </Stack>
            <Stack>
              <CustomButton
                title="send"
                variant="contained"
                type="submit"
                {...(disabledBool && { disabled: true })}
                style={{ marginLeft: '25px', width: '150px', marginTop: 42 }}
              >
                Send
                <TelegramIcon style={{ marginLeft: 10, marginBottom: 5, marginTop: 5 }} />
              </CustomButton>
            </Stack>
            <Stack>
              <CustomButton
                title="reset"
                variant="contained"
                onClick={handleResetChatSessionOpen}
                {...(tokenCount === 0 && { disabled: true })}
                style={{
                  marginLeft: '10px',
                  width: '150px',
                  marginTop: 42,
                  height: 43,
                  marginRight: 60,
                }}
              >
                Reset
                <CachedIcon style={{ marginLeft: 10, marginBottom: 5, marginTop: 5 }} />
              </CustomButton>
            </Stack>
          </Stack>
        </Paper>
      </Stack>
    </Paper>
  );
};

export default SendMessage;
