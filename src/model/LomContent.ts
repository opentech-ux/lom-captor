import { Zone } from './Zone';
import { Serializable } from './Serializable';

/** Representation of the wireframe layout of a Web page. */
export class LomContent implements Serializable {
    /** Global page width. */
    public readonly pageWidth: number;

    /** Global page height. */
    public readonly pageHeight: number;

    /** Root zone corresponding to the HTML body element. */
    public readonly root: Zone;

    private constructor(pageWidth: number, pageHeight: number, root: Zone) {
        this.pageWidth = pageWidth;
        this.pageHeight = pageHeight;
        this.root = root;
    }

    /** Capture the LOM content corresponding to the current DOM. */
    public static capture(): LomContent {
        return new LomContent(document.body.clientWidth, document.body.clientHeight, Zone.capture(document.body));
    }

    /** Check if this LOM is similar in shape with other LOM, with a specified tolerance. */
    public isSimilar(other: LomContent, tolerance = 0): boolean {
        return (
            Math.abs(other.pageWidth - this.pageWidth) <= tolerance &&
            Math.abs(other.pageHeight - this.pageHeight) <= tolerance &&
            this.root.isSimilar(other.root, tolerance)
        );
    }

    public toJSON() {
        return {
            w: this.pageWidth,
            h: this.pageHeight,
            r: this.root.toJSON(),
        };
    }
}
