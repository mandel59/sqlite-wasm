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
        private static synchronizing: boolean = false;

        public static enablePersistence(path: string) {

            // Arbirary path to avoid conflicts with existing persisted mount points
            FS.mkdir("/sqlite");
            FS.mount(IDBFS, {}, "/sqlite");

            FS.syncfs(true,
                err => {
                    if (err) {
                        console.error(`Error synchronizing filsystem from IndexDB: ${err}`);
                    }
                }
            );
        }

        //
        // Database-related apis
        //
        public static open(fileName: string, data: Uint8Array, options: ConnectionOptions = {}): DatabaseOpenResult {

            const opts = this.buildOptions(options);
            var fullPath = "/sqlite/" + fileName;
            const uri = `file:${encodeURI(fullPath)}${opts ? "?" + opts : ""}`

            if (data) {
                FS.writeFile(fullPath, data, { encoding: 'binary', flags: "w" });
            }

            const stack = stackSave()
            const ppDb = stackAlloc<ptr<sqlite3>>(4)
            const code = sqlite3_open(uri, ppDb)
            const pDb = Module["getValue"](ppDb, "*")
            stackRestore(stack)

            if (pDb !== 0) {
                Database.fileMap[pDb] = fullPath;
            }

            return new DatabaseOpenResult(pDb as ptr<sqlite3>, code);
        }

        public static open_v2(fileName: string, data: Uint8Array, flags: number, vfs: string) {

            var fullPath = "/sqlite/" + fileName;

            const stack = stackSave()
            const ppDb = stackAlloc<ptr<sqlite3>>(4)
            const code = sqlite3_open_v2(fullPath, ppDb, flags, vfs)
            const pDb = Module["getValue"](ppDb, "*")
            stackRestore(stack)

            if (pDb !== 0) {
                Database.fileMap[pDb] = fullPath;
            }

            return new DatabaseOpenResult(pDb as ptr<sqlite3>, code);
        }

        static libversion_number(): number {
            return sqlite3_libversion_number();
        }

        static close_v2(pDb: ptr<sqlite3>, exportData: boolean = false): DatabaseCloseResult {

            var res = sqlite3_close_v2(pDb);

            Database.persist();

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

        static db_filename(pDb: ptr<sqlite3>, zDBName: string): string {
            return sqlite3_db_filename(pDb, zDBName);
        }

        static prepare2(pDb: ptr<sqlite3>, sql: string): DatabasePrepareResult {

            const stack = stackSave()
            const ppStatement = stackAlloc<ptr<sqlite3_stmt>>(4)
            const ppTail = stackAlloc<ptr<string>>(4)

            var lengthSql = Module.lengthBytesUTF8(sql);
            var pSql = Module._malloc(lengthSql + 1) as ptr<string>;

            try {
                Module.stringToUTF8(sql, pSql, lengthSql + 1);

                const code = sqlite3_prepare2(pDb, pSql, -1, ppStatement, ppTail);

                const pTail = Module["getValue"](ppTail, "*");

                // Compute the tail index from the pointers diff, so we can rebuild the string later
                var tailIndex = pTail - pSql;

                const statementHandle = Module["getValue"](ppStatement, "*")
                stackRestore(stack)

                return new DatabasePrepareResult(statementHandle as ptr<sqlite3_stmt>, code, tailIndex);
            }
            finally {
                Module._free(pSql);
            }
        }

        static changes(pDb: ptr<sqlite3>): number {
            return sqlite3_changes(pDb);
        }

        static last_insert_rowid(pDb: ptr<sqlite3>): number {
            return sqlite3_last_insert_rowid(pDb);
        }

        static errcode(pDb: ptr<sqlite3>): number {
            return sqlite3_errcode(pDb);
        }

        static extended_errcode(pDb: ptr<sqlite3>): number {
            return sqlite3_extended_errcode(pDb);
        }

        static extended_result_codes(pDb: ptr<sqlite3>, onoff: number): number {
            return sqlite3_extended_result_codes(pDb, onoff);
        }

        static busy_timeout(pDb: ptr<sqlite3>, ms: number): number {
            return sqlite3_busy_timeout(pDb, ms);
        }

        static persist(): void {
            if (!Database.synchronizing) {
                Database.synchronizing = true;

                FS.syncfs(
                    err => {
                        Database.synchronizing = false;
                        if (err) {
                            console.error(`Error synchronizing filsystem from IndexDB: ${err}`);
                        }
                    }
                );
            }
        }

        //
        // Statement-related apis
        //
        static column_count(pStatement: ptr<sqlite3_stmt>): number {
            return sqlite3_column_count(pStatement);
        }

        static bind_parameter_count(pStatement: ptr<sqlite3_stmt>): number {
            return sqlite3_bind_parameter_count(pStatement);
        }

        static step(pStatement: ptr<sqlite3_stmt>): SQLiteResult {
            return sqlite3_step(pStatement);
        }

        static stmt_readonly(pStatement: ptr<sqlite3_stmt>): SQLiteResult {
            return sqlite3_stmt_readonly(pStatement);
        }

        static finalize(pStatement: ptr<sqlite3_stmt>): SQLiteResult {
            var res = sqlite3_finalize(pStatement);
            Database.persist();
            return res;
        }

        static reset(pStatement: ptr<sqlite3_stmt>): SQLiteResult {
            return sqlite3_reset(pStatement);
        }

        static column_name(pStatement: ptr<sqlite3_stmt>, index: number): string {
            return sqlite3_column_name(pStatement, index);
        }

        static column_type(pStatement: ptr<sqlite3_stmt>, index: number): number {
            return sqlite3_column_type(pStatement, index);
        }

        static column_bytes(pStatement: ptr<sqlite3_stmt>, index: number): number {
            return sqlite3_column_bytes(pStatement, index);
        }

        static bind_text(pStatement: ptr<sqlite3_stmt>, index: number, value: string): SQLiteResult {
            return sqlite3_bind_text(pStatement, index, value, -1, <ptr<sqlite3>>-1);
        }

        static bind_int(pStatement: ptr<sqlite3_stmt>, index: number, value: number): SQLiteResult {
            return sqlite3_bind_int(pStatement, index, value);
        }

        static bind_int64(pStatement: ptr<sqlite3_stmt>, index: number, value: Uint8Array): SQLiteResult {
            return sqlite3_bind_int64ptr(pStatement, index, value);
        }

        static bind_double(pStatement: ptr<sqlite3_stmt>, index: number, value: number): SQLiteResult {
            return sqlite3_bind_double(pStatement, index, value);
        }

        static bind_null(pStatement: ptr<sqlite3_stmt>, index: number): SQLiteResult {
            return sqlite3_bind_null(pStatement, index);
        }

        static bind_parameter_index(pStatement: ptr<sqlite3_stmt>, name: string): number {
            return sqlite3_bind_parameter_index(pStatement, name);
        }

        static bind_blob(pStatement: ptr<sqlite3_stmt>, index: number, value: Uint8Array, length: number): SQLiteResult {

            var data = Module._malloc(length);

            try {
                for (var i = 0; i < length; i++) {
                    Module.HEAPU8[data + i] = value[i];
                }

                return sqlite3_bind_blob(pStatement, index, data, length, -1/* SQLITE_TRANSIENT*/);
            }
            finally {
                Module._free(data);
            }
        }

        static column_int(pStatement: ptr<sqlite3_stmt>, index: number): number {
            return sqlite3_column_int(pStatement, index);
        }

        static column_double(pStatement: ptr<sqlite3_stmt>, index: number): number {
            return sqlite3_column_double(pStatement, index);
        }

        static column_int64ptr(pStatement: ptr<sqlite3_stmt>, index: number): Uint8Array {

            var data = Module._malloc(8);

            try {

                sqlite3_column_int64ptr(pStatement, index, data);

                var output = new Uint8Array(8);
                for (var i = 0; i < 8; i++) {
                    output[i] = Module.HEAPU8[data + i];
                }
                return output;
            }
            finally {
                Module._free(data);
            }
        }

        static column_blob(pStatement: ptr<sqlite3_stmt>, index: number): Uint8Array {
            var ptr = sqlite3_column_blob(pStatement, index);
            var size = sqlite3_column_bytes(pStatement, index);

            var output = new Uint8Array(size);

            for (var i = 0; i < size; i ++) {
                output[i] = Module.HEAPU8[ptr + i];
            }

            return output;
        }

        static column_text(pStatement: ptr<sqlite3_stmt>, index: number): string {
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
        public readonly pStatement: ptr<sqlite3_stmt>;
        public readonly Result: SQLiteResult;
        public readonly TailIndex: number;

        constructor(pStatement: ptr<sqlite3_stmt>, result: SQLiteResult, tailIndex: number) {
            this.Result = result;
            this.pStatement = pStatement;
            this.TailIndex = tailIndex;
        }
    }
}