import { TimeStamped } from './TimeStamped';
import { Serializable } from './Serializable';

const SHORT_TYPES: { [key: string]: string } = {
    scroll: 'S',
    click: 'C',
    // TODO to be completed
};

/** Base class for captured events. */
export abstract class AbstractEvent<E extends AbstractEvent<E>> implements TimeStamped<E>, Serializable<string> {
    /** Instant of this event capture. */
    public readonly timeStamp: number;

    /** Type of this event. */
    public readonly type: string;

    protected constructor(timeStamp: number, type: string) {
        this.timeStamp = timeStamp;
        this.type = type;
    }

    /** Return a copy of this event with the timestamp relativized to specified time origin. */
    // eslint-disable-next-line no-unused-vars
    abstract relativizeTime(t0: number): E;

    private get shortType() {
        return SHORT_TYPES[this.type] ?? this.type;
    }

    public toJSON(): string {
        return `${this.timeStamp}:${this.shortType}`;
    }
}
