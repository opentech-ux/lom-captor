import consola, { LogLevel } from 'consola';
import { fromDataset, Settings } from './Settings';
import { Session } from './Session';

const scriptSettings = document.currentScript.dataset;

/** Start capturing UX session. */
async function startCapture(settings: Settings) {
    if (settings.devMode) consola.level = LogLevel.Debug;
    await new Session(settings).startCapture();
}

/**
 * Manually start capturing UX session.
 * @param config configuration of the capture.
 */
export function start(config: Settings) {
    if (document.readyState === 'complete') {
        startCapture(config);
    } else {
        document.onreadystatechange = async () => {
            if (document.readyState === 'complete') {
                await startCapture(config);
            }
        };
    }
}

document.onreadystatechange = async () => {
    if (document.readyState === 'complete' && scriptSettings.endpoint) {
        await startCapture(fromDataset(scriptSettings));
    }
};
