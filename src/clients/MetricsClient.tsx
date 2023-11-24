import axios from 'axios';
import { SendEventData, SendTraceData } from './models/MetricsModel';

const MetricsClient = {
  sendEvent: async (sendEventData: SendEventData) => {
    const { data } = await axios.post('/api/app-insights-trace', sendEventData);

    return data;
  },

  sendTrace: async (sendTraceData: SendTraceData) => {
    const { data } = await axios.post('/api/app-insights-trace', sendTraceData);

    return data;
  },
};

export default MetricsClient;
