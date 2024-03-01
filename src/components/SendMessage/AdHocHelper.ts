import { ChatMessage } from 'gpt-tokenizer/esm/GptEncoding';
import { isWithinTokenLimit } from 'gpt-tokenizer/esm/model/gpt-3.5-turbo-0301';
import { isChrome, isEdge, isIOS } from 'react-device-detect';
import { PastMessage } from '../../clients/models/PromptModel';

const hasCookieExpired = () => {
  // The below logic doesn't work for some browsers e.g. Safari
  // Only including supported browsers, other browsers won't get a proactive popup
  // notifying them of their expired session, they will find out when they hit the send button
  let doesCookieExist = true;
  if (!isIOS && (isChrome || isEdge)) {
    // Because the cookie is a HTTPOnly cookie it means the react app can't access
    // the cookie to check if it exists, a workaround for this is
    // to try set a cookie with the same name, if the cookie exists after
    // setting the cookie then we know the cookie didn't exist in the first place
    const DATE = new Date();
    DATE.setTime(DATE.getTime() + 1000);
    const EXPIRES = `expires=${DATE.toUTCString()}`;
    const COOKIE_NAME = 'mt-openai-chat';
    document.cookie = `${COOKIE_NAME}=new_value;path=/;${EXPIRES}`;

    doesCookieExist = document.cookie.indexOf(`${COOKIE_NAME}=`) === -1;
  }
  // If the cookie we just tried to create doesn't exist
  // then the cookie has expired
  return !doesCookieExist;
};

const isRequestWithinTokenLimit = (
  systemMessageValue: string,
  pastMessagesToInclude: PastMessage[],
  newMessage: string,
  tokenLimit: number,
) => {
  const chat = [
    { role: 'system', content: systemMessageValue },
    ...pastMessagesToInclude,
    { role: 'user', content: newMessage },
  ];

  return isWithinTokenLimit(chat as ChatMessage[], tokenLimit);
};

export { hasCookieExpired, isRequestWithinTokenLimit };
