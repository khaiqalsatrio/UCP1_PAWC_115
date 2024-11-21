const express = require('express');
const router = express.Router();

let karyawan = [
    {
        id: 1, nama: 'Budi', jenis_kelamin: 'Laki-laki'
    },
    {
        id: 2, nama: 'Siti', jenis_kelamin: 'Perempuan'
    },
];

// Endpoint untuk mendapatkan data Karyawan
router.get('/', (req, res) => {
    res.json(karyawan); // Mengambil data karyawan
});

// Endpoint untuk menambahkan Karyawan baru
router.post('/', (req, res) => {
    const newKaryawan = {
        id: karyawan.length + 1, // Menambah id baru berdasarkan panjang array karyawan
        nama: req.body.nama,
        jenis_kelamin: req.body.jenis_kelamin
    };
    karyawan.push(newKaryawan); // Menambah karyawan baru ke dalam array karyawan
    res.status(201).json(newKaryawan); // Mengirimkan respons dengan status 201
});

// Endpoint untuk menghapus Karyawan berdasarkan ID
router.delete('/:id', (req, res) => {
    const karyawanIndex = karyawan.findIndex(k => k.id === parseInt(req.params.id)); // Mencari index berdasarkan ID
    if (karyawanIndex === -1) return res.status(404).json({ message: 'Karyawan tidak ditemukan' }); // Jika tidak ditemukan

    const deletedKaryawan = karyawan.splice(karyawanIndex, 1)[0]; // Menghapus karyawan dari array
    res.status(200).json({ message: `Karyawan '${deletedKaryawan.nama}' telah dihapus` }); // Mengirimkan respons
});

// Endpoint untuk mengupdate Karyawan berdasarkan ID
router.put('/:id', (req, res) => {
    const karyawan = karyawan.find(k => k.id === parseInt(req.params.id)); // Mencari karyawan berdasarkan ID
    if (!karyawan) return res.status(404).json({ message: 'Karyawan tidak ditemukan' }); // Jika tidak ditemukan

    // Mengupdate nama dan jenis_kelamin jika ada data baru di body request
    karyawan.nama = req.body.nama || karyawan.nama;
    karyawan.jenis_kelamin = req.body.jenis_kelamin || karyawan.jenis_kelamin;

    res.status(200).json({
        message: `Karyawan dengan ID ${karyawan.id} telah diperbarui`,
        updatedKaryawan: karyawan // Mengirimkan data yang telah diperbarui
    });
});

module.exports = router;
