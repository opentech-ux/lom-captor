import { setSession } from './api';
import setEventHandlers from './events';
import { identifyElements, uxkeyConsole } from './tools';

const initScript = () => {
   identifyElements(document.body);
   setSession();
   setEventHandlers();
   uxkeyConsole.ready('UX-Key is ready');
};

export default initScript;
