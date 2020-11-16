import JSCookies from 'js-cookie';
import getDeviceInfo from './device';
import { GET, PATCH, POST } from './http';
import { checkUrlParameters, generateDomTree } from './tools';
/**
 * @description URL's host and port (if different from the default port for the scheme).
 */
const pageHost = window.location.host;

/**
 * @description URL's fragment (includes leading "#" if non-empty).
 */
const pageHash = window.location.hash;

/**
 * @description URL's path.
 */
const pagePath = window.location.pathname;

/**
 * @description Verifier of hash status.
 */
const isHashed = !!pageHash.replace(/\/+$/, '');

/**
 * @description The current version of the data handled by the script.
 */
const versionOfData = '1.5';

/**
 * @description The current version of the data handled by the script with the prefix of the type of data handled.
 */
const dataVersion = `${process.env.NODE_ENV === 'development' ? 'dev' : 'prod'}-${versionOfData}`;

/**
 * @description Function to obtain information from the user.
 * @param {string} apiKey UX-Key User API Key.
 * @returns {Promise<import('../../types/UserResponse').UserResponse>} API response about the user obtained.
 */
export const getUser = (apiKey) =>
   GET(`users/apikey/${apiKey}`)
      .then((resp) => resp)
      .catch((err) => err);

/**
 * @description Function to obtain the list of sites of a user.
 * @param {import('../../types/UserResponse').UserResponse} userInfo API response about the user obtained.
 * @returns {Promise<import('../../types/SitesResponse').SitesResponse>} API response of the sites.
 */
export const getSites = (userInfo) =>
   GET(`sites?where=user:=:${userInfo.data._id}`)
      .then((resp) => resp)
      .catch((err) => err);

/**
 * @description Function to create a record in the API sites.
 * @param {import('../../types/SiteInfo').SiteInfo} siteData New site information.
 * @returns {Promise<import('../../types/SiteResponse').SiteResponse>} API response of the new site.
 */
export const createSite = (siteData) =>
   POST('sites', siteData)
      .then((resp) => resp)
      .catch((err) => err);

/**
 * @description Function to verify the status of a site with the current site characteristics.
 * @param {import('../../types/UserResponse').UserResponse} userInfo API response about the user obtained.
 * @returns {Promise<import('../../types/SiteInfo').SiteInfo>} Information on the site (found or created).
 */
export const setSite = async (userInfo) => {
   /**
    * @description API response with the user's sites list.
    */
   const sitesResp = await getSites(userInfo);
   /**
    * @description Site in the list that corresponds to the current site.
    */
   const siteInList = sitesResp.data.sites.find((site) => site.fields.host === pageHost);
   // * If a site is found, its information is sent.
   if (siteInList) return siteInList;
   // * Otherwise, a new registration is made in the database and the corresponding information is sent.
   const siteInfo = await createSite({ fields: { host: pageHost }, user: userInfo.data._id });
   return siteInfo.data;
};

/**
 * @description Function to obtain the list of the pages from a site.
 * @param {import('../../types/SiteInfo').SiteInfo} siteInfo API response about the site obtained.
 * @returns {Promise<import('../../types/PagesResponse').PagesResponse>} API response of the pages.
 */
export const getPages = (siteInfo) =>
   GET(`pages?where=site:=:${siteInfo._id}`)
      .then((resp) => resp)
      .catch((err) => err);

/**
 * @description Function to create a record in the API pages.
 * @param {import('../../types/PageInfo').PageInfo} pageData New page information.
 * @returns {Promise<import('../../types/PageResponse').PageResponse>} API response of the new page.
 */
export const createPage = (pageData) =>
   POST('pages', pageData)
      .then((resp) => resp)
      .catch((err) => err);

/**
 * @description Function to verify the status of a page with the current page characteristics.
 * @param {import('../../types/SiteInfo').SiteInfo} siteInfo API response about the site obtained.
 * @returns {Promise<import('../../types/PageInfo').PageInfo>} Information on the page (found or created).
 */
export const setPage = async (siteInfo) => {
   /**
    * @description Final version of [pagePath] to send to the database.
    * @type {string}
    */
   const truePath = checkUrlParameters(pagePath);
   /**
    * @description Final version of [pageHash] to send to the database.
    * @type {string}
    */
   const trueHash = checkUrlParameters(pageHash);
   /**
    * @description API response with the site's pages list.
    */
   const pageResp = await getPages(siteInfo);
   /**
    * @description Page in the list that corresponds to the current page.
    */
   const pageInList = pageResp.data.pages.find((page) => {
      if (isHashed)
         return (
            page.fields.hash === trueHash ||
            page.fields.hash === `${trueHash}/` ||
            page.fields.hash === trueHash.replace(/\/+$/, '')
         );
      return (
         page.fields.path === truePath ||
         page.fields.path === `${truePath}/` ||
         page.fields.hash === truePath.replace(/\/+$/, '')
      );
   });
   // * If a page is found, its information is sent.
   if (pageInList) return pageInList;
   // * Otherwise, a new registration is made in the database and the corresponding information is sent.
   const pageInfo = await createPage({
      fields: { hash: !isHashed ? null : trueHash, path: isHashed ? null : truePath },
      site: siteInfo._id,
   });
   return pageInfo.data;
};

/**
 * @description Function to create a record in the API visitors.
 * @param {import('../../types/VisitorInfo').VisitorInfo} visitorData New visitor information.
 * @returns {Promise<import('../../types/VisitorResponse').VisitorResponse>} API response of the new visitor.
 */
export const createVisitor = (visitorData) =>
   POST('visitors', visitorData)
      .then((resp) => resp)
      .catch((err) => err);

/**
 * @description Function to check if there is a record of a visitor to the page in the browser's cookies.
 * If there is, its ID is returned, otherwise a record is created in the database and the cookie is created in the browser.
 * The ID is therefore returned.
 * @param {string} pageId The ID of the page where the visitor is.
 * @param {string} siteId The ID of the site where the visitor is.
 * @return {Promise<string>} The visitor's ID (found or created).
 */
export const setVisitor = async (pageId, siteId) => {
   /**
    * @description Value of the cookie in the browser that contains the visitor's id.
    */
   const visitorCookieValue = JSCookies.get('ux-key_visitor');
   // * If a value is found in the cookies it is returned.
   if (visitorCookieValue) return visitorCookieValue;
   // * Otherwise, a new record of visitors is created in the database and in turn a cookie is created in the browser.
   const visitorCreateResponse = await createVisitor({
      fields: { dataVersion },
      page: pageId,
      site: siteId,
   });
   JSCookies.set('ux-key_visitor', visitorCreateResponse.data._id, { path: '/', expires: 365 });
   // * After this, the visitor's id (created or found) is returned.
   return visitorCreateResponse.data._id;
};

/**
 * @description Function to create a record in the API sessions.
 * @param {import('../../types/SessionRequestInfo').SessionRequestInfo} sessionData New session information.
 * @returns {Promise<import('../../types/SessionResponse').SessionResponse>} API response of the new session.
 */
export const createSession = (sessionData) =>
   POST('sessions', sessionData)
      .then((resp) => resp)
      .catch((err) => err);

/**
 * @description Gets the device data and the page to create a new session record in the database.
 *
 * @param {import('../../types/PageInfo').PageInfo} pageInfo Page information obtained or created previously.
 * @param {string} visitorId ID obtained from the current visitor.
 * @param {Record<string, unknown>} loadingTime Basic page loading information.
 * @returns {Promise<import('../../types/SessionRequestInfo').SessionRequestInfo>}
 */
export const setSession = async (pageInfo, visitorId, loadingTime) => {
   /**
    * @description Object representing the structure of the page.
    */
   const lom = generateDomTree(document.body);
   /**
    * @description Object with device information.
    */
   const deviceInfo = getDeviceInfo();
   /**
    * @description Previous page ID.
    */
   const previousPage = JSCookies.get('ux-key_prev-page') || null;
   /**
    * @description Checking if the session has been a refresh.
    */
   const pageRefresh = previousPage === pageInfo._id;
   /**
    * @description Complete session information.
    */
   const sessionReqInfo = {
      fields: {
         dataVersion,
         deviceInfo,
         devicePixelRatio: window.devicePixelRatio,
         ended: false,
         initialBodyClientHeight: document.body.clientHeight,
         initialBodyClientWidth: document.body.clientWidth,
         loadingTime,
         lom,
         pageRefresh,
         previousPage: previousPage || null,
         visitorId,
      },
      page: pageInfo._id,
   };

   const resp = await createSession(sessionReqInfo);

   return resp.data;
};

/**
 * @description Function to update a record in the API sessions.
 * @param {string} sessionId Session ID.
 * @param {Record<string, unknown>} sessionData Session information to update.
 * @returns {Promise<import('../../types/SessionResponse').SessionResponse>} API response of the updated session.
 */
export const updateSession = (sessionId, sessionData) =>
   PATCH(`sessions/${sessionId}`, sessionData)
      .then((resp) => resp)
      .catch((err) => err);

/**
 * @description Function to change the finalization status and date of a session.
 * @returns {Promise<string>}
 */
export const updatePreviousSession = async () => {
   try {
      const resp = '';
      const sessionId = JSCookies.get('ux-key_prev-session');
      const updatedInfo = {
         ended: true,
         endedAt: new Date(),
      };
      if (sessionId) await updateSession(sessionId, updatedInfo);
      return resp;
   } catch (e) {
      return e;
   }
};
