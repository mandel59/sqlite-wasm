namespace Module {
    export class SQLiteError extends Error {
        public readonly "code": SQLiteResult
        constructor(code: SQLiteResult, message?: string) {
            super(message || `SQLITE_${SQLiteResult[code]}`)
            Object.defineProperty(this, "code", { value: code })
            Object.defineProperty(this, "name", { value: `SQLITE_${SQLiteResult[code]}` })
        }
    }
}