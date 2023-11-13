import { PerformanceResourceTiming as PerformanceResourceTimingChunkJson } from '../../build/json-schema/sessionCapture.schema';
import { Serializable } from './Serializable';
import { TimeStamped } from './TimeStamped';

/** Measures the loading time of external resources of the pages. */
export class PerformanceResourceTiming
    implements TimeStamped<PerformanceResourceTiming>, Serializable<PerformanceResourceTimingChunkJson>
{
    /** Start time of this performance ressource timing. */
    public readonly timeStamp: number;

    /** Name for the performance entry. */
    public readonly name: string;

    /** First timestamp recorded for the performance entry. */
    public readonly startTime: number;

    /** Timestamp after the browser receives the last byte of the resource. */
    public readonly responseEnd: number;

    /** Type of performance metric that this entry represents. */
    public readonly entryType: string;

    /** Duration of the performance entry. */
    public readonly duration: number;

    constructor(
        name?: string,
        startTime?: number,
        responseEnd?: number,
        entryType?: string,
        duration?: number,
        timeStamp = Date.now()
    ) {
        this.name = name;
        this.startTime = startTime;
        this.responseEnd = responseEnd;
        this.entryType = entryType;
        this.duration = duration;
        this.timeStamp = timeStamp;
    }

    /** Return a copy of this PerformanceResourceTiming with the timestamp relativized to specified time origin. */
    public relativizeTime(t0: number): PerformanceResourceTiming {
        return new PerformanceResourceTiming(
            this.name,
            this.startTime,
            this.responseEnd,
            this.entryType,
            this.duration,
            this.timeStamp - t0
        );
    }

    public toJSON(): PerformanceResourceTimingChunkJson {
        const result: PerformanceResourceTimingChunkJson = {
            ts: this.timeStamp,
            n: this.name,
            st: this.startTime,
            re: this.responseEnd,
            et: this.entryType,
            d: this.duration,
        };

        return result;
    }
}
