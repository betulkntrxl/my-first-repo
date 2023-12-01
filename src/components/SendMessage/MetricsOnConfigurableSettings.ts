import MetricsClient from '../../clients/MetricsClient';
import {
  temperature,
  topP,
  maxTokens,
  pastMessages,
  APITimeout,
} from '../ConfigurationMenu/ConfigurationMenu';
import ConfigurationConstants from '../ConfigurationMenu/ConfigurationConstants';

const gatherMetricsOnConfigurableSettings = () => {
  if (temperature.value !== ConfigurationConstants.DEFAULT_TEMPERATURE) {
    // Tracking in app insights
    MetricsClient.sendEvent({
      name: `Temperature sent as ${temperature}`,
    });
  }

  if (topP.value !== ConfigurationConstants.DEFAULT_TOP_P) {
    // Tracking in app insights
    MetricsClient.sendEvent({
      name: `TopP sent as ${topP}`,
    });
  }

  if (maxTokens.value !== ConfigurationConstants.DEFAULT_MAX_TOKENS) {
    // Tracking in app insights
    MetricsClient.sendEvent({
      name: `Max Tokens sent as ${maxTokens}`,
    });
  }

  if (pastMessages.value !== ConfigurationConstants.DEFAULT_PAST_MESSAGES) {
    // Tracking in app insights
    MetricsClient.sendEvent({
      name: `Past Messages sent as ${pastMessages}`,
    });
  }

  if (APITimeout.value !== ConfigurationConstants.DEFAULT_API_TIMEOUT) {
    // Tracking in app insights
    MetricsClient.sendEvent({
      name: `API Timeout sent as ${APITimeout}`,
    });
  }
};

export default gatherMetricsOnConfigurableSettings;
