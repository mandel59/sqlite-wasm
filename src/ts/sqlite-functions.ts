namespace Module {
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
            callback: ptr<(x: T, numColumns: number, columnTexts: arr<ptr<string>>, columnNames: arr<ptr<string>>) => number> | null,
            x: T,
            errmsg: ptr<sqlite3_ptr<string>> | null
        ) => SQLiteResult
        = Module["cwrap"]("sqlite3_exec", "number", ["number", "string", "number", "number", "number"])
    export const sqlite3_free
        : (ptr: sqlite3_ptr<any> | 0) => void
        = Module["cwrap"]("sqlite3_free", "", ["number"])
}
