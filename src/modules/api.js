import { DateTime, Duration } from 'luxon';
import { v4 as uuidv4 } from 'uuid';
import { mergeObjects } from './tools';

/**
 * @description Manages the session refresh and session id creation at the defined moment to make it.
 *
 * @returns {string} The session ID.
 */
const setSessionId = () => {
   let sessionId = localStorage.getItem('lom-sessionId');
   let sessionDate = Number(localStorage.getItem('lom-sessionDate'));
   const currentDate = DateTime.now().toMillis();
   const datesDuration = Duration.fromMillis(currentDate - sessionDate ?? currentDate);

   if (!sessionId) {
      sessionId = uuidv4();
      localStorage.setItem('lom-sessionId', sessionId);
   }

   if (!sessionDate) {
      sessionDate = currentDate;
      localStorage.setItem('lom-sessionDate', String(sessionDate));
   } else if (datesDuration.as('hours') >= 3) {
      localStorage.removeItem('lom-sessionId');
      localStorage.removeItem('lom-sessionDate');
      localStorage.removeItem('lom-sessionData');

      localStorage.removeItem('lom-pageChangeElementID');
      localStorage.removeItem('lom-previousLom');
      localStorage.removeItem('lom-previousPageName');

      setSession(true);
   }

   return sessionId;
};

/**
 * @description Creates the base information object for the session replay.
 *
 * @param {boolean} [isNewSession=false] Forces the creation of a new session.
 */
export const setSession = (isNewSession = false) => {
   const sessionId = setSessionId();
   const sessionData = JSON.parse(localStorage.getItem('lom-sessionData'));

   /**
    * @description Base session information.
    * @type {import("../../types/Session").Session}
    */
   const sessionObject = {
      loms: {},
      events: [],
      pageHeight: document.body.clientHeight,
      pageWidth: document.body.clientWidth,
      rootPath: '/',
      sessionId,
   };

   if (!sessionData || isNewSession)
      localStorage.setItem('lom-sessionData', JSON.stringify(sessionObject));
};

/**
 * @description Adds an event to session data.
 *
 * @param {object} [event] Event to add to session data.
 */
const registerEvent = (event) => {
   const sessionData = JSON.parse(localStorage.getItem('lom-sessionData'));
   sessionData.events.push(event);
   localStorage.setItem('lom-sessionData', JSON.stringify(sessionData));
};

/**
 * @description Event record creation function.
 *
 * @param {(Event | MouseEvent | DragEvent | KeyboardEvent | WheelEvent)} event Event in the DOM to register.
 * @param {boolean} [mousemove=false] True if it's a mouse movement.
 * @param {boolean} [mousewait=false] True if it's a mouse wait.
 * @param {number} [timeBetweenMoves=0] Waiting time between mouse movements.
 * @returns {(Promise<Record<string, unknown>>|null)}
 */
export const setEvent = (event, mousemove = false, mousewait = false, timeBetweenMoves = 0) => {
   let targetRect;
   let targetElement;

   // * Information on the position of the element.
   if (event.target.nodeName === '#text') {
      targetRect = event.target.parentElement.getBoundingClientRect();
      targetElement = event.target.parentElement;
   } else {
      targetRect = event.target.getBoundingClientRect();
      targetElement = event.target;
   }

   // * Information on body position.
   const bodyRect = document.body.getBoundingClientRect();

   const eventInfo = {
      type: event.type,
      timeStamp: event.timeStamp,
      isTrusted: event.isTrusted,

      altKey: event.altKey,
      ctrlKey: event.ctrlKey,
      shiftKey: event.shiftKey,
      metaKey: event.metaKey,

      viewport: {
         x: bodyRect.x,
         y: bodyRect.y,
         width: bodyRect.width,
         height: bodyRect.height,
      },

      targetElement: {
         dataUx: targetElement.dataset.ux || 'NO DATA-UX',
         height: targetElement.clientHeight,
         nodeName: targetElement.nodeName,
         rectPos: {
            bottom: targetRect.bottom,
            height: targetRect.height,
            left: targetRect.left,
            right: targetRect.right,
            top: targetRect.top,
            width: targetRect.width,
            x: targetRect.x,
            y: targetRect.y,
         },
         title: event.target.title,
         width: event.target.clientWidth,
      },
   };

   // * If the event is of the "mousemove" type.
   if (mousemove) {
      const mousemoveInfo = {
         pageX: event.pageX,
         pageY: event.pageY,
         mouseButton: event.button,
         mouseButtons: event.buttons,
         timeBetweenMoves,
         interactionType: 'exploration',
      };

      // * If the event is of type "mousewait", the type in the object changes.
      if (mousewait) eventInfo.type = 'mousewait';

      registerEvent(mergeObjects(eventInfo, mousemoveInfo));
   }

   // * If the event is of the "mousedown" type (click).
   else if (event.type === 'mousedown') {
      const mousedownInfo = {
         pageX: event.pageX,
         pageY: event.pageY,
         mouseButton: event.button,
         mouseButtons: event.buttons,
         interactionType: 'action',
      };
      registerEvent(mergeObjects(eventInfo, mousedownInfo));
   }

   // * If the event is of the "drag and drop" type.
   else if (event.type === 'dragstart' || event.type === 'dragend' || event.type === 'drop') {
      // * Basic information on the event.
      const mousedownInfo = {
         pageX: event.pageX,
         pageY: event.pageY,
         mouseButton: event.button,
         mouseButtons: event.buttons,
         interactionType: 'action',
      };
      registerEvent(mergeObjects(eventInfo, mousedownInfo));
   }

   // * If the event is of type "keyup".
   else if (event.type === 'keyup') {
      const keyupInfo = {
         key: event.key,
         code: event.code,
         interactionType: 'action',
      };
      registerEvent(mergeObjects(eventInfo, keyupInfo));
   }

   // * If the event is of the "wheel" (scroll) type.
   else if (event.type === 'wheel') {
      const wheelInfo = {
         pageX: event.pageX,
         pageY: event.pageY,
         mouseButton: event.button,
         mouseButtons: event.buttons,
         deltaMode: event.deltaMode,
         deltaX: event.deltaX,
         deltaY: event.deltaY,
         deltaZ: event.deltaZ,
         layerX: event.layerX,
         layerY: event.layerY,
         wheelDelta: event.wheelDelta,
         wheelDeltaX: event.wheelDeltaX,
         wheelDeltaY: event.wheelDeltaY,
         interactionType: 'exploration',
      };
      registerEvent(mergeObjects(eventInfo, wheelInfo));
   }
};
