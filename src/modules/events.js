import { setEvent } from './api';

let newMousePosition;
let oldMousePosition;
let timeBetweenMoves;

/**
 * @description Function to filter the keys we want to obtain.
 *
 * @param {KeyboardEvent} event Event in the DOM to register.
 * @param {import('../../types/SessionRequestInfo').SessionRequestInfo} sessionInfo Session information obtained or created previously.
 * @param {string} visitorId ID obtained from the current visitor.
 * @param {import('../../types/PageInfo').PageInfo} pageInfo Page information obtained or created previously.
 */
const filterKeyboard = (event, sessionInfo, visitorId, pageInfo) => {
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
   )
      setEvent(event, sessionInfo, visitorId, pageInfo);
};

/**
 * @description Function to manage mouse movements.
 *
 * @param {string} visitorId ID obtained from the current visitor.
 * @param {import('../../types/PageInfo').PageInfo} pageInfo Page information obtained or created previously.
 */
const saveMouseMove = (visitorId, pageInfo) => {
   // * If there is a new movement and it is different from the previous one.
   if (newMousePosition !== undefined && newMousePosition !== oldMousePosition) {
      // * The "mousemove" event is created.
      setEvent(newMousePosition, null, visitorId, pageInfo, true);
      // * If there is a previous movement
      if (oldMousePosition !== undefined)
         // * The time elapsed between the two is calculated
         timeBetweenMoves = newMousePosition.timeStamp - oldMousePosition.timeStamp;
      // * If the time exceeds one second, the "mousewait" event is created.
      if (timeBetweenMoves >= 1000)
         setEvent(oldMousePosition, null, visitorId, pageInfo, true, true, timeBetweenMoves);
      // * The time is reset to zero
      timeBetweenMoves = 0;
      // * The old movement is equal to the new movement
      oldMousePosition = newMousePosition;
   }
};

/**
 * @description Management function for events to be monitored.
 *
 * @param {import('../../types/SessionRequestInfo').SessionRequestInfo} sessionInfo Session information obtained or created previously.
 * @param {string} visitorId ID obtained from the current visitor.
 * @param {import('../../types/PageInfo').PageInfo} pageInfo Page information obtained or created previously.
 */
const setEventHandlers = (sessionInfo, visitorId, pageInfo) => {
   document.body.addEventListener(
      'wheel',
      (event) => setEvent(event, sessionInfo, visitorId, pageInfo),
      false
   );
   document.body.addEventListener(
      'mousedown',
      (event) => setEvent(event, sessionInfo, visitorId, pageInfo),
      false
   );
   document.body.addEventListener(
      'dragstart',
      (event) => setEvent(event, sessionInfo, visitorId, pageInfo),
      false
   );
   document.body.addEventListener(
      'drop',
      (event) => setEvent(event, sessionInfo, visitorId, pageInfo),
      false
   );
   document.body.addEventListener(
      'dragend',
      (event) => setEvent(event, sessionInfo, visitorId, pageInfo),
      false
   );
   document.body.addEventListener(
      'keyup',
      (event) => filterKeyboard(event, sessionInfo, visitorId, pageInfo),
      false
   );
   document.body.addEventListener(
      'mousemove',
      (event) => {
         newMousePosition = event;
      },
      false
   );

   setInterval(() => saveMouseMove(visitorId, pageInfo), 500);
};

export default setEventHandlers;
