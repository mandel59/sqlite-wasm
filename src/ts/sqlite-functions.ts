namespace Module {
    export declare function _sqlite3_open(filename: ptr<str>, ppDb: ptr<ptr<sqlite3>>): SQLiteResult
    export declare function _sqlite3_close_v2(pDb: ptr<sqlite3>): SQLiteResult
    export declare function _sqlite3_exec<T extends ptr<any>>(
        pDb: ptr<sqlite3>,
        sql: ptr<str>,
        callback: ptr<fn<(x: T | 0, numColumns: number, columnTexts: ptr<arr<ptr<str>>>, columnNames: ptr<arr<ptr<str>>>) => i32>> | 0,
        errmsg: ptr<sqlite3_ptr<str>> | 0
    ): SQLiteResult
    export declare function _sqlite3_free(ptr: sqlite3_ptr<any> | 0): void

    export const sqlite3_open
        : (filename: string, ppDb: ptr<ptr<sqlite3>>) => SQLiteResult
        = Module["cwrap"]("sqlite3_open", "number", ["string", "number"])
    export const sqlite3_close_v2
        : (pDb: ptr<sqlite3>) => SQLiteResult
        = Module["cwrap"]("sqlite3_close_v2", "number", ["number"])
    export const sqlite3_exec
        : <T extends number>(
            pDb: ptr<sqlite3>,
            sql: string,
            callback: ptr<(x: T, numColumns: number, columnTexts: ptr<arr<ptr<str>>>, columnNames: ptr<arr<ptr<str>>>) => number> | 0,
            x: T,
            errmsg: ptr<sqlite3_ptr<str>> | 0
        ) => SQLiteResult
        = Module["cwrap"]("sqlite3_exec", "number", ["number", "string", "number", "number", "number"])
    export const sqlite3_free
        : (ptr: sqlite3_ptr<any> | 0) => void
        = Module["cwrap"]("sqlite3_free", "undefined", ["number"])
}
