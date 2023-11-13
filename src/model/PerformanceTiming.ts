import { PerformanceTiming as PerformanceTimingChunkJson } from '../../build/json-schema/sessionCapture.schema';
import { Serializable } from './Serializable';
import { TimeStamped } from './TimeStamped';

/** Measure the loading time of a page. */
export class PerformanceTiming implements TimeStamped<PerformanceTiming>, Serializable<PerformanceTimingChunkJson> {
    /** Start time of this performance timing chunk. */
    public readonly timeStamp: number;

    /** Timestamp when the page starts loading. */
    public readonly originTs: number;

    /** Timestamp where the page is usable but external resources are not loaded. */
    public readonly interactiveTs: number;

    /** Timestamp where the page and all its resources are completely loaded. */
    public readonly completeTs: number;

    /** Timestamp of the event that triggered the page change. */
    public readonly eventTs: number;

    /** Elapsed time in seconds to load the page without external files. */
    public readonly interactiveLoadingTime: number;

    /** Elapsed time in seconds to load the page with all external files already loaded. */
    public readonly completeLoadingTime: number;

    /** Id of the lom where the triggering event was produced. */
    public readonly lomIdOrigin: string;

    /** Id of the lom where the loading time is analyzed. */
    public readonly lomIdEnd: string;

    /** Id of the lom where the loading time is analyzed. */
    public readonly resource: [];

    constructor(
        originTs?: number,
        interactiveTs?: number,
        completeTs?: number,
        eventTs?: number,
        interactiveLoadingTime?: number,
        completeLoadingTime?: number,
        lomIdOrigin?: string,
        lomIdEnd?: string,
        timeStamp = Date.now()
    ) {
        this.originTs = originTs;
        this.interactiveTs = interactiveTs;
        this.completeTs = completeTs;
        this.eventTs = eventTs;
        this.interactiveLoadingTime = interactiveLoadingTime;
        this.completeLoadingTime = completeLoadingTime;
        this.lomIdOrigin = lomIdOrigin;
        this.lomIdEnd = lomIdEnd;
        this.timeStamp = timeStamp;
    }

    /** Return a copy of this PerformanceTiming with the timestamp relativized to specified time origin. */
    public relativizeTime(t0: number): PerformanceTiming {
        return new PerformanceTiming(
            this.originTs,
            this.interactiveTs,
            this.completeTs,
            this.eventTs,
            this.interactiveLoadingTime,
            this.completeLoadingTime,
            this.lomIdOrigin,
            this.lomIdEnd,
            this.timeStamp - t0
        );
    }

    public toJSON(): PerformanceTimingChunkJson {
        const result: PerformanceTimingChunkJson = {
            ts: this.timeStamp,
            ots: this.originTs,
            its: this.interactiveTs,
            cts: this.completeTs,
            ets: this.eventTs,
            ilt: this.interactiveLoadingTime,
            clt: this.completeLoadingTime,
            lo: this.lomIdOrigin,
            le: this.lomIdEnd,
        };

        return result;
    }
}
