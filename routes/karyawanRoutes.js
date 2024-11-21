const express = require('express');
const router = express.Router();
const db = require('../database/db'); // Mengimpor koneksi database

// Endpoint untuk mendapatkan semua data karyawan
router.get('/', (req, res) => {
    db.query('SELECT * FROM karyawan', (err, results) => {
        if (err) return res.status(500).send('Internal Server Error');
        res.json(results); // Mengembalikan data karyawan dalam format JSON
    });
});

// Endpoint untuk mendapatkan karyawan berdasarkan ID
router.get('/:id', (req, res) => {
    db.query('SELECT * FROM karyawan WHERE id = ?', [req.params.id], (err, results) => {
        if (err) return res.status(500).send('Internal Server Error');
        if (results.length === 0) return res.status(404).send('Karyawan tidak ditemukan');
        res.json(results[0]); // Mengembalikan satu karyawan yang ditemukan
    });
});

// Endpoint untuk menambahkan karyawan baru
router.post('/', (req, res) => {
    const { nama, jenis_kelamin } = req.body;

    // Validasi input
    if (!nama || nama.trim() === '') {
        return res.status(400).send('Nama tidak boleh kosong');
    }
    if (!jenis_kelamin || !['Laki-laki', 'Perempuan'].includes(jenis_kelamin)) {
        return res.status(400).send('Jenis kelamin harus Laki-laki atau Perempuan');
    }

    // Query untuk menambahkan karyawan ke database
    db.query('INSERT INTO karyawan (nama, jenis_kelamin) VALUES (?, ?)', [nama.trim(), jenis_kelamin], (err, results) => {
        if (err) return res.status(500).send('Internal Server Error');
        
        const newKaryawan = {
            id: results.insertId,
            nama: nama.trim(),
            jenis_kelamin: jenis_kelamin
        };

        res.status(201).json(newKaryawan); // Mengirimkan data karyawan yang baru ditambahkan
    });
});

// Endpoint untuk memperbarui data karyawan berdasarkan ID
router.put('/:id', (req, res) => {
    const { nama, jenis_kelamin } = req.body;
    
    // Validasi input
    if (!nama || nama.trim() === '') {
        return res.status(400).send('Nama tidak boleh kosong');
    }
    if (!jenis_kelamin || !['Laki-laki', 'Perempuan'].includes(jenis_kelamin)) {
        return res.status(400).send('Jenis kelamin harus Laki-laki atau Perempuan');
    }

    // Query untuk memperbarui data karyawan
    db.query('UPDATE karyawan SET nama = ?, jenis_kelamin = ? WHERE id = ?', [nama.trim(), jenis_kelamin, req.params.id], (err, results) => {
        if (err) return res.status(500).send('Internal Server Error');
        if (results.affectedRows === 0) return res.status(404).send('Karyawan tidak ditemukan');

        const updatedKaryawan = { id: req.params.id, nama: nama.trim(), jenis_kelamin: jenis_kelamin };
        res.json({
            message: `Karyawan dengan ID ${req.params.id} telah diperbarui`,
            updatedKaryawan: updatedKaryawan // Mengembalikan karyawan yang telah diperbarui
        });
    });
});

// Endpoint untuk menghapus karyawan berdasarkan ID
router.delete('/:id', (req, res) => {
    db.query('DELETE FROM karyawan WHERE id = ?', [req.params.id], (err, results) => {
        if (err) return res.status(500).send('Internal Server Error');
        if (results.affectedRows === 0) return res.status(404).send('Karyawan tidak ditemukan');

        res.status(204).send(); // Mengirimkan status 204 jika berhasil menghapus karyawan
    });
});

module.exports = router;
