import consola, { LogLevel } from 'consola';
import { fromDataset, Settings } from './Settings';
import { Session } from './Session';

const scriptSettings = document.currentScript.dataset;

/** Start capturing UX session. */
export async function startCapture(settings: Settings) {
    if (settings.devMode) consola.level = LogLevel.Debug;
    await new Session(settings).startCapture();
}


/**
 * @description Function to manually start the monitoring.
 * @param {import('../types/ScriptConfiguration').ScriptConfiguration} config Configuration for the script init.
 */
 export const start = (scriptSettings: DOMStringMap) => {
    if (document.readyState === 'complete'){
        startCapture(fromDataset(scriptSettings));
    }else{
        document.onreadystatechange = async () => {
            if (document.readyState === 'complete') {
                await startCapture(fromDataset(scriptSettings));
            }
        };
    }

     
 }

document.onreadystatechange = async () => {
    if (document.readyState === 'complete' && scriptSettings.endpoint) {
        await startCapture(fromDataset(scriptSettings));
    }
};
