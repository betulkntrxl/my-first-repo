import { Card, CardActionArea, CardContent } from '@mui/material';
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
        maxHeight: '60vh',
        overflow: 'auto',
        overflowY: 'scroll',
        backgroundColor: 'transparent',
      }}
      ref={bottomRef}
    >
      <CardActionArea>
        <CardContent>
          {messagesDisplay.map((value, index) => {
            if (value.role === 'user' && index !== 0) {
              return (
                <div key={value.id + 1}>
                  <br key={value.id + 2} />
                  <br key={value.id + 3} />
                  <Paper
                    key={value.id + 4}
                    elevation={3}
                    style={{
                      padding: '10px',
                      display: value.content.length === 0 ? 'none' : 'block',
                      justifyContent: 'flex-end',
                      float: 'right',
                      whiteSpace: 'pre-wrap',
                    }}
                  >
                    {value.content}
                    {/* sent */}
                  </Paper>
                  <br key={value.id + 5} />
                </div>
              );
            }
            if (value.role === 'system' && index !== 0) {
              return (
                <div key={value.id + 6}>
                  <br key={value.id + 7} />
                  <br key={value.id + 8} />
                  <Paper
                    key={value.id + 9}
                    elevation={3}
                    style={{
                      padding: '10px',
                      float: 'left',
                      display: displayValue,
                      whiteSpace: 'pre-wrap',
                    }}
                  >
                    {/* data.response */}
                    {value.content}
                  </Paper>
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
          {scrollToBottom()}
          <br />
          <br />
          {visible ? <img src="/typing.gif" alt="typing" width="50px" /> : null}
          <br />
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default Messages;
