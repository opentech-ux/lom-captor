import { Zone } from './Zone';
import { TimeStamped } from './TimeStamped';
import { Serializable } from './Serializable';
import { LOM as LomJson } from '../../build/json-schema/sessionCapture.schema';

/** Representation of the wireframe layout of a Web page. */
export class LOM implements TimeStamped<LOM>, Serializable<LomJson> {
    /** Instant of this LOM capture. */
    public readonly timeStamp: number;

    /** Global page width. */
    public readonly pageWidth: number;

    /** Global page height. */
    public readonly pageHeight: number;

    /** Page title to help identify the LOM. */
    public readonly title?: string;

    /** Page URL to help identify the LOM. */
    public readonly url?: string;

    /** Root zone corresponding to the HTML body element. */
    public readonly root: Zone;

    private constructor(
        pageWidth: number,
        pageHeight: number,
        title: string | undefined,
        url: string | undefined,
        root: Zone,
        timeStamp = Date.now()
    ) {
        this.timeStamp = timeStamp;
        this.pageWidth = pageWidth;
        this.pageHeight = pageHeight;
        this.title = title || undefined;
        this.url = url || undefined;
        this.root = root;
    }

    /** Capture the LOM corresponding to the current DOM. */
    public static capture(): LOM {
        return new LOM(
            document.body.clientWidth,
            document.body.clientHeight,
            document.title,
            document.location.href,
            Zone.capture(document.body)
        );
    }

    /** Return a copy of this LOM with the timestamp relativized to specified time origin. */
    public relativizeTime(t0: number): LOM {
        return new LOM(this.pageWidth, this.pageHeight, this.title, this.url, this.root, this.timeStamp - t0);
    }

    /** Check if this LOM is similar in shape with other LOM, with a specified tolerance. */
    public isSimilar(other: LOM, tolerance = 0): boolean {
        return (
            Math.abs(other.pageWidth - this.pageWidth) <= tolerance &&
            Math.abs(other.pageHeight - this.pageHeight) <= tolerance &&
            this.root.isSimilar(other.root, tolerance)
        );
    }

    public toJSON(): LomJson {
        return {
            ts: this.timeStamp,
            w: this.pageWidth,
            h: this.pageHeight,
            t: this.title,
            u: this.url,
            r: this.root.toJSON(),
        };
    }
}
