namespace Module {
    interface ConnectionOptions {
        "vfs"?: string
        "mode"?: "ro" | "rw" | "rwc" | "memory"
        "cache"?: "shared" | "private"
        "psow"?: boolean
        "nolock"?: boolean
        "immutable"?: boolean
    }

    export class Connection {
        private pDb: ptr<sqlite3>
        public readonly "uri": string
        constructor(public readonly filename: string, options: ConnectionOptions = {}) {
            const opts = []
            const vfs = options["vfs"]
            if (vfs != null) { opts.push(`vfs=${encodeURIComponent(vfs)}`) }
            const mode = options["mode"]
            if (mode != null) { opts.push(`mode=${encodeURIComponent(mode)}`) }
            const cache = options["cache"]
            if (cache != null) { opts.push(`cache=${encodeURIComponent(cache)}`) }
            const psow = options["psow"]
            if (psow != null) { opts.push(`psow=${Number(psow)}`) }
            const nolock = options["nolock"]
            if (nolock != null) { opts.push(`nolock=${Number(nolock)}`) }
            const immutable = options["immutable"]
            if (immutable != null) { opts.push(`nolock=${Number(immutable)}`) }
            const q = opts.join("&")
            const uri = this["uri"] = `file:${encodeURI(filename)}${q ? "?" + q : ""}`

            const { result: code, pDb } = sqlite3_open(uri)

            if (code) { throw new SQLiteError(code) }

            this.pDb = pDb as ptr<sqlite3>
        }

        close(): void {
            const code = sqlite3_close_v2(this.pDb)
            if (code) { throw new SQLiteError(code) }
            delete this.pDb
        }

        exec<T>(
            sql: string,
            callback?: ((columns: { [k in string]: string }) => T | undefined),
        ): T | undefined {
            let value: T | undefined = undefined
            let reason: any = undefined
            let columnNames: string[] | undefined = undefined
            function ptrToStringArray(p: ptr<arr<ptr<str>>>, length: number) {
                const texts = []
                for (let i: number = p; i < p + length * 4; i += 4) {
                    const text = UTF8ToString(getValue<ptr<str>>(i as ptr<ptr<str>>, "*"))
                    texts.push(text)
                }
                return texts
            }
            const { result, errmsg } = sqlite3_exec(this.pDb, sql, callback == null ? undefined : (numColumns, pColumnTexts, pColumnNames) => {
                const columnTexts = ptrToStringArray(pColumnTexts, numColumns)
                if (columnNames == null) columnNames = ptrToStringArray(pColumnNames, numColumns)
                const record: Record<string, string> = Object.create(null)
                for (let i = 0; i < numColumns; i++) {
                    record[columnNames[i]] = columnTexts[i]
                }
                try {
                    value = callback(record)
                    return value !== undefined
                } catch (error) {
                    reason = error
                    return true
                }
            })

            if (value !== undefined) {
                return value
            }
            if (reason !== undefined) {
                throw reason
            }
            if (result) {
                throw new SQLiteError(result, errmsg || undefined)
            }
        }

        enableLoadExtension() {
            const { result, value } = sqlite3_db_config(this.pDb, SQLiteDbConfig.ENABLE_LOAD_EXTENSION, 1)
            if (result) { throw new SQLiteError(result) }
            return value
        }

        disableLoadExtension() {
            const { result, value } = sqlite3_db_config(this.pDb, SQLiteDbConfig.ENABLE_LOAD_EXTENSION, 0)
            if (result) { throw new SQLiteError(result) }
            return value
        }

        loadExtension(file: string, entry?: string) {
            const { result, errmsg } = sqlite3_load_extension(this.pDb, file, entry)
            if (result) { throw new SQLiteError(result, errmsg || undefined) }
        }
    }
}
