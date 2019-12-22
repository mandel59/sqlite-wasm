#include <sqlite3.h>
int glue_sqlite3_db_config_int_pint(sqlite3 *db, int op, int value, int *ret_val)
{
    return sqlite3_db_config(db, op, value, ret_val);
}
