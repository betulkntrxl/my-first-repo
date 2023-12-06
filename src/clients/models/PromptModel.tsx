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
