const { Pool } = require('pg')

const pool = new Pool({
  user: 'postgres',
  host: 'database',
  database: 'postgres',
  password: 'example',
  port: 5432,
})


module.exports = {
  query: (text, params, callback) => {
    return pool.query(text, params, (err, res) => {
      if (err) {
        console.log("Error querying database");
        console.log(err)
      } else {
        callback(res)
      }

    })
  },
} 