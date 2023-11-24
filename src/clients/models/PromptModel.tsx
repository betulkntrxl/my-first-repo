interface SendPromptData {
  systemMessageValue: string;
  newMessage: {
    role: string;
    content: any;
  }[];
  messageToSend: string;
  temperature: number;
  topP: number;
  maxTokens: number;
  APITimeout: number;
}

export default SendPromptData;
