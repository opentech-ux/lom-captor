import consola from 'consola';
import JSCookies from 'js-cookie';

/**
 * @description Function to obtain the value of a specific parameter in query of a given url.
 * @param {string} name Name of the parameter to search in the query of the given url.
 * @param {string} url URL containing the query where to look for the parameter.
 * @returns {string | null} If found, the value of the specified parameter is returned. Otherwise null is returned.
 */
export const getParameterByName = (name, url) => {
   const realUrl = url ?? window.location.href;
   const realName = name.replace(/[\\[\]]/g, '\\$&');
   const regex = new RegExp(`[?&]${realName}(=([^&#]*)|&|#|$)`);
   const results = regex.exec(realUrl);
   if (!results) return null;
   if (!results[2]) return '';
   return decodeURIComponent(results[2].replace(/\+/g, ' '));
};

/**
 * @description Function to check if a string contains any numerical value.
 * @param {string} string The string of characters to be checked.
 * @returns {boolean} A confirmation of the result is returned.
 */
export const hasNumber = (string) => /\d/.test(string);

/**
 * @description Instance of the console.
 */
export const uxkeyConsole = consola;

/**
 * @description Function to verify if a given number is within the range of two other numbers.
 * @param {number} number Number to compare.
 * @param {number} limitA First limit.
 * @param {number} limitB Last limit.
 */
export const isBetween = (number, limitA, limitB) => (number - limitA) * (number - limitB) <= 0;

/**
 * @description Each section (delimited by a slash "/") of the hash or path is checked for any alphanumeric character.
 * If found, it is replaced by the text: "{parameter}".
 * @param {string} urlExtension Extension of the URL where the page is identified.
 * @returns {string} The same extension of the URL but with the identification parameters replaced by the text: "{parameter}".
 *
 * @see {@link https://rubn.xyz/3exvv} for further information.
 */

export const checkUrlParameters = (urlExtension) =>
   urlExtension
      .split('/')
      .map((part) => (hasNumber(part) ? '{parameter}' : part))
      .join('/');

/**
 * @description Method for grouping (simplifying) the contents of a array.
 *
 * @param {Array} array Array to be simplified.
 * @param {Function} f Function that returns an array with attributes to simplify.
 * @returns {Array}
 */
export const simplifyArray = (array, f) => {
   const groups = {};
   array.forEach((o) => {
      const group = JSON.stringify(f(o));
      groups[group] = groups[group] || [];
      // eslint-disable-next-line no-param-reassign
      o.numberTimes = groups[group].length + 1;
      groups[group].push(o);
   });
   return Object.keys(groups).map((group) =>
      groups[group].filter((ele) => ele.numberTimes === groups[group].length)
   );
};

/**
 *
 *
 * @returns {string}
 */
export const getPageName = () => {
   /**
    * @description URL's fragment (includes leading "#" if non-empty).
    */
   const pageHash = window.location.hash;
   /**
    * @description URL's path.
    */
   const pagePath = window.location.pathname;

   if (pagePath === '/' && pageHash === '') return '';

   return `${pagePath}${pageHash}`;
};

/**
 * @description Function to create an object of the elements in the DOM of the page.
 *
 * @param {(Element | HTMLElement)} element Element from which to create the object.
 * @returns {Record<string,unknown>}
 */
export const generateDomTree = (element) => {
   const elementRect = element.getBoundingClientRect();
   const nodeNameFilter = ['HEAD', 'SCRIPT', 'svg', 'symbol', 'defs', 'path'];

   const elementInfo = {
      children: [],
      bounds: {
         // bottom: elementRect.bottom,
         height: elementRect.height,
         // left: elementRect.left,
         // right: elementRect.right,
         // top: elementRect.top,
         width: elementRect.width,
         x: elementRect.x,
         y: elementRect.y,
      },
      uxId: element.dataset.uxId || null,
   };

   if (element.children.length !== 0) {
      Array.from(element.children).forEach((el) => {
         if (nodeNameFilter.indexOf(el.nodeName) === -1) {
            elementInfo.children.push(generateDomTree(el));
         }
      });
   }

   return elementInfo;
};

/**
 * @description Function to obtain the quantity of the elements.
 * @param {Element} elt Element from which to create the ID.
 * @returns {number}
 */
const getElementIdx = (elt) => {
   let count = 1;
   for (let sib = elt.previousSibling; sib; sib = sib.previousSibling) {
      if (sib.nodeType === 1 && sib.nodeName === elt.tagName) count += 1;
   }

   return count;
};

/**
 * @description Function to get the xPath of an element.
 * @param {Element} elt Element from which to get the xPath.
 * @returns {string}
 */
const getElementXPath = (elt) => {
   let path = '';
   // @ts-ignore
   // eslint-disable-next-line no-param-reassign
   for (; elt && elt.nodeType === 1; elt = elt.parentNode) {
      const idx = getElementIdx(elt);
      let xname = elt.tagName;
      if (idx > 1) xname += `[${idx}]`;
      path = `/${xname}${path}`;
   }

   return path;
};

/**
 * @description Function to add the attribute to identify an element.
 * @param {HTMLElement} element Element to identify.
 */
export const identifyElements = (element) => {
   const filter = ['HEAD', 'SCRIPT', 'svg', 'symbol', 'defs', 'path'];
   const xPath = getElementXPath(element);
   const uxId = btoa(`${xPath}${element.id}`);
   element.setAttribute('data-ux-id', uxId);
   if (element.hasChildNodes()) {
      const children = Array.from(element.children);
      for (let i = 0; i < children.length; i += 1) {
         const child = children[i];
         if (filter.indexOf(child.nodeName) === -1) {
            identifyElements(child);
         }
      }
   }
};

/**
 * @description Function to update the previously visited page.
 *
 * @param {import('../../types/PageInfo').PageInfo} pageInfo Page information obtained or created previously.
 * @param {import('../../types/SessionRequestInfo').SessionRequestInfo} sessionInfo Session information obtained or created previously.
 */
export const updatePreviousPage = (pageInfo, sessionInfo) => {
   JSCookies.set('ux-key_prev-page', pageInfo._id, { path: '/', expires: 1 });
   JSCookies.set('ux-key_prev-session', sessionInfo._id, { path: '/', expires: 1 });
};

/**
 * @description Function for collecting information from two objects.
 *
 * @param {Record<string, unknown>} obj Base object.
 * @param {Record<string, unknown>} src Object with information to be added.
 * @returns {Record<string, unknown>}
 */
export const mergeObjects = (obj, src) => {
   Object.keys(src).forEach((key) => {
      // eslint-disable-next-line no-param-reassign
      if (Object.prototype.hasOwnProperty.call(src, key)) obj[key] = src[key];
   });
   return obj;
};
