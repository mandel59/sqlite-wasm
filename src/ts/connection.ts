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
        ): { result: SQLiteResult, errmsg: string | null, value: T | undefined, reason: any } {
            let value: T | undefined = undefined
            let reason: any = undefined
            const { result, errmsg } = sqlite3_exec(this.pDb, sql, callback == null ? undefined : (numColumns, columnTexts, columnNames) => {
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

            return { result, errmsg, value, reason }
        }

        enableLoadExtension() {
            return Module["_sqlite3_db_config"](this.pDb, SQLiteDbConfig.ENABLE_LOAD_EXTENSION, 1, 0)
        }

        loadExtension(file: string, entry?: string) {
            return sqlite3_load_extension(this.pDb, file, entry)
        }
    }
}
