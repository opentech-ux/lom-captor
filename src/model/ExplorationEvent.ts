import { ExplorationEvent as ExplorationEventJson } from '../../build/json-schema/sessionCapture.schema';
import { Point } from './Point';
import { AbstractEvent } from './AbstractEvent';

/** A captured exploration event (mouse move, scrolling, keyboard navigation, ...). */
export class ExplorationEvent extends AbstractEvent<ExplorationEvent> {
    /** Scroll position of the document when this event occurred. */
    public readonly scrollPosition: Point;

    /** Mouse position in page when this event occurred if applicable. */
    public readonly mousePosition?: Point;

    /** ID of the LOM zone having the focus if applicable. */
    public readonly focusedZoneId?: string;

    constructor(timeStamp: number, type: string, scrollPosition: Point, mousePosition?: Point, focusedZoneId?: string) {
        super(timeStamp, type);
        this.scrollPosition = { x: scrollPosition.x, y: scrollPosition.y };
        this.mousePosition = mousePosition ? { x: mousePosition.x, y: mousePosition.y } : undefined;
        this.focusedZoneId = focusedZoneId;
    }

    public relativizeTime(t0: number): ExplorationEvent {
        return new ExplorationEvent(this.timeStamp - t0, this.type, this.scrollPosition, this.mousePosition);
    }

    public toJSON(): ExplorationEventJson {
        let result = `${super.toJSON()}:${this.scrollPosition.x},${this.scrollPosition.y}:`;
        if (this.mousePosition) result += `${this.mousePosition.x},${this.mousePosition.y}:`;
        if (this.focusedZoneId) result += `${this.focusedZoneId}`;
        return result;
    }
}
