#include <sqlite3.h>

SQLITE_API int sqlite3_bind_int64ptr(sqlite3_stmt* stmt, int iCol, sqlite3_int64* value) {
	return sqlite3_bind_int64(stmt, iCol, *value);
}

SQLITE_API void sqlite3_column_int64ptr(sqlite3_stmt* stmt, int iCol, sqlite3_int64* outValue) {
	*outValue = sqlite3_column_int64(stmt, iCol);
}
