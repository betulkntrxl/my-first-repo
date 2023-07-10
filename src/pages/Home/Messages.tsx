import { Card, CardContent, Stack } from '@mui/material';
import Paper from '@mui/material/Paper';
import React from 'react';
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
        // zIndex: -2,
        backgroundColor: 'transparent',
        //        backgroundColor:'#E5EFF3'
      }}
      ref={bottomRef}
    >
      <CardContent>
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
            Enter an instruction or select a preset, and watch the API respond with a completion
            that attempts to match the context or pattern you provided.
            <br />
            <br />
            Use good judgment when sharing outputs, and attribute them to your name or company.
            <br />
            <br />
            Requests submitted to our API will not be used to train or improve future models.
            <br />
            <br />
            Our default models&apos; training data cuts off in 2021, so they may not have knowledge
            of current events.
          </div>
          <div style={{ fontSize: 14, textAlign: 'center', margin: 30 }}>
            Please note that McKesson Security teams and Microsoft will be monitoring all use in
            this McKesson GPT environment. Anyone using this application expressly consents to such
            monitoring and is advised that if such monitoring reveals possible criminal activity,
            system personnel may provide the evidence of such monitoring to law enforcement
            officials.
          </div>
        </div>

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
                    key={Date.now()}
                    alt="user"
                    src={UserIcon}
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
            />
          ) : (
            ''
          )
        }
        <br />
      </CardContent>
    </Card>
  );
};

export default Messages;
