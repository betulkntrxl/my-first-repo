const successPromptResponse = {
  status: 200,
  data: {
    id: 'chatcmpl-7gQM4JDiQa2Dc4dErFzWLnTfD0dYR',
    object: 'chat.completion',
    created: 1690345440,
    model: 'gpt-35-turbo',
    choices: [
      {
        index: 0,
        finish_reason: 'stop',
        message: {
          role: 'assistant',
          content: 'Hello! How can I assist you today?',
        },
      },
    ],
    usage: {
      completion_tokens: 9,
      prompt_tokens: 25,
      total_tokens: 34,
    },
  },
};

const successIsAuthenticatedResponse = {
  status: 200,
  data: {
    authenticated: 'true',
  },
};

const successGetVersionResponse = {
  status: 200,
  data: {
    version: 'test-version',
  },
};

const successGetOrgDeployment = {
  status: 200,
  data: {
    orgDeployment: 'mckesson',
  },
};

const successPostMetricEvent = {
  status: 201,
  data: {},
};

const successPostMetricTrace = {
  status: 201,
  data: {},
};

export {
  successPromptResponse,
  successIsAuthenticatedResponse,
  successGetVersionResponse,
  successGetOrgDeployment,
  successPostMetricEvent,
  successPostMetricTrace,
};
