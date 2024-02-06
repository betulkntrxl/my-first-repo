import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import Paper from '@mui/material/Paper';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import SystemIcon from '../../assets/system.jpg';
import UserIcon from '../../assets/user.jpg';
import BotThinking from '../../assets/typing.gif';

import { displayValue, allMessagesToDisplay } from '../SendMessage/SendMessage';
import { AppGuidelines } from './AppGuidelines';

const Messages = () => {
  const { t } = useTranslation();
  const bottomRef: any = useRef();

  const scrollToBottom = () => {
    setTimeout(() => {
      if (bottomRef.current) {
        bottomRef.current.scrollTop = bottomRef.current.scrollHeight;
      }
    }, 500);
    return null;
  };

  return (
    <Box
      sx={{ width: '100%' }}
      style={{
        overflow: 'auto',
        overflowY: 'auto',
      }}
      ref={bottomRef}
    >
      <CardContent>
        <Stack direction="column">
          <AppGuidelines />

          {allMessagesToDisplay.value.map(value => {
            if (value.role === 'user') {
              return (
                <div key={value.id}>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'flex-end',
                      alignItems: 'flex-start',
                    }}
                  >
                    <Paper
                      key={value.id}
                      elevation={3}
                      sx={{
                        p: '6px 10px',
                        m: '20px 0',
                        backgroundColor: 'gainsboro',
                        borderRadius: '5px',
                        display: value.content.length === 0 ? 'none' : 'block',
                        overflowWrap: 'break-word',
                        width: 'auto',
                        maxWidth: 'calc(100% - 70px)',
                      }}
                    >
                      <Typography variant="body1">{value.content}</Typography>
                    </Paper>
                    <img
                      alt="user"
                      src={UserIcon}
                      style={{ width: 40, height: 40, marginTop: '20px', marginLeft: 10 }}
                    />
                  </Box>
                </div>
              );
            }

            if (value.role === 'system') {
              return (
                <div key={value.id}>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'flex-start',
                      alignItems: 'flex-start',
                    }}
                  >
                    <img
                      alt="assistant"
                      src={SystemIcon}
                      style={{
                        width: 40,
                        height: 40,
                        marginTop: '20px',
                        marginLeft: 0,
                        marginRight: '20px',
                      }}
                    />
                    {value.content.length > 0 ? (
                      <Paper
                        key={value.id}
                        elevation={3}
                        sx={{
                          p: '6px 10px',
                          m: '20px 0',
                          backgroundColor: '#E5F2F9',
                          borderRadius: '5px',
                          display: displayValue.value,
                          overflowWrap: 'break-word',
                          width: 'auto',
                          maxWidth: 'calc(100% - 70px)',
                        }}
                      >
                        <Typography variant="body1">{value.content}</Typography>
                      </Paper>
                    ) : (
                      <div style={{ width: '300px' }}>
                        <img
                          alt="assistant"
                          src={BotThinking}
                          width="70px"
                          height={26}
                          style={{ marginTop: 26 }}
                        />
                      </div>
                    )}
                  </Box>
                </div>
              );
            }

            return '';
          })}

          {
            // scroll to bottom of chat after system has responded
            scrollToBottom()
          }
        </Stack>
      </CardContent>
    </Box>
  );
};

export default Messages;
