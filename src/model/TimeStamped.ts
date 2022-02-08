/* eslint-disable no-unused-vars */
/** Base class for object registering their capture instant. */
export interface TimeStamped<Self extends TimeStamped<Self>> {
    /** Instant of this object capture, expressed as the number of milliseconds since 1970-01-01 00:00:00 UTC. */
    readonly timeStamp: number;

    /** Return a copy of this object with the timestamp relativized to specified time origin. */
    relativizeTime(t0: number): Self;
}
