import React, { useEffect } from 'react';
import { signal } from '@preact/signals-react';
import { useTranslation } from 'react-i18next';
import { getUA } from 'react-device-detect';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import MetricsClient from '../../clients/MetricsClient';
import VersionAndOrgClient from '../../clients/VersionAndOrgClient';
import OpenAIClient from '../../clients/OpenAIClient';
import { TraceSeverity } from '../../clients/models/MetricsModel';
import NavBar from '../../components/NavBar/NavBar';
import Messages from '../../components/Messages/Messages';
import SendMessage from '../../components/SendMessage/SendMessage';
import TermsAndConditions from '../../components/TermsAndConditions/TermsAndConditions';
import { MessagesAndSendMessageDiv } from './Home.styles';
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

        // Set default model
        if (availableModels.value.includes(GPT_MODELS.GPT_4_32K)) {
          model.value = GPT_MODELS.GPT_4_32K;
          tokenLimit.value = ConfigurationConstants.TOKEN_LIMIT_GPT_4_32K;
          maxTokens.value = ConfigurationConstants.DEFAULT_MAX_TOKENS_GPT_4_32K;
        } else {
          model.value = GPT_MODELS.GPT_3_5_TURBO_16K;
          tokenLimit.value = ConfigurationConstants.TOKEN_LIMIT_GPT_3_5_TURBO_16K;
          maxTokens.value = ConfigurationConstants.DEFAULT_MAX_TOKENS_GPT_3_5_TURBO_16K;
        }
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
        {/* <NavBar />
        <MessagesAndSendMessageDiv>
          <Messages />
          <SendMessage />
        </MessagesAndSendMessageDiv> */}

        <Box
          sx={{
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            // bgcolor: "grey.200",
          }}
        >
          <Box sx={{ p: 2, backgroundColor: 'background.default' }}>
            <NavBar />
          </Box>
          <Box sx={{ flexGrow: 1, overflow: 'auto', p: 2 }}>
            <Messages />
          </Box>
          <Box sx={{ p: 2, backgroundColor: 'background.default' }}>
            <SendMessage />
          </Box>
        </Box>
      </div>
    )
  );
};

export default Home;
