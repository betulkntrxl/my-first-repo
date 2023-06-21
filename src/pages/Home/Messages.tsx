import { Card, CardContent, Stack } from '@mui/material';
import Paper from '@mui/material/Paper';
import React from 'react';
import CircleOutlinedIcon from '@mui/icons-material/CircleOutlined';
import { faRobot } from '@fortawesome/free-solid-svg-icons/faRobot';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

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
        maxHeight: '70vh',
        height: '70vh',
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
                    src="user.png"
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
                    alt="user"
                    src="system.png"
                    style={{
                      width: 40,
                      height: 40,
                      marginTop: 20,
                      marginLeft: 20,
                      marginRight: 10,
                    }}
                  />

                  <Paper
                    key={value.id + 9}
                    elevation={3}
                    style={{
                      backgroundColor: '#E5F2F9',
                      marginTop: 40,
                      padding: '10px',
                      float: 'left',
                      display: displayValue,
                      whiteSpace: 'pre-wrap',
                    }}
                  >
                    {value.content}
                  </Paper>
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
            <img src="/typing.gif" alt="typing" width="50px" style={{ marginTop: 20 }} />
          ) : null
        }
        <br />
      </CardContent>
    </Card>
  );
};

export default Messages;
