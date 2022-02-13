import { v4 as UUID } from 'uuid';
import consola from 'consola';
import { detectAnyAdblocker } from 'just-detect-adblock';
import { SessionChunk } from './model/SessionChunk';
import { ResolvedSettings, Settings, withDefaults } from './Settings';
import { LOM } from './model/LOM';
import { Point } from './model/Point';
import { ExplorationEvent } from './model/ExplorationEvent';
import { ActionEvent } from './model/ActionEvent';

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

/** A chunk of captured session with LOMs, exploration events and action events. */
export class Session {
    private readonly settings: ResolvedSettings;

    private readonly sessionId: string;

    private readonly userId?: string;

    private currentChunk: SessionChunk;

    private lastLom?: LOM;

    private lastMousePosition?: Point;

    private currentMouseEvent?: MouseEvent;

    private trackDomChanges = true;

    private hasAdblock = false;

    constructor(settings: Settings) {
        this.settings = withDefaults(settings);
        this.sessionId = getOrCreateSessionId();
        this.userId = this.settings.trackUser ? getOrCreateUserId() : undefined;
        this.resetSessionChunk();
    }

    private resetSessionChunk() {
        this.currentChunk = new SessionChunk(this.sessionId, this.userId);
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
        // eslint-disable-next-line no-unused-vars
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

    /** Capture current LOM and register it in session if it differs significantly from last captured LOM. */
    public captureLOM() {
        this.trackDomChanges = false;
        const lom = LOM.capture();
        if (!this.lastLom || !lom.isSimilar(this.lastLom, this.settings.globalTolerance)) {
            this.lastLom = lom;
            this.currentChunk.loms.push(lom);
            if (this.settings.devMode) consola.debug(JSON.stringify(lom));
        }
        this.trackDomChanges = true;
    }

    /** Capture a mouse click event */
    public saveClickEvent(event){
        const mousePosition = { x: event.pageX, y: event.pageY };
    
        const actionEvent = new ActionEvent(
            event.timeStamp,
            'C',
            getZoneId(event.target as HTMLElement)
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
            this.currentMouseEvent.timeStamp,
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
            event.timeStamp,
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
        document.body.addEventListener('click', (event) => this.saveClickEvent(event), false);
        // document.body.addEventListener('mousedown', (event) => setEvent(event), false);
        // document.body.addEventListener('dragstart', (event) => setEvent(event), false);
        // document.body.addEventListener('drop', (event) => setEvent(event), false);
        // document.body.addEventListener('dragend', (event) => setEvent(event), false);
        // document.body.addEventListener('keyup', (event) => filterKeyboard(event), false);
    }

    /** Start capture of UX session. */
    public async startCapture() {
        if (this.settings.devMode) consola.start('Setting up OpenTech UX analysis');

        detectAnyAdblocker().then((hasAdblock: boolean) => {
            this.hasAdblock = hasAdblock;
        });

        // Add listener to send buffered data on page exit
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'hidden') this.flush(false);
        });

        // Capture initial LOM
        this.captureLOM();

        // Register event listeners
        this.setupDomChangeTracking();
        this.setupExplorationEventListeners();
        this.setupActionEventListeners();

        // Flush UX data buffer every Settings.bufferTimeoutMs.
        setInterval(() => this.flush(), this.settings.bufferTimeoutMs);

        if (this.settings.devMode) consola.ready('OpenTech UX analysis is running');
    }
}
