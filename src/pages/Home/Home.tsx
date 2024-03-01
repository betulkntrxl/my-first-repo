import React, { useEffect } from 'react';
import { signal } from '@preact/signals-react';
import { useTranslation } from 'react-i18next';
import { getUA } from 'react-device-detect';

import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import MetricsClient from '../../clients/MetricsClient';
import VersionAndOrgClient from '../../clients/VersionAndOrgClient';
import OpenAIClient from '../../clients/OpenAIClient';
import { TraceSeverity } from '../../clients/models/MetricsModel';
import NavBar from '../../components/NavBar/NavBar';
import Messages from '../../components/Messages/Messages';
import SendMessage from '../../components/SendMessage/SendMessage';
import TermsAndConditions from '../../components/TermsAndConditions/TermsAndConditions';
import { MainBox, MessagesBox, SendMessageBox } from './Home.styles';
import { GPT_MODELS } from '../../clients/models/PromptModel';
import { model, tokenLimit, maxTokens } from '../../components/ConfigurationMenu/ConfigurationMenu';
import ConfigurationConstants from '../../components/ConfigurationMenu/ConfigurationConstants';

export const orgDeployment = signal<string>('');
export const availableModels = signal<string[]>([GPT_MODELS.GPT_3_5_TURBO_16K]);

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

  const getAvailableModels = async () => {
    OpenAIClient.getAvailableModels()
      .then(response => {
        availableModels.value = response.data.availableModels;

        // Set defaults
        model.value = GPT_MODELS.GPT_3_5_TURBO_16K;
        tokenLimit.value = ConfigurationConstants.TOKEN_LIMIT_GPT_3_5_TURBO_16K;
        maxTokens.value = ConfigurationConstants.DEFAULT_MAX_TOKENS_GPT_3_5_TURBO_16K;
      })
      .catch(error => {
        MetricsClient.sendTrace({
          message: 'ChatApp failed to retrieve available models',
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
    getAvailableModels();
  }, [t]);

  return (
    // Wait for the Org Deployment to be set before rendering
    orgDeployment.value === '' ? null : (
      <div>
        {
          // Only show the T&C's for USON
          orgDeployment.value === 'uson' && <TermsAndConditions />
        }
        <MainBox>
          <Box sx={{ px: 2 }}>
            <NavBar />
          </Box>
          <MessagesBox>
            <Messages />
          </MessagesBox>
          <SendMessageBox>
            <BottomNavigation
              sx={{
                position: 'fixed',
                bottom: 0,
                width: '100%',
                display: 'inline',
                paddingBottom: '8px',
                paddingTop: '8px',
              }}
            >
              <SendMessage />
            </BottomNavigation>
          </SendMessageBox>
        </MainBox>
      </div>
    )
  );
};

export default Home;
