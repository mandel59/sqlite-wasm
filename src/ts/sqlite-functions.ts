namespace Module {
    export declare function _sqlite3_close_v2(pDb: ptr<sqlite3>): SQLiteResult
    export const sqlite3_close_v2
        : (pDb: ptr<sqlite3>) => SQLiteResult
        = _sqlite3_close_v2

    export declare function _sqlite3_free(ptr: sqlite3_ptr<any> | 0): void
    export const sqlite3_free
        : (ptr: sqlite3_ptr<any> | 0) => void
        = _sqlite3_free

    export declare function _sqlite3_open(filename: ptr<str>, ppDb: ptr<ptr<sqlite3>>): SQLiteResult
    export const sqlite3_open
        : (filename: string) => { result: SQLiteResult, pDb: ptr<sqlite3> | 0 }
        = (filename) => {
            const stack = Module["stackSave"]()
            const ppDb = Module["stackAlloc"]<ptr<sqlite3>>(4)
            const result = Module["ccall"]<"number", ["string", "number"]>("sqlite3_open", "number", ["string", "number"], [filename, ppDb])
            const pDb = Module["getValue"]<ptr<sqlite3>>(ppDb, "*")
            Module["stackRestore"](stack)
            return { result, pDb }
        }

    export declare function _sqlite3_exec<T extends ptr<any>>(
        pDb: ptr<sqlite3>,
        sql: ptr<str>,
        callback: ptr<fn<(x: T | 0, numColumns: i32, columnTexts: ptr<arr<ptr<str>>>, columnNames: ptr<arr<ptr<str>>>) => i32>> | 0,
        errmsg: ptr<sqlite3_ptr<str>> | 0
    ): SQLiteResult
    export const sqlite3_exec
        : (
            pDb: ptr<sqlite3>,
            sql: string,
            callback?: (numColumns: i32, pColumnTexts: ptr<arr<ptr<str>>>, pColumnNames: ptr<arr<ptr<str>>>) => boolean,
        ) => { result: SQLiteResult, errmsg: string | null }
        = (pDb, sql, callback) => {
            const UTF8ToString = Module["UTF8ToString"]
            const getValue = Module["getValue"]
            const pCallback
                = callback == null
                    ? 0
                    : Module["addFunction"](
                        (_x: 0, numColumns: i32, pColumnTexts: ptr<arr<ptr<str>>>, pColumnNames: ptr<arr<ptr<str>>>) => {
                            return (callback(numColumns, pColumnTexts, pColumnNames) as any) | 0 as i32
                        },
                        "iiiii")
            const stack = Module["stackSave"]()
            const ppErrmsg = Module["stackAlloc"]<sqlite3_ptr<str>>(4)
            const result = Module["ccall"]<"number", ["number", "string", "number", "number", "number"]>("sqlite3_exec", "number",
                ["number", "string", "number", "number", "number"],
                [pDb, sql, pCallback, 0, ppErrmsg])
            const pErrmsg = getValue<sqlite3_ptr<str>>(ppErrmsg, "*")
            Module["stackRestore"](stack)
            const errmsg = pErrmsg === 0 ? null : UTF8ToString(pErrmsg)
            sqlite3_free(pErrmsg)
            if (pCallback !== 0) {
                Module["removeFunction"](pCallback)
            }
            return { result, errmsg }
        }

    export const sqlite3_load_extension
        = (pDb: ptr<sqlite3>, file: string, proc?: string) => {
            const stack = Module["stackSave"]()
            const ppErrmsg = Module["stackAlloc"]<sqlite3_ptr<str>>(4)
            const result = Module["ccall"](
                "sqlite3_load_extension",
                "number",
                ["number", "string", "string", "number"],
                [pDb, file, proc, ppErrmsg]) as SQLiteResult
            const pErrmsg = Module["getValue"]<sqlite3_ptr<str>>(ppErrmsg, "*")
            Module["stackRestore"](stack)
            sqlite3_free(pErrmsg)
            const errmsg = pErrmsg === 0 ? null : Module["UTF8ToString"](pErrmsg)
            return { result, errmsg }
        }

    export declare function _glue_sqlite3_db_config_int_pint(pDb: ptr<sqlite3>, op: SQLiteDbConfigIntPint, value: i32, pValue: ptr<i32> | 0): SQLiteResult
    export const sqlite3_db_config
        : (pDb: ptr<sqlite3>, op: SQLiteDbConfigIntPint, value: number) => { result: SQLiteResult, value: i32 }
        = (pDb: ptr<sqlite3>, op: SQLiteDbConfig, ...args: any[]) => {
            if (configTypeIsIntPint(op)) {
                const [value] = args
                const stack = Module["stackSave"]()
                const pValue = Module["stackAlloc"]<i32>(4)
                const result = Module["_glue_sqlite3_db_config_int_pint"](pDb, op, value, pValue)
                const retVal = Module["getValue"](pValue, "i32")
                Module["stackRestore"](stack)
                return { result, value: retVal }
            }
            throw RangeError("unimplemented")
        }
}
