/* eslint-disable no-param-reassign */
import { encode } from 'js-base64';

/**
 * @description Function to verify if a given number is within the range of two other numbers.
 * @param {number} number Number to compare.
 * @param {number} limitA First limit.
 * @param {number} limitB Last limit.
 */
export const isBetween = (number, limitA, limitB) => (number - limitA) * (number - limitB) <= 0;

/**
 * @description Function to get the page name for the json file
 *
 * @returns {string} Page name
 */
export const getPageName = () => {
   /**
    * @description URL's fragment (includes leading "#" if non-empty).
    */
   const pageHash = window.location.hash;
   /**
    * @description URL's path.
    */
   const pagePath = window.location.pathname.split('/').reverse()[0];

   if (pagePath === '/' && pageHash === '') return '';

   return `${pagePath}${pageHash}`;
};

/**
 * @description Function to create an object of the elements in the DOM of the page.
 *
 * @param {(Element | HTMLElement)} element Element from which to create the object.
 * @returns {LOM}
 */
export const generateDomTree = (element) => {
   const elementRect = element.getBoundingClientRect();
   const nodeNameFilter = ['HEAD', 'SCRIPT', 'svg', 'symbol', 'defs', 'path'];

   /** @type {LOM} */
   const elementInfo = {
      bounds: {
         height: elementRect.height,
         width: elementRect.width,
         x: elementRect.x,
         y: elementRect.y,
      },
      children: [],
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
 *
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
 *
 * @param {Element} elt Element from which to get the xPath.
 * @returns {string}
 */
const getElementXPath = (elt) => {
   let path = '';
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
 *
 * @param {HTMLElement} element Element to identify.
 */
export const identifyElements = (element) => {
   const filter = ['HEAD', 'SCRIPT', 'svg', 'symbol', 'defs', 'path'];
   const xPath = getElementXPath(element);
   const uxId = encode(`${xPath}${element.id}`);

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
