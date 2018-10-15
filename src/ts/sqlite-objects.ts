namespace Module {
    export type sqlite3_ptr<T> = ptr<T> & { __free__: "sqlite3_free" }
    export interface sqlite3 { __type__: "sqlite3" }
    export interface sqlite3_stmt { __type__: "sqlite3_stmt" }
}