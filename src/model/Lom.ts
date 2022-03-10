import { sha256 } from 'js-sha256';
import { TimeStamped } from './TimeStamped';
import { Serializable } from './Serializable';
import { Lom as LomJson } from '../../build/json-schema/sessionCapture.schema';
import { LomContent } from './LomContent';

/** Representation of the wireframe layout of a Web page. */
export class Lom implements TimeStamped<Lom>, Serializable<LomJson> {
    /** Instant of this LOM capture. */
    public readonly timeStamp: number;

    /** Page title to help identify the LOM. */
    public readonly title?: string;

    /** Page URL to help identify the LOM. */
    public readonly url?: string;

    /** Global page width. */
    public readonly content: LomContent;

    /** Unique id of this LOM. */
    public readonly id: string;

    private constructor(
        title: string | undefined,
        url: string | undefined,
        content: LomContent,
        timeStamp = Date.now()
    ) {
        this.timeStamp = timeStamp;
        this.title = title || undefined;
        this.url = url || undefined;
        this.content = content;
        this.id = sha256.update(JSON.stringify(content)).hex();
    }

    /** Capture the LOM corresponding to the current DOM. */
    public static capture(): Lom {
        return new Lom(document.title, document.location.href, LomContent.capture());
    }

    /** Return a copy of this LOM with the timestamp relativized to specified time origin. */
    public relativizeTime(t0: number): Lom {
        return new Lom(this.title, this.url, this.content, this.timeStamp - t0);
    }

    /** Check if this LOM is similar in shape with other LOM, with a specified tolerance. */
    public isSimilar(other: Lom, tolerance = 0): boolean {
        return this.content.isSimilar(other.content, tolerance);
    }

    public toJSON(): LomJson {
        const result: LomJson = {
            id: this.id,
            ts: this.timeStamp,
            ...this.content.toJSON(),
        };
        if (this.url !== undefined) result.u = this.url;
        if (this.title !== undefined) result.t = this.title;
        return result;
    }
}
