namespace Module {
    export const sqlite3_open
        : (filename: string, ppDb: ptr<ptr<sqlite3>>) => SQLiteResult
        = Module["cwrap"]("sqlite3_open", "number", ["string", "number"])

    export const sqlite3_last_insert_rowid
        : (pDb: ptr<sqlite3>) => number
        = Module["cwrap"]("sqlite3_last_insert_rowid", "number", ["number"])

    export const sqlite3_prepare2
        : (pDb: ptr<sqlite3>, sql: string, numBytes: number, pStatement: ptr<ptr<sqlite3>>, pzTail: ptr<sqlite3>) => SQLiteResult
        = Module["cwrap"]("sqlite3_prepare_v2", "number", ["number", "string", "number", "number", "number"])

    export const sqlite3_column_count
        : (pStatement: ptr<sqlite3>) => number
        = Module["cwrap"]("sqlite3_column_count", "number", ["number"])

    export const sqlite3_step
        : (pStatement: ptr<sqlite3>) => SQLiteResult
        = Module["cwrap"]("sqlite3_step", "number", ["number"])

    export const sqlite3_finalize
        : (pStatement: ptr<sqlite3>) => SQLiteResult
        = Module["cwrap"]("sqlite3_finalize", "number", ["number"])

    export const sqlite3_reset
        : (pStatement: ptr<sqlite3>) => SQLiteResult
        = Module["cwrap"]("sqlite3_reset", "number", ["number"])

    export const sqlite3_column_name
        : (pStatement: ptr<sqlite3>, index: number) => string
        = Module["cwrap"]("sqlite3_column_name", "number", ["number", "number"])

    export const sqlite3_bind_text16
        : (pStatement: ptr<sqlite3>, index: number, val: string, n: number, pFree: ptr<sqlite3>) => number
        = Module["cwrap"]("sqlite3_bind_text16", "number", ["number", "number", "string", "number", "number"])

    export const sqlite3_changes
        : (pStatement: ptr<sqlite3>) => number
        = Module["cwrap"]("sqlite3_changes", "number", ["number"])

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
