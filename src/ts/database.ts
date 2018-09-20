namespace Module {

    interface ConnectionOptions {
        "vfs"?: string
        "mode"?: "ro" | "rw" | "rwc" | "memory"
        "cache"?: "shared" | "private"
        "psow"?: boolean
        "nolock"?: boolean
        "immutable"?: boolean
    }

    export class Database {

        private static fileMap: { [instance: number]: string } = {};

        //
        // Database-related apis
        //
        public static open(data: Uint8Array, options: ConnectionOptions = {}): DatabaseOpenResult {

            const opts = this.buildOptions(options);
            const filename = '/dbfile_' + (0xffffffff * Math.random() >>> 0);
            const uri = `file:${encodeURI(filename)}${opts ? "?" + opts : ""}`

            if (data) {
                FS.writeFile(filename, data, { encoding: 'binary', flags: "w" });
            }

            const stack = stackSave()
            const ppDb = stackAlloc<ptr<sqlite3>>(4)
            const code = sqlite3_open(filename, ppDb)
            const pDb = Module["getValue"](ppDb, "*")
            stackRestore(stack)

            FS.lstat

            if (code == 0) {
                Database.fileMap[pDb] = filename;
            }

            return new DatabaseOpenResult(pDb as ptr<sqlite3>, code);
        }

        static libversion_number(): number {
            return sqlite3_libversion_number();
        }

        static close_v2(pDb: ptr<sqlite3>, exportData: boolean = false): DatabaseCloseResult {

            var res = sqlite3_close_v2(pDb);

            try {
                if (exportData) {
                    var fileName = Database.fileMap[pDb];

                    if (!fileName) {
                        throw `Unknown database instance ${pDb}`;
                    }

                    const binaryDb = FS.readFile(fileName, { encoding: 'binary', flags: "r" });

                    return new DatabaseCloseResult(binaryDb, res);
                }
                else {
                    return new DatabaseCloseResult(null, res);
                }
            }
            finally {
                delete Database.fileMap[pDb];
            }
        }

        static errmsg(pDb: ptr<sqlite3>): string {
            return sqlite3_errmsg(pDb);
        }

        static prepare2(pDb: ptr<sqlite3>, sql: string): DatabasePrepareResult {

            const stack = stackSave()
            const ppStatement = stackAlloc<ptr<sqlite3>>(4)
            const code = sqlite3_prepare2(pDb, sql, -1, ppStatement, <ptr<sqlite3>>0);

            const statementHandle = Module["getValue"](ppStatement, "*")
            stackRestore(stack)

            return new DatabasePrepareResult(statementHandle as ptr<sqlite3>, code);
        }

        static changes(pDb: ptr<sqlite3>): number {
            return sqlite3_changes(pDb);
        }

        static last_insert_rowid(pDb: ptr<sqlite3>): number {
            return sqlite3_last_insert_rowid(pDb);
        }

        //
        // Statement-related apis
        //
        static column_count(pStatement: ptr<sqlite3>): number {
            return sqlite3_column_count(pStatement);
        }

        static step(pStatement: ptr<sqlite3>): SQLiteResult {
            return sqlite3_step(pStatement);
        }

        static finalize(pStatement: ptr<sqlite3>): SQLiteResult {
            return sqlite3_finalize(pStatement);
        }

        static reset(pStatement: ptr<sqlite3>): SQLiteResult {
            return sqlite3_reset(pStatement);
        }

        static column_name(pStatement: ptr<sqlite3>, index: number): string {
            return sqlite3_column_name(pStatement, index);
        }

        static column_type(pStatement: ptr<sqlite3>, index: number): number {
            return sqlite3_column_type(pStatement, index);
        }

        static bind_text(pStatement: ptr<sqlite3>, index: number, value: string): SQLiteResult {
            return sqlite3_bind_text(pStatement, index, value, -1, <ptr<sqlite3>>-1);
        }

        static bind_int(pStatement: ptr<sqlite3>, index: number, value: number): SQLiteResult {
            return sqlite3_bind_int(pStatement, index, value);
        }

        static bind_int64(pStatement: ptr<sqlite3>, index: number, value: number): SQLiteResult {
            return sqlite3_bind_int64(pStatement, index, value);
        }

        static bind_double(pStatement: ptr<sqlite3>, index: number, value: number): SQLiteResult {
            return sqlite3_bind_double(pStatement, index, value);
        }

        static bind_null(pStatement: ptr<sqlite3>, index: number): SQLiteResult {
            return sqlite3_bind_null(pStatement, index);
        }

        static column_int(pStatement: ptr<sqlite3>, index: number): number {
            return sqlite3_column_int(pStatement, index);
        }

        static column_text(pStatement: ptr<sqlite3>, index: number): string {
            return sqlite3_column_text(pStatement, index);
        }

        private static buildOptions(options: ConnectionOptions): string {
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

    export class DatabaseOpenResult {
        public readonly pDB: ptr<sqlite3>;
        public readonly Result: SQLiteResult;

        constructor(pDB: ptr<sqlite3>, result: SQLiteResult) {
            this.Result = result;
            this.pDB = pDB;
        }
    }

    export class DatabaseCloseResult {
        public readonly Result: SQLiteResult;
        public readonly Data: Uint8Array | null;

        constructor(data: Uint8Array | null, result: SQLiteResult) {
            this.Result = result;
            this.Data = data;
        }
    }

    export class DatabasePrepareResult {
        public readonly pStatement: ptr<sqlite3>;
        public readonly Result: SQLiteResult;

        constructor(pStatement: ptr<sqlite3>, result: SQLiteResult) {
            this.Result = result;
            this.pStatement = pStatement;
        }
    }
}