import { showSnackbar } from '../../App';
import MetricsClient from '../../clients/MetricsClient';
import { TraceSeverity } from '../../clients/models/MetricsModel';

const delay = 2000;
export const copyText = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    showSnackbar.value = true;
    setTimeout(() => {
      showSnackbar.value = false;
    }, delay);
    MetricsClient.sendEvent({
      name: `ChatApp prompt copied`,
    });
  } catch (error: any) {
    MetricsClient.sendTrace({
      message: 'ChatApp prompt copy failed',
      severity: TraceSeverity.ERROR,
      properties: { errorResponse: error.response },
    });
  }
};
