namespace Module {
    export declare var onRuntimeInitialized: () => void
    Module["onRuntimeInitialized"] = function () {
        const conn1 = new Connection("db", { mode: "memory", cache: "shared" })
        const conn2 = new Connection("db", { mode: "memory", cache: "shared" })
        Module["print"](conn1.uri)
        conn1.exec(`create table t (x, y); insert into t values (1, 2), (3, 4);`)
        conn2.exec(`select * from t;`, (columns) => {
            Module["print"](JSON.stringify(columns))
        })

        conn1.close()
        conn2.close()
    }
}