import { v4 as UUID } from 'uuid';
import consola from 'consola';
import { detectAnyAdblocker } from 'just-detect-adblock';
import { SessionChunk } from './model/SessionChunk';
import { ResolvedSettings, Settings, withDefaults } from './Settings';
import { Lom } from './model/Lom';
import { Point } from './model/Point';
import { ExplorationEvent } from './model/ExplorationEvent';
import { LomRef } from './model/LomRef';
import { ActionEvent } from './model/ActionEvent';
import { LIB_VERSION } from '../build/version';
import { NavigationTiming } from './model/NavigationTiming';

function getOrCreateSessionId(): string {
    let sessionId = sessionStorage.getItem('opentech-ux-sessionId');
    if (!sessionId) {
        sessionId = UUID();
        sessionStorage.setItem('opentech-ux-sessionId', sessionId);
    }
    return sessionId;
}

function getOrCreateUserId(): string {
    let userId = localStorage.getItem('opentech-ux-userId');
    if (!userId) {
        userId = UUID();
        localStorage.setItem('opentech-ux-userId', userId);
    }
    return userId;
}

function getScrollPosition(): Point {
    const bodyRect = document.body.getBoundingClientRect();
    return { x: bodyRect.x, y: bodyRect.y };
}

function getZoneId(element: HTMLElement): string | undefined {
    if (element.dataset.opentechUxZoneId) return element.dataset.opentechUxZoneId;
    if (element.parentElement) return getZoneId(element.parentElement);
    return undefined;
}

/** Build a mask containing keyboard modifiers */
function getEventModifiers(event: MouseEvent): number {
    let result = 0;

    if (event.getModifierState('Shift')) {
        result += 1;
    }

    if (event.getModifierState('Control')) {
        result += 2;
    }

    if (
        event.getModifierState('Fn') ||
        event.getModifierState('Hyper') ||
        event.getModifierState('OS') ||
        event.getModifierState('Super') ||
        event.getModifierState('Win') /* hack for IE */
    ) {
        result += 4;
    }

    return result;
}

function distSquared(x1: number, y1: number, x2: number, y2: number): number {
    return (x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1);
}

function pointDistSquared(p1: Point, p2: Point): number {
    return distSquared(p1.x, p1.y, p2.x, p2.y);
}

/** Common configuration of the fetch function. */
// eslint-disable-next-line no-undef
const commonPostConfig: RequestInit = {
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
        'Content-Type': 'application/json; charset=utf-8',
        Accept: 'application/json',
    },
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
};

/** A session with LOMs, exploration events and action events. */
export class Session {
    private readonly settings: ResolvedSettings;

    public readonly sessionId: string;

    public readonly userId?: string;

    private readonly eventTimestampOffset: number;

    private currentChunk: SessionChunk;

    private lastLom?: Lom;

    private lastMousePosition?: Point;

    private currentMouseEvent?: MouseEvent;

    private trackDomChanges = true;

    private hasAdblock = false;

    private readonly lomCache: { [k: string]: Lom } = {};

    constructor(settings: Settings) {
        this.settings = withDefaults(settings);
        this.sessionId = getOrCreateSessionId();
        this.userId = this.settings.trackUser ? getOrCreateUserId() : undefined;
        this.eventTimestampOffset = Date.now() - document.timeline.currentTime;
        this.resetSessionChunk();
    }

    private resetSessionChunk() {
        this.currentChunk = new SessionChunk(this);
    }

    private httpPost(payload: string) {
        fetch(this.settings.endpoint, { ...commonPostConfig, method: 'POST', body: payload }).then(() => {
            if (this.settings.devMode) consola.debug('UX data posted with success');
        });
    }

    private httpPostSync(payload: string) {
        this.httpPost(payload);
        // No-OP loop to wait for request sending
        let n = 0;
        // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
        for (let i = 0; i < 10000; i += 1) n += 1;
    }

    /** Send data collected so far and reset current session chunk for upcoming data. */
    public flush(async = true) {
        if (this.currentChunk.hasContent()) {
            const payload = JSON.stringify(this.currentChunk);
            if (this.hasAdblock || !navigator.sendBeacon(this.settings.endpoint, payload)) {
                if (async) this.httpPost(payload);
                else this.httpPostSync(payload);
            }
            this.resetSessionChunk();
        }
    }

    private registerLom(lom: Lom): Lom | LomRef {
        if (this.lomCache[lom.id]) return new LomRef(lom, lom.timeStamp);
        this.lomCache[lom.id] = lom;
        return lom;
    }

    /** Capture current LOM and register it in session if it differs significantly from last captured Lom. */
    public captureLOM() {
        this.trackDomChanges = false;
        const lom = Lom.capture(this.settings.captureLomContext);
        if (!this.lastLom || !lom.isSimilar(this.lastLom, this.settings.globalTolerance)) {
            this.lastLom = lom;
            const lomOrRef = this.registerLom(lom);
            this.currentChunk.loms.push(lomOrRef);
            if (this.settings.devMode) consola.debug(JSON.stringify(lomOrRef));
        }
        this.trackDomChanges = true;
    }

    /** Capture a mouse click event */
    public saveClickEvent(event: MouseEvent) {
        const mousePosition = { x: event.pageX, y: event.pageY };

        const actionEvent = new ActionEvent(
            Math.round(event.timeStamp + this.eventTimestampOffset),
            'C',
            getZoneId(event.target as HTMLElement),
            getEventModifiers(event),
            mousePosition
        );

        this.currentChunk.actionEvents.push(actionEvent);
        if (this.settings.devMode) consola.debug(JSON.stringify(actionEvent));
    }

    /** Capture mouse moves and register it in session if mouse position differs significantly from last capture. */
    public saveMouseMoveEvent() {
        if (!this.currentMouseEvent) return;

        const newMousePosition = { x: this.currentMouseEvent.pageX, y: this.currentMouseEvent.pageY };
        // Don't track moves < 10px
        if (this.lastMousePosition && pointDistSquared(this.lastMousePosition, newMousePosition) < 100) return;

        this.lastMousePosition = newMousePosition;
        const explorationEvent = new ExplorationEvent(
            Math.round(this.currentMouseEvent.timeStamp + this.eventTimestampOffset),
            this.currentMouseEvent.type,
            getScrollPosition(),
            newMousePosition
        );

        this.currentChunk.explorationEvents.push(explorationEvent);
        if (this.settings.devMode) consola.debug(JSON.stringify(explorationEvent));
    }

    /** Capture focus change event. */
    public saveFocusEvent(event: FocusEvent) {
        const explorationEvent = new ExplorationEvent(
            Math.round(event.timeStamp + this.eventTimestampOffset),
            event.type,
            getScrollPosition(),
            undefined,
            getZoneId(event.target as HTMLElement)
        );

        this.currentChunk.explorationEvents.push(explorationEvent);
        if (this.settings.devMode) consola.debug(JSON.stringify(explorationEvent));
    }

    private setupDomChangeTracking() {
        const domObsConfig = {
            attributes: true,
            childList: true,
            subtree: true,
            attributeFilter: ['style', 'class'],
            attributeOldValue: true,
        };
        const domObserver = new MutationObserver((event) => {
            consola.debug(event);
            // Max one LOM change per second
            if (this.trackDomChanges && this.lastLom.timeStamp < Date.now() - 1000) this.captureLOM();
        });
        domObserver.observe(document.body, domObsConfig);
    }

    private setupExplorationEventListeners() {
        const saveMouseEvent = (event: MouseEvent) => {
            this.currentMouseEvent = event;
        };

        document.body.addEventListener('wheel', saveMouseEvent, false);
        document.body.addEventListener('mousemove', saveMouseEvent, false);
        setInterval(() => this.saveMouseMoveEvent(), 500);

        document.body.addEventListener('focusin', (event) => this.saveFocusEvent(event), false);
    }

    private setupActionEventListeners() {
        document.body.addEventListener(
            'click',
            (event) => {
                sessionStorage.setItem(
                    'triggerOrigin',
                    JSON.stringify({ eventTs: new Date().getTime(), fromLomId: this.lastLom.id })
                );
                this.saveClickEvent(event);
            },
            false
        );

        // document.body.addEventListener('mousedown', (event) => setEvent(event), false);
        // document.body.addEventListener('dragstart', (event) => setEvent(event), false);
        // document.body.addEventListener('drop', (event) => setEvent(event), false);
        // document.body.addEventListener('dragend', (event) => setEvent(event), false);
        // document.body.addEventListener('keyup', (event) => filterKeyboard(event), false);
    }

    private async captureNavigationTiming() {
        function getTime(time: number | undefined | null): number {
            try {
                return typeof time !== 'number' ? 0 : time;
            } catch {
                return 0;
            }
        }

        try {
            const originTs: number = getTime(performance.timeOrigin);
            const interactiveTs: number =
                originTs + getTime((performance?.getEntriesByType('navigation')[0] as any)?.domInteractive);
            const completeTs: number =
                originTs + getTime((performance?.getEntriesByType('navigation')[0] as any)?.domComplete);
            const { eventTs, fromLomId } = JSON.parse(sessionStorage.getItem('triggerOrigin')) || {
                eventTs: 0,
                fromLomId: null,
            };
            const startTs: number =
                eventTs === 0 || (performance?.getEntriesByType('navigation')[0] as any)?.type === 'reload'
                    ? originTs
                    : eventTs;
            const interactiveLoadingTimeMs = (interactiveTs - startTs) / 1000;
            const completeLoadingTimeMs = (completeTs - startTs) / 1000;

            this.currentChunk.navigationTimings.push(
                new NavigationTiming(
                    originTs,
                    interactiveTs,
                    completeTs,
                    eventTs,
                    interactiveLoadingTimeMs,
                    completeLoadingTimeMs,
                    fromLomId,
                    this.lastLom.id
                )
            );
            // eslint-disable-next-line no-empty
        } catch {}
    }

    /** Start capture of UX session. */
    public async startCapture() {
        if (this.settings.devMode) consola.start(`Setting up OpenTech UX lib v${LIB_VERSION}`);

        detectAnyAdblocker().then((hasAdblock: boolean) => {
            this.hasAdblock = hasAdblock;
        });

        // Add listener to send buffered data on page exit
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'hidden') this.flush(false);
        });

        // Capture initial LOM
        this.captureLOM();

        // Capture the loading time of a page
        this.captureNavigationTiming();
        // this.captureResourceTiming();

        // Register event listeners
        this.setupDomChangeTracking();
        this.setupExplorationEventListeners();
        this.setupActionEventListeners();

        // Flush UX data buffer every Settings.bufferTimeoutMs.
        setInterval(() => {
            this.flush();
        }, this.settings.bufferTimeoutMs);

        consola.ready(`OpenTech UX lib v${LIB_VERSION} is running`);
    }
}
