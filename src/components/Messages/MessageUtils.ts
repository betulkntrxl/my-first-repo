import { showSnackbar } from '../../App';
import MetricsClient from '../../clients/MetricsClient';
import { TraceSeverity } from '../../clients/models/MetricsModel';

export enum PromptType {
  SYSTEM = 'system',
  USER = 'user',
}

const delay = 2000;
export const copyText = async (promptType: PromptType, text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    showSnackbar.value = true;
    setTimeout(() => {
      showSnackbar.value = false;
    }, delay);
    MetricsClient.sendEvent({
      name: `ChatApp ${promptType} prompt copied`,
    });
  } catch (error: any) {
    MetricsClient.sendTrace({
      message: `ChatApp ${promptType} prompt copy failed`,
      severity: TraceSeverity.ERROR,
      properties: { errorResponse: error.response },
    });
  }
};
