import { TimeStamped } from './TimeStamped';
import { Serializable } from './Serializable';
import { LomRef as LomRefJson } from '../../build/json-schema/sessionCapture.schema';
import { Lom } from './Lom';

/** Timestamped reference to a previously captured LOM. */
export class LomRef implements TimeStamped<LomRef>, Serializable<LomRefJson> {
    /** Instant of this LOM capture. */
    public readonly timeStamp: number;

    /** ID of referenced LOM. */
    public readonly referencedLom: Lom;

    /** Creates a new LOM reference with given referenced ID and timestamp */
    public constructor(referencedLom: Lom, timeStamp: number) {
        this.timeStamp = timeStamp;
        this.referencedLom = referencedLom;
    }

    /** Return a copy of this LOM with the timestamp relativized to specified time origin. */
    public relativizeTime(t0: number): LomRef {
        return new LomRef(this.referencedLom, this.timeStamp - t0);
    }

    public toJSON(): LomRefJson {
        return { ts: this.timeStamp, ref: this.referencedLom.id };
    }
}
