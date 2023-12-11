import React, { useEffect } from 'react';
import { signal } from '@preact/signals-react';
import { useTranslation } from 'react-i18next';
import { getUA } from 'react-device-detect';

import MetricsClient from '../../clients/MetricsClient';
import VersionAndOrgClient from '../../clients/VersionAndOrgClient';
import { TraceSeverity } from '../../clients/models/MetricsModel';
import Menu from '../../components/Menu/Menu';
import Messages from '../../components/Messages/Messages';
import SendMessage from '../../components/SendMessage/SendMessage';
import TermsAndConditions from '../../components/TermsAndConditions/TermsAndConditions';
import { MessagesAndSendMessageDiv } from './Home.styles';

export const orgDeployment = signal<string>('');

const Home = () => {
  const { t } = useTranslation();

  const getOrgDeployment = async () => {
    VersionAndOrgClient.getOrgDeployment()
      .then(response => {
        orgDeployment.value = response.data.orgDeployment;
      })
      .catch(error => {
        MetricsClient.sendTrace({
          message: 'ChatApp failed to retrieve Org',
          severity: TraceSeverity.CRITICAL,
          properties: { errorResponse: error.response },
        });
      });
  };

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

  return (
    // Wait for the Org Deployment to be set before rendering
    orgDeployment.value === '' ? null : (
      <div>
        {
          // Only show the T&C's for USON
          orgDeployment.value === 'uson' && <TermsAndConditions />
        }
        <Menu />
        <MessagesAndSendMessageDiv>
          <Messages />
          <SendMessage />
        </MessagesAndSendMessageDiv>
      </div>
    )
  );
};

export default Home;
