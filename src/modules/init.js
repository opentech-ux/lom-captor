import { getUser, setPage, setSession, setSite, setVisitor, updatePreviousSession } from './api';
import { identifyElements, updatePreviousPage, uxkeyConsole } from './tools';
/**
 * @description Function that initiates the operation of the script by setting the information obtained.
 * @param {string} apiKey UX-Key User API Key.
 * @param {Record<string, number>} loadingTimeObject UX-Key User API Key.
 */
const initScript = async (apiKey, loadingTimeObject) => {
   identifyElements(document.body);
   const userInfo = await getUser(apiKey);
   const siteInfo = await setSite(userInfo);
   const pageInfo = await setPage(siteInfo);
   const visitorId = await setVisitor(pageInfo._id, siteInfo._id);
   const sessionInfo = await setSession(pageInfo, visitorId, loadingTimeObject);
   updatePreviousSession();
   updatePreviousPage(pageInfo, sessionInfo);
   uxkeyConsole.log(sessionInfo);
   uxkeyConsole.ready('UX-Key is ready');
};

export default initScript;
