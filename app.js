const express = require('express');
const hbs = require('hbs');
const path = require('path');
const apiRoutes = require('./routes/api');
const myWeb = require('./components/myweb');

const app = express();
const PORT = 3000;
myWeb.init();

//Middleware para parseo de JSon en formularios
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//Uso de routes para la api
app.use('/api', apiRoutes);

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
    //Obtener lista de páginas para mostrar en admin
    const pages = myWeb.list();

    res.render('admin', {
        titulo: 'Pandel Administración CMS',
        layout: 'layouts/main',
        isAdmin: true,
        pages: pages
    });
});

app.get('/:ruta', (req,res) => {
    const ruta = req.params.ruta;
    const contenido = myWeb.get(ruta);

    if(contenido){
        //Si se encuentra la página se renderiza dynamic con su info
        res.render('dynamic', {
            titulo: `${ruta.charAt(0).toUpperCase() + ruta.slice(1)} - CMS`,
            contenido: contenido,
            isAdmin: false
        });

    } else {
        //Si no se encuentra se renderiza 404
        res.status(404).render('404', {
            titulo: '404 - Página no encontrada',
            ruta: ruta,
            isAdmin: false
        });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en ${PORT}`);
});