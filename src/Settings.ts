/** Settings for capture lib. */
export interface Settings {
    /** Custom attribute to add to captured data. */
    readonly endpoint: string;

    /** Boolean indicating if the lib should track user across sessions. Defaults to `false`. */
    readonly trackUser?: boolean;

    /** Timeout for buffer send. Defaults to 10 seconds. */
    readonly bufferTimeoutMs?: number;

    /** Tolerance for LOM comparison. Defaults to 20 pixels. */
    readonly globalTolerance?: number;

    /** Boolean indicating if the lib operates in dev mode (with more verbose logs). Defaults to `false`. */
    readonly devMode?: boolean;
}

/** Resolved settings for capture lib. */
export type ResolvedSettings = Required<Settings>;

function removeUndefinedProperties<E>(object: E): E {
    const result = object as unknown as { [k: string]: unknown };
    Object.keys(result)
        .filter((k) => result[k] === undefined)
        .forEach((k) => delete result[k]);
    return result as unknown as E;
}

/** Complete given settings with default values. */
export function withDefaults(settings: Settings): ResolvedSettings {
    return {
        trackUser: false,
        bufferTimeoutMs: 10000,
        globalTolerance: 20,
        devMode: false,
        ...removeUndefinedProperties(settings),
    };
}

function tryToNumber(input: string): number | undefined {
    const result = Number(input);
    return Number.isFinite(result) ? result : undefined;
}

/** Extract settings from DOM dataset. */
export function fromDataset(dataset: DOMStringMap): Settings {
    return {
        endpoint: dataset.endpoint,
        trackUser: Boolean(dataset.trackUser) ?? undefined,
        bufferTimeoutMs: tryToNumber(dataset.bufferTimeoutMs),
        globalTolerance: tryToNumber(dataset.globalTolerance),
        devMode: Boolean(dataset.devMode) ?? undefined,
    };
}
