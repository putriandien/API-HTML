const express = require('express'); //framework untuk membuat server
const bodyParser = require('body-parser'); //untuk membaca data json
const pool = require('./db');//koneksi ke database 
const app = express(); //koneksi ke PostgreeSQL
const cors = require('cors') //Mengizinkan akses dari domain berbeda.

app.use(bodyParser.json());
app.use(cors())
app.listen(5000, () => console.log("Server berjalan di http://localhost:5000"));

pool.connect(err => {
    if (err) {
        console.log(err.message);
    } else {
        console.log('Connected to the database');
    }
});


app.get('/admin', (req, res) => {
    pool.query("SELECT * FROM admin ORDER BY admin_id ASC", (err, results) => {
        if (err) {
            res.send(err.message)
        } else {
            res.send(results.rows)
        }
    })
})


app.get('/admin/:admin_id', (req, res) => {
    const { admin_id } = req.params
    pool.query(`select * from admin where admin_id = '${admin_id}'`, (err, results) => {
        if (err) {
            res.send(err.message)
        } else {
            res.send(results.rows)
        }
    })
})


// Tambah Admin
app.post('/admin', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Dapatkan daftar semua ID yang ada
        const idResults = await pool.query("SELECT admin_id FROM admin ORDER BY admin_id ASC");
        const existingIds = idResults.rows.map(row => row.admin_id);

        let newId = 100; // Default jika tabel kosong

        // Cari ID yang hilang dalam urutan
        for (let i = 100; i <= Math.max(...existingIds, 100); i++) {
            if (!existingIds.includes(i)) {
                newId = i;
                break;
            }
        }

        const result = await pool.query(
            "INSERT INTO admin (admin_id, name, email, password) VALUES ($1, $2, $3, $4) RETURNING admin_id",
            [newId, name, email, password]
        );

        res.send(`Insert Success, Admin ID: ${result.rows[0].admin_id}`);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.put('/admin/:admin_id', (req, res) => {
    const { name, email, password } = req.body
    const { admin_id } = req.params

    pool.query(`update admin set name = '${name}', email = '${email}', password = '${password}' where admin_id = '${admin_id}'`, (err, result) => {
        if (err) {
            res.send(err.message)
        } else {
            res.send('Update Success')
        }
    })
})

app.delete('/admin/:admin_id', (req, res) => {
    const { admin_id } = req.params;

    pool.query(`delete from admin where admin_id = '${admin_id}'`, (err, result) => {
        if (err) {
            res.send(err.message);
        } else {
            res.send('Delete Success');
        }
    });
})