import ConfigurationConstants from './ConfigurationConstants';
import { GPT_MODELS } from '../../clients/models/PromptModel';

const getTokenLimit = (modelSelected: GPT_MODELS) =>
  modelSelected === GPT_MODELS.GPT_3_5_TURBO_16K
    ? ConfigurationConstants.TOKEN_LIMIT_GPT_3_5_TURBO_16K
    : ConfigurationConstants.TOKEN_LIMIT_GPT_4_32K;

const getMaxTokensDefault = (modelSelected: GPT_MODELS) =>
  modelSelected === GPT_MODELS.GPT_3_5_TURBO_16K
    ? ConfigurationConstants.DEFAULT_MAX_TOKENS_GPT_3_5_TURBO_16K
    : ConfigurationConstants.DEFAULT_MAX_TOKENS_GPT_4_32K;

export { getTokenLimit, getMaxTokensDefault };
