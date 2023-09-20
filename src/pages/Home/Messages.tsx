import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, Stack } from '@mui/material';
import Paper from '@mui/material/Paper';

import SystemIcon from './system.jpg';
import UserIcon from './user.jpg';
import Typing from './typing.gif';

const Messages = (props: {
  bottomRef: any;
  messagesDisplay: {
    role: string;
    content: string;
    id: string;
  }[];
  displayValue: string;
  visible: boolean;
}) => {
  const { t } = useTranslation();

  const { bottomRef, messagesDisplay, displayValue, visible } = props;

  function scrollToBottom() {
    setTimeout(() => {
      if (bottomRef.current) {
        bottomRef.current.scrollTop = bottomRef.current.scrollHeight;
      }
    }, 500);
    return null;
  }

  return (
    <Card
      variant="elevation"
      sx={{ Width: '100%' }}
      style={{
        position: 'fixed',
        top: 80,
        left: 0,
        right: 0,
        bottom: 110,
        overflow: 'auto',
        overflowY: 'auto',
        // zIndex: -2,
        backgroundColor: 'transparent',
        //        backgroundColor:'#E5EFF3'
      }}
      ref={bottomRef}
    >
      <CardContent>
        <Stack direction="column">
          <div
            style={{
              //            position: 'absolute',
              // color:'#B3CEDD',
              color: 'steelblue',
              //  backgroundColor: '#E5EFF3',
              opacity: 0.6,
              top: 0,
              left: 0,
              //  bottom: 0,
              right: 0,
              //   zIndex: -1,
              //   overflow: 'hidden',
              fontFamily: 'arial',
            }}
          >
            <div style={{ fontSize: 14, textAlign: 'center', margin: 30 }}>
              {t('background.title')}
              <br />
              <br />
              <ul style={{ textAlign: 'left' }}>
                <li>{t('background.bullet1')}</li>
                <li>{t('background.bullet2')}</li>
                <li>{t('background.bullet3')}</li>
                <li>{t('background.bullet4')}</li>
                <li>{t('background.bullet5')}</li>
                <li>{t('background.bullet6')}</li>
              </ul>
            </div>
          </div>

          {messagesDisplay.map((value, index) => {
            // check for user or system message
            if (value.role === 'user' && index !== 0) {
              return (
                <div key={value.id + 1}>
                  <Stack direction="row" style={{ float: 'right' }}>
                    <Paper
                      key={value.id + 4}
                      elevation={3}
                      style={{
                        marginTop: 40,
                        marginBottom: 20,
                        backgroundColor: 'gainsboro',
                        padding: '10px',
                        display: value.content.length === 0 ? 'none' : 'block',
                        justifyContent: 'flex-end',
                        float: 'right',
                        whiteSpace: 'pre-wrap',
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
                </div>
              );
            }

            // check for message from system
            if (value.role === 'system' && index !== 0) {
              return (
                <div key={value.id + 6}>
                  <Stack direction="row" style={{ float: 'left' }}>
                    <img
                      alt="assistant"
                      src={SystemIcon}
                      style={{
                        width: 40,
                        height: 40,
                        marginTop: 20,
                        marginLeft: 20,
                        marginRight: 10,
                      }}
                    />

                    {value.content.length > 0 ? (
                      <Paper
                        key={value.id + 9}
                        elevation={3}
                        style={{
                          backgroundColor: '#E5F2F9',
                          marginTop: 40,
                          marginBottom: 20,
                          padding: '10px',
                          float: 'left',
                          display: displayValue,
                          whiteSpace: 'pre-wrap',
                        }}
                      >
                        {value.content}
                      </Paper>
                    ) : (
                      <div style={{ width: '300px' }}>
                        <img
                          alt="assistant"
                          src={Typing}
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

          {
            // show typing bubble while system is responding
            visible ? (
              <div
                style={{ display: 'block', marginLeft: 'auto', marginRight: 'auto', width: '10%' }}
              />
            ) : (
              ''
            )
          }
        </Stack>
      </CardContent>
    </Card>
  );
};

export default Messages;
