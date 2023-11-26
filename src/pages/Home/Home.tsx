import React, { useState, useRef, useEffect } from 'react';
import { signal } from '@preact/signals-react';
import { useTranslation } from 'react-i18next';
import { getUA } from 'react-device-detect';

import MetricsClient from '../../clients/MetricsClient';
import VersionAndOrgClient from '../../clients/VersionAndOrgClient';
import { TraceSeverity } from '../../clients/models/MetricsModel';
import Menu from '../../components/Menu';
import Messages from '../../components/Messages';
import SendMessage, { messagesDisplay } from '../../components/SendMessage';
import TermsAndConditions from '../../components/TermsAndConditions';

export const orgDeployment = signal<string>('');

const Home = () => {
  const { t } = useTranslation();

  async function getOrgDeployment() {
    VersionAndOrgClient.getOrgDeployment()
      .then(responseData => {
        orgDeployment.value = responseData.orgDeployment;
      })
      .catch(error => {
        MetricsClient.sendTrace({
          message: 'ChatApp failed to retrieve Org',
          severity: TraceSeverity.CRITICAL,
          properties: { errorResponse: error.response },
        });
      });
  }

  useEffect(() => {
    // Tracking in app insights
    MetricsClient.sendTrace({
      message: `ChatApp Browser Details ${getUA}`,
      severity: TraceSeverity.INFORMATIONAL,
    });

    MetricsClient.sendTrace({
      message: `ChatApp default language set to ${t('current-language').toLowerCase()}`,
      severity: TraceSeverity.INFORMATIONAL,
    });

    getOrgDeployment();
  }, [t]);

  const bottomRef: any = useRef();

  return (
    // Wait for the Org Deployment to be set before rendering
    orgDeployment.value === '' ? null : (
      <div>
        {orgDeployment.value === 'uson' && <TermsAndConditions />}
        <Menu />

        <div
          style={{
            backgroundAttachment: 'fixed',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center 90px',
            width: '100%',
            float: 'right',
            margin: 10,
            height: 500,
          }}
        >
          {messagesDisplay.value.length < 3 ? ( // hide background when chat starts
            <div
              style={{
                position: 'absolute',
                // color:'#B3CEDD',
                color: 'steelblue',
                //  backgroundColor: '#E5EFF3',
                opacity: 0.6,
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                zIndex: -1,
                overflow: 'hidden',
                fontFamily: 'arial',
              }}
            />
          ) : (
            ''
          )}

          <div style={{ float: 'right', width: '100%' }}>
            <Messages bottomRef={bottomRef} />
          </div>

          <SendMessage />
        </div>
      </div>
    )
  );
};

export default Home;
