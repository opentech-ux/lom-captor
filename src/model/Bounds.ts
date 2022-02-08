import { Serializable } from './Serializable';

export type BoundsJson = [number, number, number, number];

/** An axis aligned rectangle defining bounds of a graphical element on screen. */
export class Bounds implements Serializable<BoundsJson> {
    /** X coordinates of the upper-left corner of the rectangle. */
    public readonly x: number;

    /** Y coordinates of the upper-left corner of the rectangle. */
    public readonly y: number;

    /** Width of the rectangle. */
    public readonly width: number;

    /** Height of the rectangle. */
    public readonly height: number;

    /**
     * Creates a new Bounds.
     *
     * @param x x coordinates of the upper-left corner of the rectangle
     * @param y y coordinates of the upper-left corner of the rectangle
     * @param width width of the rectangle
     * @param height height of the rectangle
     */
    public constructor(x: number, y: number, width: number, height: number) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    /** Check if this bounds is coincident with other Bounds with given tolerance. */
    public isCoincident(other: Bounds, tolerance = 0): boolean {
        return (
            Math.abs(other.x - this.x) <= tolerance &&
            Math.abs(other.y - this.x) <= tolerance &&
            Math.abs(other.width - this.width) <= tolerance &&
            Math.abs(other.height - this.height) <= tolerance
        );
    }

    /** Returns a new Bounds with x and y coordinates translated by (dx, dy). */
    public translated(dx: number, dy: number): Bounds {
        return new Bounds(this.x + dx, this.y + dy, this.width, this.height);
    }

    /** Check if this bounds is empty. */
    public isEmpty(): boolean {
        return this.width === 0 || this.height === 0;
    }

    public toJSON(): BoundsJson {
        return [Math.round(this.x), Math.round(this.y), Math.round(this.width), Math.round(this.height)];
    }
}
