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

    /** Bounding rectangle of this zone in world coordinates. */
    public readonly bounds: Bounds;

    /** Styling info on this zone. */
    public readonly style?: { readonly background?: string; readonly border?: string };

    private readonly _children: Zone[];

    private constructor(
        parent: Zone | undefined,
        zoneId: string,
        bounds: Bounds,
        style?: { background?: string; border?: string }
    ) {
        this.parent = parent;
        this.zoneId = zoneId;
        this.bounds = bounds;
        this._children = [];
        this.style = style;
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
        const elementRect = element.getBoundingClientRect();
        const elementBounds = new Bounds(elementRect.x, elementRect.y, elementRect.width, elementRect.height);

        function getZoneId(): string {
            if (element.dataset.opentechUxZoneId) return element.dataset.opentechUxZoneId;
            const newZoneId = `z${(zoneIdCounter += 1)}`;
            // eslint-disable-next-line no-param-reassign
            element.dataset.opentechUxZoneId = newZoneId;
            return newZoneId;
        }

        let currentZone = parentZone ?? new Zone(undefined, getZoneId(), elementBounds);
        if (parentZone && !elementBounds.isEmpty() && !elementBounds.isCoincident(currentZone.bounds)) {
            currentZone = new Zone(parentZone, getZoneId(), elementBounds);
            parentZone._children.push(currentZone);
        }

        Array.from(element.children)
            .filter((e) => nodeNameFilter.indexOf(e.nodeName) < 0)
            .filter((e) => !(e as HTMLElement).isContentEditable)
            .filter((e) => getComputedStyle(e).animationIterationCount !== 'infinite')
            .forEach((e) => Zone.capture(e as HTMLElement, currentZone));

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
        const result: ZoneJson = { id: this.zoneId, b: this.localBounds.toJSON() };
        if (this.style) {
            result.s = {};
            if (this.style.border) result.s.b = this.style.border;
            if (this.style.background) result.s.bg = this.style.background;
        }
        if (this._children.length) result.c = this._children.map((c) => c.toJSON());
        return result;
    }
}
