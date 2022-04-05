import { TimeStamped } from './TimeStamped';
import { Lom } from './Lom';
import { ActionEvent } from './ActionEvent';
import { ExplorationEvent } from './ExplorationEvent';
import { Serializable } from './Serializable';
import { SessionCapture as SessionChunkJson } from '../../build/json-schema/sessionCapture.schema';
import { Session } from '../Session';
import { LomRef } from './LomRef';
import { LIB_VERSION } from '../../build/version';

/** A chunk of captured session with LOMs, exploration events and action events. */
export class SessionChunk implements TimeStamped<SessionChunk>, Serializable<SessionChunkJson> {
    /** Session this chunk is par of */
    private readonly session: Session;

    /** Start time of thin session chunk. */
    public readonly timeStamp: number;

    /** List of LOMs captured in this session chunk. */
    public readonly loms: (Lom | LomRef)[] = [];

    /** List of exploration events captured in this session chunk. */
    public readonly explorationEvents: ExplorationEvent[] = [];

    /** List of action events captured in this session chunk. */
    public readonly actionEvents: ActionEvent[] = [];

    constructor(session: Session, timeStamp = Date.now()) {
        this.timeStamp = timeStamp;
        this.session = session;
    }

    /** Test if this session chunk contains any data to send. */
    public hasContent(): boolean {
        return this.loms.length > 0 || this.explorationEvents.length > 0 || this.actionEvents.length > 0;
    }

    /** Return this as SessionChunks cannot be relativized. */
    public relativizeTime(): SessionChunk {
        return this;
    }

    public toJSON(): SessionChunkJson {
        const t0 = this.timeStamp;
        const result: SessionChunkJson = {
            lib_v: LIB_VERSION,
            ts: t0,
            sid: this.session.sessionId,
            uid: this.session.userId,
        };

        function toJsonArrayIfNotEmpty<S, T extends TimeStamped<T> & Serializable<S>>(array?: T[]): S[] | undefined {
            return array.length ? array.map((e) => e.relativizeTime(t0).toJSON()) : undefined;
        }

        result.loms = toJsonArrayIfNotEmpty(this.loms);
        result.ee = toJsonArrayIfNotEmpty(this.explorationEvents);
        result.ae = toJsonArrayIfNotEmpty(this.actionEvents);

        return result;
    }
}
