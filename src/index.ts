import consola, { LogLevel } from 'consola';
import { fromDataset, Settings } from './Settings';
import { Session } from './Session';

const scriptSettings = document.currentScript.dataset;

/** Start capturing UX session. */
export async function startCapture(settings: Settings) {
    if (settings.devMode) consola.level = LogLevel.Debug;
    await new Session(settings).startCapture();
}

document.onreadystatechange = async () => {
    if (document.readyState === 'complete' && scriptSettings.endpoint) {
        await startCapture(fromDataset(scriptSettings));
    }
};
