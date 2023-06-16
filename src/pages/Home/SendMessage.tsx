import React from 'react';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/system';
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';

const SendMessage = (props: {
  handleChatsessionChange: (event: { target: { name: any; value: any } }) => void;
  data: { chatsession: string; response: string };
  tokenCount: number;
  disabledBool: boolean;
}) => {
  const { handleChatsessionChange, data, tokenCount, disabledBool } = props;
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

  return (
    <Paper sx={{ position: 'fixed', bottom: 0, left: 10, right: 0, height: '80px' }} elevation={3}>
      <Stack direction="row">
        <Paper style={{ width: '100%' }}>
          <Stack direction="row">
            <Stack direction="column" style={{ width: '100%' }}>
              <input
                title="sendmessage"
                placeholder="Type your message here."
                name="chatsession"
                onChange={handleChatsessionChange}
                value={data.chatsession}
                style={{
                  margin: '7px',
                  width: '100%',
                  fontFamily: 'sans-serif',
                  padding: 10,
                  boxSizing: 'border-box',
                  border: '1',
                  borderRadius: '4px',
                  backgroundColor: '#f8f8f8',
                  fontSize: '16px',
                  resize: 'none',
                }}
              />
              <input type="submit" style={{ display: 'none' }} />
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
                style={{ marginLeft: '25px', width: '150px', marginTop: 7 }}
              >
                Send
                <SendIcon
                  style={{ transform: 'rotate(-40deg)', marginLeft: 10, marginBottom: 10 }}
                />
              </CustomButton>
            </Stack>
          </Stack>
        </Paper>
      </Stack>
    </Paper>
  );
};

export default SendMessage;
