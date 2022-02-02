/* eslint-disable no-param-reassign */
import { sendData } from './http';
import { generateDomTree, getPageName } from './tools';
import { setEvent } from './api';

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

let newMousePosition;
let oldMousePosition;
let timeBetweenMoves;

/**
 * @description Function to filter the keys we want to obtain.
 *
 * @param {KeyboardEvent} event Event in the DOM to register.
 */
const filterKeyboard = (event) => {
   const specialKeys = [
      'Alt',
      'AltGraph',
      'ArrowDown',
      'ArrowLeft',
      'ArrowRight',
      'ArrowUp',
      'Backspace',
      'CapsLock',
      'Clear',
      'Control',
      'Delete',
      'End',
      'Enter',
      'Escape',
      'F1',
      'F10',
      'F11',
      'F12',
      'F2',
      'F3',
      'F4',
      'F5',
      'F6',
      'F7',
      'F8',
      'F9',
      'Home',
      'Insert',
      'NumLock',
      'PageDown',
      'PageUp',
      'Shift',
      'Tab',
   ];
   const specialLetterKeys = ['S', 's', 'C', 'c', 'V', 'v'];
   if (
      specialKeys.indexOf(event.key) !== -1 ||
      (specialLetterKeys.indexOf(event.key) !== -1 && event.ctrlKey === true)
   ) {
      setEvent(event);
   }
};

/**
 * @description Function to manage mouse movements.
 */
const saveMouseMove = () => {
   // * If there is a new movement and it is different from the previous one.
   if (newMousePosition !== undefined && newMousePosition !== oldMousePosition) {
      // The "mousemove" event is created.
      setEvent(newMousePosition, true);

      // If there is a previous movement
      if (oldMousePosition !== undefined)
         // * The time elapsed between the two is calculated
         timeBetweenMoves = newMousePosition.timeStamp - oldMousePosition.timeStamp;

      // If the time exceeds one second, the "mousewait" event is created.
      if (timeBetweenMoves >= 1000) setEvent(oldMousePosition, true, true, timeBetweenMoves);

      // The time is reset to zero
      timeBetweenMoves = 0;

      // The old movement is equal to the new movement
      oldMousePosition = newMousePosition;
   }
};

/**
 * @description Management function for events to be monitored.
 */
export const setEventHandlers = () => {
   document.body.addEventListener('click', (event) => saveLastMouseDown(event), false);
   document.body.addEventListener('wheel', (event) => setEvent(event), false);
   document.body.addEventListener('mousedown', (event) => setEvent(event), false);
   document.body.addEventListener('dragstart', (event) => setEvent(event), false);
   document.body.addEventListener('drop', (event) => setEvent(event), false);
   document.body.addEventListener('dragend', (event) => setEvent(event), false);
   document.body.addEventListener('keyup', (event) => filterKeyboard(event), false);

   document.body.addEventListener(
      'mousemove',
      (event) => {
         newMousePosition = event;
      },
      false
   );
   setInterval(() => saveMouseMove(), 500);
};
