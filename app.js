const express = require('express');
const hbs = require('hbs');
const path = require('path');

const app = express();
const PORT = 3000;

//Configuración de handlebars
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
app.set('view options', {layout: 'layouts/main'});
hbs.registerPartials(path.join(__dirname, 'views/partials'));

//Ruta principal
app.get('/', (req, res) => {
    res.render('main', {
        titulo: 'Página principal CMS',
        layout: 'layouts/main',
        isAdmin: false
    });
});

//Ruta admin
app.get('/admin', (req, res) => {
    res.render('admin', {
        titulo: 'Pandel Administración CMS',
        layout: 'layouts/main',
        isAdmin: true
    });
});


app.listen(PORT, () => {
    console.log(`Servidor corriendo en ${PORT}`);
});