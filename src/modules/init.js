import { setSession } from './api';
import setEventHandlers, { setLoms } from './events';
import { identifyElements, uxkeyConsole } from './tools';

const initScript = () => {
   identifyElements(document.body);
   setSession();
   setLoms();
   setEventHandlers();
   uxkeyConsole.ready('UX-Key is ready');
};

export default initScript;
