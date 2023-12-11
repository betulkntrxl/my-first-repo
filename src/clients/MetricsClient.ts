import axios from 'axios';
import { SendEventData, SendTraceData } from './models/MetricsModel';

const MetricsClient = {
  sendEvent: (sendEventData: SendEventData) => axios.post('/api/app-insights-event', sendEventData),
  sendTrace: (sendTraceData: SendTraceData) => axios.post('/api/app-insights-trace', sendTraceData),
};

export default MetricsClient;
