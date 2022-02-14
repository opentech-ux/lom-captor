import { ActionEvent as ActionEventJson } from '../../build/json-schema/sessionCapture.schema';
import { AbstractEvent } from './AbstractEvent';
import { Point } from './Point';

/** A captured action event (mouse click, keystroke, drag & drop, ...). */
export class ActionEvent extends AbstractEvent<ActionEvent> {
    /** ID of the LOM zone at which the event occurred. */
    public readonly zoneId: string;

    /** mask containing modifiers 1:shift, 2 ctrl, 4 alt, 8 meta & co */
    public readonly modifiers: number;

    /** Mouse position when event occurred, if relevant. */
    public readonly mousePosition?: Point;

    constructor(timeStamp: number, type: string, zoneId: string, modifiers: number, mousePosition?: Point) {
        super(timeStamp, type);
        this.zoneId = zoneId;
        this.modifiers = modifiers;
        this.mousePosition = mousePosition;
    }

    public relativizeTime(t0: number): ActionEvent {
        return new ActionEvent(this.timeStamp - t0, this.type, this.zoneId, this.modifiers);
    }

    public toJSON(): ActionEventJson {
        let result = `${super.toJSON()}:${this.zoneId}:`;
        if (this.mousePosition) result += `${this.mousePosition.x},${this.mousePosition.y}`;
        return result;
    }
}
