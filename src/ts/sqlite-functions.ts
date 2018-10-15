namespace Module {
    export const sqlite3_libversion_number
        : () => number
        = Module["cwrap"]("sqlite3_libversion_number", "number", [])

    export const sqlite3_open
        : (filename: string, ppDb: ptr<ptr<sqlite3>>) => SQLiteResult
        = Module["cwrap"]("sqlite3_open", "number", ["string", "number"])

    export const sqlite3_open_v2
        : (filename: string, ppDb: ptr<ptr<sqlite3>>, flags: number, vfs: string) => SQLiteResult
        = Module["cwrap"]("sqlite3_open_v2", "number", ["string", "number", "number", "string"])

    export const sqlite3_last_insert_rowid
        : (pDb: ptr<sqlite3>) => number
        = Module["cwrap"]("sqlite3_last_insert_rowid", "number", ["number"])

    export const sqlite3_errcode
        : (pDb: ptr<sqlite3>) => number
        = Module["cwrap"]("sqlite3_errcode", "number", ["number"])

    export const sqlite3_extended_errcode
        : (pDb: ptr<sqlite3>) => number
        = Module["cwrap"]("sqlite3_extended_errcode", "number", ["number"])

    export const sqlite3_extended_result_codes
        : (pDb: ptr<sqlite3>, onoff: number) => number
        = Module["cwrap"]("sqlite3_extended_result_codes", "number", ["number", "number"])

    export const sqlite3_busy_timeout
        : (pDb: ptr<sqlite3>, ms: number) => number
        = Module["cwrap"]("sqlite3_busy_timeout", "number", ["number", "number"])

    export const sqlite3_db_filename
        : (pDb: ptr<sqlite3>, zDBName: string) => string
        = Module["cwrap"]("sqlite3_busy_timeout", "number", ["number", "string"])

    export const sqlite3_errmsg
        : (pDb: ptr<sqlite3>) => string
        = Module["cwrap"]("sqlite3_errmsg", "string", ["number"])

    export const sqlite3_prepare2
        : (pDb: ptr<sqlite3>, pSql: ptr<string>, numBytes: number, pStatement: ptr<ptr<sqlite3_stmt>>, pzTail: ptr<ptr<string>>) => SQLiteResult
        = Module["cwrap"]("sqlite3_prepare_v2", "number", ["number", "number", "number", "number", "number"])

    export const sqlite3_column_count
        : (pStatement: ptr<sqlite3_stmt>) => number
        = Module["cwrap"]("sqlite3_column_count", "number", ["number"])

    export const sqlite3_step
        : (pStatement: ptr<sqlite3_stmt>) => SQLiteResult
        = Module["cwrap"]("sqlite3_step", "number", ["number"])

    export const sqlite3_stmt_readonly
        : (pStatement: ptr<sqlite3_stmt>) => SQLiteResult
        = Module["cwrap"]("sqlite3_stmt_readonly", "number", ["number"])

    export const sqlite3_bind_parameter_count
        : (pStatement: ptr<sqlite3_stmt>) => SQLiteResult
        = Module["cwrap"]("sqlite3_bind_parameter_count", "number", ["number"])

    export const sqlite3_finalize
        : (pStatement: ptr<sqlite3_stmt>) => SQLiteResult
        = Module["cwrap"]("sqlite3_finalize", "number", ["number"])

    export const sqlite3_reset
        : (pStatement: ptr<sqlite3_stmt>) => SQLiteResult
        = Module["cwrap"]("sqlite3_reset", "number", ["number"])

    export const sqlite3_column_name
        : (pStatement: ptr<sqlite3_stmt>, index: number) => string
        = Module["cwrap"]("sqlite3_column_name", "string", ["number", "number"])

    export const sqlite3_column_type
        : (pStatement: ptr<sqlite3_stmt>, index: number) => number
        = Module["cwrap"]("sqlite3_column_type", "number", ["number", "number"])

    export const sqlite3_column_int
        : (pStatement: ptr<sqlite3_stmt>, index: number) => number
        = Module["cwrap"]("sqlite3_column_int", "number", ["number", "number"])

    export const sqlite3_column_bytes
        : (pStatement: ptr<sqlite3_stmt>, index: number) => number
        = Module["cwrap"]("sqlite3_column_bytes", "number", ["number", "number"])

    export const sqlite3_column_int64ptr
        : (pStatement: ptr<sqlite3_stmt>, index: number, pOutValue: number) => void
        = Module["cwrap"]("sqlite3_column_int64ptr", "number", ["number", "number", "number"])

    export const sqlite3_column_double
        : (pStatement: ptr<sqlite3_stmt>, index: number) => number
        = Module["cwrap"]("sqlite3_column_double", "number", ["number", "number"])

    export const sqlite3_column_text
        : (pStatement: ptr<sqlite3_stmt>, index: number) => string
        = Module["cwrap"]("sqlite3_column_text", "string", ["number", "number"])

    export const sqlite3_column_blob
        : (pStatement: ptr<sqlite3_stmt>, index: number) => number
        = Module["cwrap"]("sqlite3_column_blob", "number", ["number", "number"])

    export const sqlite3_bind_text
        : (pStatement: ptr<sqlite3_stmt>, index: number, val: string, n: number, pFree: ptr<sqlite3>) => SQLiteResult
        = Module["cwrap"]("sqlite3_bind_text", "number", ["number", "number", "string", "number", "number"])

    export const sqlite3_bind_int
        : (pStatement: ptr<sqlite3_stmt>, index: number, val: number) => SQLiteResult
        = Module["cwrap"]("sqlite3_bind_int", "number", ["number", "number", "number"])

    export const sqlite3_bind_int64ptr
        : (pStatement: ptr<sqlite3_stmt>, index: number, val: Uint8Array) => SQLiteResult
        = Module["cwrap"]("sqlite3_bind_int64ptr", "number", ["number", "number", "array"])

    export const sqlite3_bind_double
        : (pStatement: ptr<sqlite3_stmt>, index: number, val: number) => SQLiteResult
        = Module["cwrap"]("sqlite3_bind_double", "number", ["number", "number", "number"])

    export const sqlite3_bind_null
        : (pStatement: ptr<sqlite3_stmt>, index: number) => SQLiteResult
        = Module["cwrap"]("sqlite3_bind_null", "number", ["number", "number"])

    export const sqlite3_bind_parameter_index
        : (pStatement: ptr<sqlite3_stmt>, name: string) => number
        = Module["cwrap"]("sqlite3_bind_parameter_index", "number", ["number", "string"])

    export const sqlite3_bind_blob
        : (pStatement: ptr<sqlite3_stmt>, index: number, value: number, length: number, pCallback: number) => SQLiteResult
        = Module["cwrap"]("sqlite3_bind_blob", "number", ["number", "number", "number", "number", "number"])

    export const sqlite3_changes
        : (pDb: ptr<sqlite3>) => number
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
