namespace Module {
    export declare function _sqlite3_open(filename: ptr<str>, ppDb: ptr<ptr<sqlite3>>): SQLiteResult
    export declare function _sqlite3_close_v2(pDb: ptr<sqlite3>): SQLiteResult
    export declare function _sqlite3_exec<T extends ptr<any>>(
        pDb: ptr<sqlite3>,
        sql: ptr<str>,
        callback: ptr<fn<(x: T | 0, numColumns: i32, columnTexts: ptr<arr<ptr<str>>>, columnNames: ptr<arr<ptr<str>>>) => i32>> | 0,
        errmsg: ptr<sqlite3_ptr<str>> | 0
    ): SQLiteResult
    export declare function _sqlite3_free(ptr: sqlite3_ptr<any> | 0): void

    export const sqlite3_open
        : (filename: string) => { result: SQLiteResult, pDb: ptr<sqlite3> | 0 }
        = (filename) => {
            const stack = stackSave()
            const ppDb = stackAlloc<ptr<sqlite3>>(4)
            const result = Module["ccall"]<"number", ["string", "number"]>("sqlite3_open", "number", ["string", "number"], [filename, ppDb])
            const pDb = getValue<ptr<sqlite3>>(ppDb, "*")
            stackRestore(stack)
            return { result, pDb }
        }
    export const sqlite3_close_v2
        : (pDb: ptr<sqlite3>) => SQLiteResult
        = Module["cwrap"]("sqlite3_close_v2", "number", ["number"])
    export const sqlite3_exec
        : (
            pDb: ptr<sqlite3>,
            sql: string,
            callback?: (numColumns: number, columnTexts: string[], columnNames: string[]) => boolean,
        ) => { result: SQLiteResult, errmsg: string | null }
        = (pDb, sql, callback) => {
            const pCallback = callback == null ? 0 : addFunction((_x: 0, numColumns: i32, pColumnTexts: ptr<arr<ptr<str>>>, pColumnNames: ptr<arr<ptr<str>>>) => {
                const columnTexts = []
                const columnNames = []
                for (let i: number = pColumnTexts; i < pColumnTexts + numColumns * 4; i += 4) {
                    const columnText = UTF8ToString(getValue<ptr<str>>(i as ptr<ptr<str>>, "*"))
                    columnTexts.push(columnText)
                }
                for (let i: number = pColumnNames; i < pColumnNames + numColumns * 4; i += 4) {
                    const columnName = UTF8ToString(getValue<ptr<str>>(i as ptr<ptr<str>>, "*"))
                    columnNames.push(columnName)
                }
                return (callback(numColumns, columnTexts, columnNames) as any) | 0 as i32
            })
            const stack = stackSave()
            const ppErrmsg = stackAlloc<sqlite3_ptr<str>>(4)
            const result = Module["ccall"]<"number", ["number", "string", "number", "number", "number"]>("sqlite3_exec", "number",
                ["number", "string", "number", "number", "number"],
                [pDb, sql, pCallback, 0, ppErrmsg])
            const pErrmsg = getValue<sqlite3_ptr<str>>(ppErrmsg, "*")
            stackRestore(stack)
            const errmsg = pErrmsg === 0 ? null : UTF8ToString(pErrmsg)
            sqlite3_free(pErrmsg)
            if (pCallback !== 0) {
                removeFunction(pCallback)
            }
            return { result, errmsg }
        }
    export const sqlite3_free
        : (ptr: sqlite3_ptr<any> | 0) => void
        = Module["cwrap"]("sqlite3_free", "undefined", ["number"])
}
