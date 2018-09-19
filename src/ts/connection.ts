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
        private databaseHandle: ptr<sqlite3>

        public readonly uri: string

        constructor(public readonly data: Uint8Array, options: ConnectionOptions = {}) {

            const opts = this.buildOptions(options);
            const filename = 'dbfile_' + (0xffffffff * Math.random() >>> 0);
            const uri = this.uri = `file:${encodeURI(filename)}${opts ? "?" + opts : ""}`

            const stack = stackSave()
            const ppDb = stackAlloc<ptr<sqlite3>>(4)
            const code = sqlite3_open(uri, ppDb)
            const databaseHandle = Module["getValue"](ppDb, "*")
            stackRestore(stack)

            if (code) {
                throw new SQLiteError(code)
            }

            this.databaseHandle = databaseHandle as ptr<sqlite3>
        }

        public get id(): number {
            return this.databaseHandle as number;
        }

        close(): void {
            const code = sqlite3_close_v2(this.databaseHandle)
            if (code) { throw new SQLiteError(code) }
            delete this.databaseHandle
        }

        preparev2(sql: string) : Statement {

            const stack = stackSave()
            const ppStatement = stackAlloc<ptr<sqlite3>>(4)
            const code = sqlite3_prepare2(this.databaseHandle, sql, -1, ppStatement, <ptr<sqlite3>>0);

            const statementHandle = Module["getValue"](ppStatement, "*")
            stackRestore(stack)

            if (code) {
                throw new SQLiteError(code)
            }

            return new Statement(statementHandle as ptr<sqlite3>);
        }

        getChanges(): number {
            return sqlite3_changes(this.databaseHandle);
        }

        getLastInsertRowId(): number {
            return sqlite3_last_insert_rowid(this.databaseHandle);
        }

        exec<T>(
            sql: string,
            callback?: ((columns: {[k in string]: string}) => T | undefined),
        ): T | undefined {
            let pCallback = null
            let result: T | undefined = undefined
            let reason = undefined
            if (callback) {
                pCallback = addFunction((x: number, n: number, texts: arr<ptr<string>>, names: arr<ptr<string>>) => {
                    const col: {[k in string]: string} = {}
                    for (let i = 0; i < n; i++) {
                        const pText = Module["getValue"](texts + 4 * i, "*") as ptr<string>
                        const pName = Module["getValue"](names + 4 * i, "*") as ptr<string>
                        const text = Module["UTF8ToString"](pText)
                        const name = Module["UTF8ToString"](pName)
                        col[name] = text
                    }
                    try {
                        result = callback(col)
                        return result === undefined ? 0 : 1
                    } catch (error) {
                        reason = error
                        return 1
                    }
                })
            }

            const stack = stackSave()
            const ppErrmsg = stackAlloc(4) as ptr<sqlite3_ptr<string>>
            const code = sqlite3_exec(this.databaseHandle, sql, pCallback, 0, ppErrmsg)
            const pErrmsg = Module["getValue"](ppErrmsg, "*")
            stackRestore(stack)

            if (pCallback) { removeFunction(pCallback) }
            let errmsg = undefined
            if (pErrmsg) {
                errmsg = Module["UTF8ToString"](pErrmsg)
                sqlite3_free(pErrmsg)
            }
            if (reason !== undefined) { throw reason }
            if (code) { throw new SQLiteError(code, errmsg) }
            return result
        }

        private buildOptions(options: ConnectionOptions): string {
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

            return opts.join("&")
        }
    }
}
