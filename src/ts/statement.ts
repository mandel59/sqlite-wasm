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

        getColumnType(index: number): number {
            return sqlite3_column_type(this.statementHandle, index);
        }

        bindText(index: number, value: string): SQLiteResult {
            return sqlite3_bind_text(this.statementHandle, index, value, -1, <ptr<sqlite3>>-1);
        }

        bindInt(index: number, value: number): SQLiteResult {
            return sqlite3_bind_int(this.statementHandle, index, value);
        }

        bindInt64(index: number, value: number): SQLiteResult {
            return sqlite3_bind_int64(this.statementHandle, index, value);
        }

        bindDouble(index: number, value: number): SQLiteResult {
            return sqlite3_bind_double(this.statementHandle, index, value);
        }

        bindNull(index: number): SQLiteResult {
            return sqlite3_bind_null(this.statementHandle, index);
        }

        getColumnInt(index: number): number {
            return sqlite3_column_int(this.statementHandle, index);
        }

        getColumnText(index: number): string {
            return sqlite3_column_text(this.statementHandle, index);
        }
    }
}
