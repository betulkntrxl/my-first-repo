import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, Stack } from '@mui/material';
import Paper from '@mui/material/Paper';

import SystemIcon from '../../assets/system.jpg';
import UserIcon from '../../assets/user.jpg';
import Typing from '../../assets/typing.gif';

import { visible, displayValue, allMessagesToDisplay } from '../SendMessage/SendMessage';

const Messages = (props: { bottomRef: any }) => {
  const { t } = useTranslation();

  const { bottomRef } = props;

  const scrollToBottom = () => {
    setTimeout(() => {
      if (bottomRef.current) {
        bottomRef.current.scrollTop = bottomRef.current.scrollHeight;
      }
    }, 500);
    return null;
  };

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
            <div style={{ fontSize: 14, textAlign: 'center', margin: 5 }}>
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
                <li>{t('background.bullet7')}</li>
                <li>{t('background.bullet8')}</li>
              </ul>
            </div>
          </div>

          {allMessagesToDisplay.value.map(value => {
            if (value.role === 'user') {
              return (
                <div key={value.id}>
                  <Stack direction="row" style={{ float: 'right' }}>
                    <Paper
                      key={value.id}
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
                        marginTop: 20,
                        marginLeft: 20,
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
            visible.value === 'true' ? (
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
