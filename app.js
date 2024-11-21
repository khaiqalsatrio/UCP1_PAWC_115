const express = require('express');
const todoRoutes = require('./routes/tododb.js');
const karyawanRoutes = require('./routes/karyawanRoutes');
const authRoutes = require('./routes/authRoutes');
const { isAuthenticated } = require('./middlewares/middleware.js');
const expressLayout = require('express-ejs-layouts');
const session = require('express-session');
require('dotenv').config();

// Inisialisasi app terlebih dahulu
const app = express();
const db = require('./database/db.js');
const port = process.env.PORT || 3000;

// Middleware
app.use(express.static('public'));
app.use(expressLayout);
app.use(express.json()); // Middleware untuk parsing JSON request body
app.use(express.urlencoded({ extended: true })); // Middleware untuk parsing URL-encoded data

// Konfigurasi express-session
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }  // Set ke true jika menggunakan HTTPS
}));

// Menambahkan rute
app.use('/todos', todoRoutes);
app.use('/karyawan', karyawanRoutes);
app.use('/', authRoutes);

// Set view engine untuk EJS
app.set('view engine', 'ejs');

// Rute default (home)
app.get('/', isAuthenticated, (req, res) => {
    res.render('index', {
        layout: 'layouts/main-layouts.ejs'
    });
});

// Rute kontak
app.get('/contact', isAuthenticated, (req, res) => {
    res.render('contact', {
        layout: 'layouts/main-layouts.ejs'
    });
});

// Rute untuk melihat todo
app.get('/todo-view', (req, res) => {
    db.query('SELECT * FROM todos', (err, todos) => {
        if (err) return res.status(500).send('Internal Server Error');
        res.render('todo', {
            layout: 'layouts/main-layouts.ejs',
            todos: todos
        });
    });
});

// 404 Page Not Found
app.use((req, res) => {
    res.status(404).send('404 - Page Not Found');
});

// Menjalankan server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
