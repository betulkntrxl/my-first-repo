import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import Paper from '@mui/material/Paper';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';

import SystemIcon from '../../assets/system.jpg';
import UserIcon from '../../assets/user.jpg';
import BotThinking from '../../assets/typing.gif';

import { displayValue, allMessagesToDisplay } from '../SendMessage/SendMessage';

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
          <div
            style={{
              color: 'steelblue',
              opacity: 0.6,
              top: 0,
              left: 0,
              right: 0,
              fontFamily: 'arial',
            }}
          >
            <div style={{ fontSize: 14, textAlign: 'center', margin: 5 }}>
              {t('background.title')}
              <br />
              <br />
              <ul style={{ textAlign: 'left', paddingLeft: '0px' }}>
                <li>{t('background.bullet1')}</li>
                <li>{t('background.bullet2')}</li>
                <li>{t('background.bullet3')}</li>
                <li>{t('background.bullet4')}</li>
                <li>{t('background.bullet5')}</li>
                <li>{t('background.bullet6')}</li>
                <li>{t('background.bullet7')}</li>
                <li>{t('background.bullet8')}</li>
              </ul>
            </div>
          </div>

          {allMessagesToDisplay.value.map(value => {
            if (value.role === 'user') {
              return (
                <div key={value.id}>
                  <Stack
                    direction="row"
                    justifyContent="flex-end"
                    // style={{ float: 'right' }}
                  >
                    <Paper
                      key={value.id}
                      elevation={3}
                      style={{
                        marginTop: 20,
                        marginBottom: 20,
                        backgroundColor: 'gainsboro',
                        padding: '10px',
                        display: value.content.length === 0 ? 'none' : 'inline',
                        justifyContent: 'flex-end',
                        // float: 'right',
                        whiteSpace: 'pre-wrap',
                        overflowWrap: 'break-word',
                        width: 'calc(100% - 70px)',
                      }}
                    >
                      {value.content}
                    </Paper>
                    <img
                      alt="user"
                      src={UserIcon}
                      style={{ width: 40, height: 40, marginTop: 20, marginLeft: 10 }}
                    />
                  </Stack>
                  {/* <Box
                    sx={{
                      display: "flex",
                      justifyContent: value.role !== 'user' ? "flex-start" : "flex-end",
                      mb: 2,
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: value.role !== 'user' ? "row" : "row-reverse",
                        alignItems: "center",
                      }}
                    >
                      <Avatar sx={{ bgcolor: value.role !== 'user' ? "primary.main" : "secondary.main" }}>
                        {value.role !== 'user' ? "B" : "U"}
                      </Avatar>
                      <Paper
                        variant="outlined"
                        sx={{
                          p: 2,
                          ml: value.role !== 'user' ? 1 : 0,
                          mr: value.role !== 'user' ? 0 : 1,
                          backgroundColor: value.role !== 'user' ? "primary.light" : "secondary.light",
                          borderRadius: value.role !== 'user' ? "20px 20px 20px 5px" : "20px 20px 5px 20px",
                          display: value.content.length === 0 ? 'none' : 'block',
                        }}
                      >
                        <Typography variant="body1">{value.content}</Typography>
                      </Paper>
                    </Box>
                  </Box> */}
                </div>
              );
            }

            if (value.role === 'system') {
              return (
                <div key={value.id}>
                  <Stack direction="row" style={{ float: 'left' }}>
                    <img
                      alt="assistant"
                      src={SystemIcon}
                      style={{
                        width: 40,
                        height: 40,
                        marginTop: 40,
                        marginLeft: 0,
                        marginRight: 10,
                      }}
                    />
                    {value.content.length > 0 ? (
                      <Paper
                        key={value.id}
                        elevation={3}
                        style={{
                          backgroundColor: '#E5F2F9',
                          marginTop: 40,
                          marginBottom: 20,
                          padding: '10px',
                          float: 'left',
                          display: displayValue.value,
                          whiteSpace: 'pre-wrap',
                        }}
                      >
                        {value.content}
                      </Paper>
                    ) : (
                      <div style={{ width: '300px' }}>
                        <img
                          alt="assistant"
                          src={BotThinking}
                          width="100px"
                          height={37}
                          style={{ marginTop: 40 }}
                        />
                      </div>
                    )}
                  </Stack>
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
