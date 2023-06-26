import { Card, CardContent, Stack } from '@mui/material';
import Paper from '@mui/material/Paper';
import React from 'react';

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
  const { bottomRef, messagesDisplay, displayValue, visible } = props;

  function scrollToBottom() {
    setTimeout(() => {
      if (bottomRef.current) {
        bottomRef.current.scrollTop = bottomRef.current.scrollHeight;
      }
    }, 1000);
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
        backgroundColor: 'transparent',
      }}
      ref={bottomRef}
    >
      <CardContent>
        {messagesDisplay.map((value, index) => {
          // check for user or system message
          if (value.role === 'user' && index !== 0) {
            return (
              <div key={value.id + 1}>
                <br key={value.id + 2} />
                <br key={value.id + 3} />
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
                    src="user.jpg"
                    style={{ width: 40, height: 40, marginTop: 20, marginLeft: 10 }}
                  />
                </Stack>
                <br key={value.id + 5} />
              </div>
            );
          }
          // check for message from system
          if (value.role === 'system' && index !== 0) {
            return (
              <div key={value.id + 6}>
                <br key={value.id + 7} />
                <br key={value.id + 8} />
                <Stack direction="row" style={{ float: 'left' }}>
                  <img
                    alt="assistant"
                    src="system.jpg"
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
                    <img
                      alt="assistant"
                      src="/typing.gif"
                      width="100px"
                      height={37}
                      style={{ marginTop: 40 }}
                    />
                  )}
                </Stack>
                <br key={value.id + 10} />
                <br key={value.id + 11} />
              </div>
            );
          }
          return (
            <div key={value.id + 12}>
              <br key={value.id + 13} />
              <br key={value.id + 14} />
            </div>
          );
        })}
        {
          // scroll to bottom of chat after system has responded
          scrollToBottom()
        }
        <br />
        <br />
        {
          // show typing bubble while system is responding
          visible ? (
            <div
              style={{ display: 'block', marginLeft: 'auto', marginRight: 'auto', width: '10%' }}
            >
              {/*  <img
                src="/typing.gif"
                alt="typing"
                width="100px"
                style={{ marginTop: 20, position: 'fixed', bottom: 125 }}
          /> */}
            </div>
          ) : null
        }
        <br />
      </CardContent>
    </Card>
  );
};

export default Messages;
