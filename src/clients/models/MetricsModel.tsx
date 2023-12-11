export interface SendEventData {
  name: string;
}

export enum TraceSeverity {
  VERBOSE = 0,
  INFORMATIONAL = 1,
  WARNING = 2,
  ERROR = 3,
  CRITICAL = 4,
}

export interface SendTraceData {
  message: string;
  severity: TraceSeverity;
  properties?: {};
}
