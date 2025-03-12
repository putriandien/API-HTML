const { Pool } = require('pg');
const client = new Pool({
    host: 'localhost',
    port: 5432,
    user:"postgres",
    password: "andien",
    database: "pembelian_tiket_kapal"
})
 module.exports = client;