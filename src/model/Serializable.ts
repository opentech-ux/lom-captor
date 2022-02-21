/** Super-interface of types having a specific JSON representation. */
export interface Serializable<JsonType = object | string | Array<unknown>> {
    /** Returns the JSON version of this object. */
    toJSON(): JsonType;
}
