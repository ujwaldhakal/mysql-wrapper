import mysql from 'mysql'

class MysqlWrapper {
    runQuery (sql, params = [], single = true) {

        const connection = mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE
        })

        connection.connect()

        return new Promise((resolve, reject) => {
            connection.query(sql, params, (err, results) => {
                console.log(sql);
                let returnedResult = []

                if (single) {
                    returnedResult = {}
                }

                if (results !== undefined && results.length) {
                    returnedResult = results
                    if (single) {
                        returnedResult = results[0]
                    }
                }

                resolve(returnedResult)
                connection.end()
            })
        })
    }

    async findOneByColumn (table, column, value) {
        const sql = 'select * from ' + table + ' where ' + column + ' = ? limit 1'

        return this.runQuery(sql, [value], 1)
    }

    update (table, changes, where) {
        const sql = `UPDATE ${table} SET ? WHERE ?`
        console.log(changes);
        return this.runQuery(sql, [changes, where])
    }

    statement (sql) {
        return this.runQuery(sql)
    }
}

export default MysqlWrapper
