export enum GPT_MODELS {
  NONE = '',
  GPT_3_5_TURBO_16K = 'GPT-3-5-Turbo-16K',
  GPT_4_32K = 'GPT-4-32K',
}

export interface SendPromptData {
  systemMessageValue: string;
  pastMessages: PastMessage[];
  messageToSend: string;
  temperature: number;
  topP: number;
  maxTokens: number;
  APITimeout: number;
}

export interface PastMessage {
  role: string;
  content: any;
}
