/* eslint-disable no-param-reassign */
import { sendData } from './http';
import { generateDomTree, getPageName } from './tools';

/**
 * @description Gets and stores the last clicked element UX ID to set the "page change executer".
 *
 * @param {MouseEvent} event Click event information.
 */
const saveLastMouseDown = (event) => {
   // @ts-expect-error Target is already a HTMLElement, so it includes the dataset attribute
   localStorage.setItem('lom-pageChangeElementID', event.target.dataset.uxId ?? null);
};

/**
 * @description Checks the LOM information to identify the element that executes the change of page
 * in the site.
 *
 * @param {import('../../types/LOM').LOM} lomObject LOM information.
 * @param {string} linkPageName Page name to where the element will go.
 * @param {string} pageChangeElementID Element UX ID to search for.
 */
const addLinkToElement = (lomObject, linkPageName, pageChangeElementID) => {
   const { uxId, children } = lomObject;
   const isElementFound = uxId && uxId === pageChangeElementID;

   if (isElementFound) {
      lomObject.link = linkPageName;
      lomObject.style = {
         background: '#5F9EA0',
         border: '2px solid #00008B',
      };
   } else if (children.length > 0) {
      children.forEach((lomChild) => addLinkToElement(lomChild, linkPageName, pageChangeElementID));
   }
};

/**
 * @description Sets the LOM that will be added to the "loms" object at the sessions data, also the
 * name of the page where the LOM belongs. Then it sends the new session Data to the user-defined
 * endpoint.
 *
 * @param {import('../../types/ScriptConfiguration').ScriptConfiguration} scriptConfig Configuration for the script init.
 */
export const setLoms = (scriptConfig) => {
   const currentLom = generateDomTree(document.body);
   const previousLom = JSON.parse(localStorage.getItem('lom-previousLom'));
   const sessionData = JSON.parse(localStorage.getItem('lom-sessionData'));
   const pageName = getPageName();

   if (previousLom) {
      const previousPageName = localStorage.getItem('lom-previousPageName');
      const pageChangeElementID = localStorage.getItem('lom-pageChangeElementID');
      addLinkToElement(previousLom, pageName, pageChangeElementID);
      sessionData.loms[previousPageName] = previousLom;
      localStorage.setItem('lom-sessionData', JSON.stringify(sessionData));
      sendData(scriptConfig);
   }

   localStorage.setItem('lom-previousPageName', pageName);
   localStorage.setItem('lom-previousLom', JSON.stringify(currentLom));
};

/**
 * @description Adds event handlers for the current page.
 */
export const setEventHandlers = () => {
   document.body.addEventListener('click', (event) => saveLastMouseDown(event), false);
};
