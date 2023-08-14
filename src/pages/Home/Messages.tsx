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
              You can ask ChatApp a question using the textbox below. Please keep the following in
              mind when using this tool:
              <br />
              <br />
              <ul style={{ textAlign: 'left' }}>
                <li>
                  Any questions asked or data entered will not be used to train or improve the
                  current underlying model or future models.
                </li>
                <li>
                  Use good judgement before relying on or sharing ChatApp responses as they may not
                  always be accurate. Pressure test and verify that the response seems correct,
                  unbiased, and explainable - does it make sense?
                </li>
                <li>
                  During these early learning days, do not rely on these responses without taking
                  additional verification steps for critical business purposes or for decisions with
                  significant impacts (employment/hiring, financial, legal, healthcare applications
                  or decisions, etc.).
                </li>
                <li>
                  Our default models&apos; training data (i.e., the information from which the model
                  has been developed) cuts off in 2021, so the models&apos; output may not reflect
                  current events.
                </li>
                <li>
                  McKesson Security teams and Microsoft will be monitoring all use in this McKesson
                  GPT environment. Anyone using this application expressly consents to such
                  monitoring. If such monitoring reveals possible activity which violates company
                  policy and/or the law, system personnel may provide this information to relevant
                  company legal/ethical channels and/or to law enforcement officials.
                </li>
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
