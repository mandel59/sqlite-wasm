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

            const stack = stackSave()
            const ppDb = stackAlloc<ptr<sqlite3>>(4)
            const code = sqlite3_open(uri, ppDb)
            const pDb = Module["getValue"](ppDb, "*")
            stackRestore(stack)

            if (code) { throw new SQLiteError(code) }

            this.pDb = pDb as ptr<sqlite3>
        }

        "close"(): void {
            const code = sqlite3_close_v2(this.pDb)
            if (code) { throw new SQLiteError(code) }
            delete this.pDb
        }

        "exec"<T>(
            sql: string,
            callback?: ((columns: {[k in string]: string}) => T | undefined),
        ): T | undefined {
            let pCallback: ptr<(x: 0, numColumns: number, columnTexts: arr<ptr<string>>, columnNames: arr<ptr<string>>) => number> | 0 = 0
            let result: T | undefined = undefined
            let reason = undefined
            if (callback) {
                pCallback = addFunction((x: number, n: number, texts: arr<ptr<string>>, names: arr<ptr<string>>) => {
                    const col: {[k in string]: string} = {}
                    for (let i = 0; i < n; i++) {
                        const pText = Module["getValue"](texts + 4 * i as ptr<ptr<string>>, "*") as ptr<string>
                        const pName = Module["getValue"](names + 4 * i as ptr<ptr<string>>, "*") as ptr<string>
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
            const code = sqlite3_exec(this.pDb, sql, pCallback, 0, ppErrmsg)
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
    }
}
