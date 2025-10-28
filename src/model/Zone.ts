import { Bounds } from './Bounds';
import { Serializable } from './Serializable';
import { Zone as ZoneJson } from '../../build/json-schema/sessionCapture.schema';

let zoneIdCounter = 0;
const nodeNameFilter = ['HEAD', 'SCRIPT', 'svg', 'symbol', 'defs', 'path'];

/* eslint-disable no-underscore-dangle */
/** An area on screen that can be subdivided in smaller sub-zones. */
export class Zone implements Serializable<ZoneJson> {
    /** Parent zone of this zone. */
    public readonly parent?: Zone;

    /** Unique ID of the zone in the context of its owning LOM. */
    public readonly zoneId: string;

    /** Tag name of this zone. */
    public readonly tagName: string;

    /** Word count of this zone. */
    public readonly wordCount: number;

    /** Bounding rectangle of this zone in world coordinates. */
    public readonly bounds: Bounds;

    /** Styling info on this zone. */
    public readonly styles?: { readonly backgroundColor?: string; readonly color?: string, readonly fontSize?: string };

    private readonly _children: Zone[];

    private constructor(
        parent: Zone | undefined,
        zoneId: string,
        tagName: string,
        wordCount: number,
        bounds: Bounds,
        styles?: { readonly backgroundColor?: string; readonly color?: string, readonly fontSize?: string }
    ) {
        this.parent = parent;
        this.zoneId = zoneId;
        this.tagName = tagName;
        this.wordCount = wordCount;
        this.bounds = bounds;
        this._children = [];
        this.styles = styles;
    }

    /** Bounding rectangle of this zone in local coordinates (ie relative to parent zone). */
    public get localBounds(): Bounds {
        return this.parent ? this.bounds.translated(-this.parent.bounds.x, -this.parent.bounds.y) : this.bounds;
    }

    /** Sub-zones of this zone. */
    get children(): readonly Zone[] {
        return this._children;
    }

    /** Capture an HTMLElement as a Zone. */
    public static capture(element: HTMLElement, parentZone?: Zone): Zone {
        // Bounds
        const elementRect = element.getBoundingClientRect();
        const elementBounds = new Bounds(elementRect.x, elementRect.y, elementRect.width, elementRect.height);

        // Tag Name
        const elementTagName = element.tagName;

        // Word Count
        // Regex to match words and numbers, including numbers with commas or dots as separators
        // [\p{L}\p{N}]+ matches one or more letters (\p{L}) or numbers (\p{N})
        // (?:[.,][\p{N}]+)* non capturing optional group, repeated zero or more times
        const textContent = element.textContent.trim().match(/\b[\p{L}\p{N}]+(?:[.,][\p{N}]+)*\b/gu);
        const elementWordCount = textContent ? textContent.length : 0;

        // Styles
        const computedStyle = getComputedStyle(element);
        const elementStyles = {
            "backgroundColor": computedStyle.backgroundColor,
            "color": computedStyle.color,
            "fontSize": computedStyle.fontSize,
        }

        function getZoneId(): string {
            if (element.dataset.opentechUxZoneId) return element.dataset.opentechUxZoneId;
            const newZoneId = `z${(zoneIdCounter += 1)}`;
            // eslint-disable-next-line no-param-reassign
            element.dataset.opentechUxZoneId = newZoneId;
            return newZoneId;
        }

        let currentZone = parentZone ?? new Zone(undefined, getZoneId(), elementTagName, elementWordCount, elementBounds, elementStyles);
        if (parentZone && !elementBounds.isEmpty() && !elementBounds.isCoincident(currentZone.bounds)) {
            currentZone = new Zone(parentZone, getZoneId(), elementTagName, elementWordCount, elementBounds, elementStyles);
            parentZone._children.push(currentZone);
        }

        function getElement(e: HTMLElement | HTMLIFrameElement) {
            try {
                return (e.tagName == 'IFRAME')
                    ? (e as HTMLIFrameElement).contentDocument.body || null
                    : e as HTMLElement
            } catch {
                return e as HTMLElement
            }
        }

        Array.from(element.children)
            .filter((e) => nodeNameFilter.indexOf(e.nodeName) < 0)
            .filter((e) => !(e as HTMLElement).isContentEditable)
            .filter((e) => getComputedStyle(e).animationIterationCount !== 'infinite')
            .forEach((e) => Zone.capture(getElement(e as HTMLElement | HTMLIFrameElement), currentZone));

        return currentZone;
    }

    /** Check if this zone is similar in shape with other zone, with a specified tolerance. */
    public isSimilar(other: Zone, tolerance = 0): boolean {
        return (
            this.bounds.isCoincident(other.bounds, tolerance) &&
            this._children.length === other._children.length &&
            this._children.every((c, i) => c.isSimilar(other._children[i], tolerance))
        );
    }

    public toJSON(): ZoneJson {
        const result: ZoneJson = { id: this.zoneId, t: this.tagName, wc: this.wordCount, b: this.localBounds.toJSON() };
        if (this.styles) {
            result.s = {};
            if (this.styles.backgroundColor) result.s.bc = this.styles.backgroundColor;
            if (this.styles.color) result.s.c = this.styles.color;
            if (this.styles.fontSize) result.s.fs = this.styles.fontSize;
        }
        if (this._children.length) result.c = this._children.map((c) => c.toJSON());
        return result;
    }
}
