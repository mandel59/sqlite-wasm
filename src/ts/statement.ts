namespace Module {

    export class Statement {
        private statementHandle: ptr<sqlite3>

        constructor(statementHandle: ptr<sqlite3>) {
            this.statementHandle = statementHandle;
        }

        public get id(): number {
            return this.statementHandle as number;
        }

        getColumnCount(): number {
            return sqlite3_column_count(this.statementHandle);
        }

        step(): SQLiteResult {
            return sqlite3_step(this.statementHandle);
        }

        finalize(): SQLiteResult {
            return sqlite3_finalize(this.statementHandle);
        }

        reset(): SQLiteResult {
            return sqlite3_reset(this.statementHandle);
        }

        getColumnName(index: number): string {
            return sqlite3_column_name(this.statementHandle, index);
        }

        bindText(index: number, value: string): number {
            return sqlite3_bind_text16(this.statementHandle, index, value, -1, <ptr<sqlite3>>0);
        }
    }
}
