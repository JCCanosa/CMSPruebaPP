const express = require('express');
const router = express.Router();
const myWeb = require('../components/myweb');

//Get api/list - listado de páginas
router.get('/list', (req, res) => {
    try {
        //Recuperamos todas las páginas
        const pages = myWeb.list();
        res.json({
            success: true,
            data: pages,
            message: `Actualmente hay ${pages.length} páginas`
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Error en el servidor',
            message: error.message
        });
    }
});

//Get api/get/:ruta - obtener contenido de una página
router.get('/get/:ruta', (req, res) => {
    const ruta = req.params.ruta;

    try {
        const contenido = myWeb.get(ruta);

        if (contenido != null) {
            res.json({
                success: true,
                data: {
                    ruta: ruta,
                    contenido: contenido
                },
                message: 'Página encontrada'
            });

        } else {
            res.status(404).json({
                success: false,
                error: 'Página no encontada',
                message: error.message
            })
        }

    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Error en el servidor',
            message: error.message
        });
    }
});

//Post api/new - añadir nuevas páginas
router.post('/new', (req, res) => {
    //Obtener datos del body enviado por form
    const { ruta, contenido } = req.body;

    //Validacion de datos
    if (!ruta || !contenido) {
        return res.status(400).json({
            success: false,
            error: 'Faltan datos',
            message: 'Todos los campos deben estar completos'
        });
    }

    //Validar que la ruta sea correcta, sin caracteres extraños
    if (!/^[a-zA-Z0-9_-]+$/.test(ruta)) {
        return res.status(400).json({
            success: false,
            error: 'Ruta no válida',
            message: 'La ruta no puede tener caracteres especiales'
        });
    }

    try {
        const result = myWeb.new(ruta, contenido);

        if (result.success) {
            res.status(200).json({
                success: true,
                data: { ruta: ruta },
                message: result.message
            });

        } else {
            res.status(400).json({
                success: false,
                error: 'Error al crear la página',
                message: result.message
            });
        }

    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Error en el servidor',
            message: error.message
        });
    }
});

//Put api/edit/:ruta - editar página segun ruta existente
router.put('/edit/:ruta', (req, res) => {
    const ruta = req.params.ruta;
    const {contenido} = req.body;

    if (!contenido) {
        return res.status(400).json({
            success: false,
            error: 'Falta contenido',
            message: 'Debe introducir el contenido'
        });
    }

    try {
        const result = myWeb.edit(ruta, contenido);

        if(result.success){
            res.json({
                success: true,
                data: {ruta: ruta},
                message: result.message
            });

        } else {
            res.status(404).json({
                success: false,
                error: 'No se pudo actualizar la página',
                message: result.message
            });
        }

    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Error en el servidor',
            message: error.message
        });
    }
});

//DELETE api/delete/:ruta - eliminar página segun ruta
router.delete('/delete/:ruta', (req, res) => {
    const ruta = req.params.ruta;

    try {
        const result = myWeb.delete(ruta);

        if(result.success){
            res.json({
                success: true,
                data: {ruta: ruta},
                message: result.message
            });

        } else {
            res.status(404).json({
                success: false,
                error: 'No se puede eliminar la página',
                message: result.message
            });
        }

    } catch (error) {
                res.status(500).json({
            success: false,
            error: 'Error en el servidor',
            message: error.message
        });
    }
});

module.exports = router;