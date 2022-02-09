import { TimeStamped } from './TimeStamped';
import { LOM } from './LOM';
import { ActionEvent } from './ActionEvent';
import { ExplorationEvent } from './ExplorationEvent';
import { Serializable } from './Serializable';
import { SessionCapture as SessionChunkJson } from '../../build/json-schema/sessionCapture.schema';

/** A chunk of captured session with LOMs, exploration events and action events. */
export class SessionChunk implements TimeStamped<SessionChunk>, Serializable<SessionChunkJson> {
    /** Start time of thin session chunk. */
    public readonly timeStamp: number;

    /** Unique id identifying the current session. */
    public readonly sessionId: string;

    /** Unique id identifying anonymously the current user. */
    public readonly userId?: string;

    /** List of LOMs captured in this session chunk. */
    public readonly loms: LOM[] = [];

    /** List of exploration events captured in this session chunk. */
    public readonly explorationEvents: ExplorationEvent[] = [];

    /** List of action events captured in this session chunk. */
    public readonly actionEvents: ActionEvent[] = [];

    constructor(sessionId: string, userId?: string, timeStamp = Date.now()) {
        this.timeStamp = timeStamp;
        this.sessionId = sessionId;
        this.userId = userId;
    }

    /** Test if this session chunk contains any data to send. */
    public hasContent(): boolean {
        return this.loms.length > 0 || this.explorationEvents.length > 0 || this.actionEvents.length > 0;
    }

    /** Return a copy of this SessionChunk with the timestamp relativized to specified time origin. */
    public relativizeTime(t0: number): SessionChunk {
        const result = new SessionChunk(this.sessionId, this.userId, this.timeStamp - t0);
        result.loms.push(...this.loms.map((lom) => lom.relativizeTime(t0)));
        result.explorationEvents.push(...this.explorationEvents.map((e) => e.relativizeTime(t0)));
        result.actionEvents.push(...this.actionEvents.map((e) => e.relativizeTime(t0)));
        return result;
    }

    public toJSON(): SessionChunkJson {
        const t0 = this.timeStamp;
        const result: SessionChunkJson = { ts: t0, sid: this.sessionId, uid: this.userId };

        function toJsonArrayIfNotEmpty<S, T extends TimeStamped<T> & Serializable<S>>(array?: T[]): S[] | undefined {
            return array.length ? array.map((e) => e.relativizeTime(t0).toJSON()) : undefined;
        }

        result.loms = toJsonArrayIfNotEmpty(this.loms);
        result.ee = toJsonArrayIfNotEmpty(this.explorationEvents);
        result.ae = toJsonArrayIfNotEmpty(this.actionEvents);

        return result;
    }
}
