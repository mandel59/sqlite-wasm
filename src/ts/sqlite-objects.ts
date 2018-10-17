namespace Module {
    export type sqlite3_ptr<T extends { __type__: any }> = ptr<T> & { __free__: "sqlite3_free" }
    export interface sqlite3 { __type__: "sqlite3" }
}