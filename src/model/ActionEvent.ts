import { ActionEvent as ActionEventJson } from '../../build/json-schema/sessionCapture.schema';
import { AbstractEvent } from './AbstractEvent';

/** A captured action event (mouse click, keystroke, drag & drop, ...). */
export class ActionEvent extends AbstractEvent<ActionEvent> {
    /** ID of the LOM zone at which the event occurred. */
    public readonly zoneId: string;

    constructor(timeStamp: number, type: string, zoneId: string) {
        super(timeStamp, type);
        this.zoneId = zoneId;
    }

    public relativizeTime(t0: number): ActionEvent {
        return new ActionEvent(this.timeStamp - t0, this.type, this.zoneId);
    }

    public toJSON(): ActionEventJson {
        return `${super.toJSON()}:${this.zoneId}`;
    }
}
