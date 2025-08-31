const fs = require('fs');
const path = require('path');

const myWeb = {
    //Rutas para json de rutas y archivos html
    dataFile: path.join(__dirname, '../data/webs.json'),
    webFolder: path.join(__dirname, '../web'),

    init: function () {
        //Crear carpeta web si no existe
        if (!fs.existsSync(this.webFolder)) {
            fs.mkdirSync(this.webFolder, { recursive: true });
        }

        //Crear archivo web.json si no existe
        if (!fs.existsSync(this.dataFile)) {
            const data = { webs: [] };
            fs.writeFileSync(this.dataFile, JSON.stringify(data, null, 2));
        }
    },

    //Crear paginas nuevas
    new: function (ruta, contenido) {
        try {
            // Leer el archivo de rutas
            const data = fs.readFileSync(this.dataFile, 'utf-8');
            const jsonData = JSON.parse(data);

            //Verificar que no existe la ruta que se va a crear
            const exists = jsonData.webs.find(web => web.ruta === ruta);
            if (exists) {
                return { success: false, message: 'La ruta ya existe' };
            }

            //Crear nombre archivo HTML
            const fileName = `${ruta}.html`;
            const filePath = path.join(this.webFolder, fileName);

            //Guardar el contenido del HTML
            fs.writeFileSync(filePath, contenido, 'utf-8');

            //Incluir ruta en webs.json
            jsonData.webs.push({
                ruta: ruta,
                file: `web/${fileName}`
            });

            fs.writeFileSync(this.dataFile, JSON.stringify(jsonData, null, 2));
            return { success: true, message: `Página ${ruta} creada correctamente` };

        } catch (error) {
            return { success: false, message: 'Error al crear página' };
        }
    },

    //Listado de páginas
    list: function () {
        try {
            // Leer el archivo de rutas
            const data = fs.readFileSync(this.dataFile, 'utf-8');
            const jsonData = JSON.parse(data);
            return jsonData.webs;

        } catch (error) {
            return [];
        }
    },

    //Obtener una pagina
    get: function (ruta) {
        try {
            // Leer el archivo de rutas
            const data = fs.readFileSync(this.dataFile, 'utf-8');
            const jsonData = JSON.parse(data);

            const web = jsonData.webs.find(w => w.ruta === ruta);
            if (!web) {
                return null;
            }

            //Recuperar la página
            const filePath = path.join(__dirname, '..', web.file);
            const content = fs.readFileSync(filePath, 'utf-8');
            return content;

        } catch (error) {
            return null;
        }
    },

    //Editar contenido de una página
    edit: function (ruta, nuevoContenido) {
        try {
            // Leer el archivo de rutas
            const data = fs.readFileSync(this.dataFile, 'utf-8');
            const jsonData = JSON.parse(data);

            const web = jsonData.webs.find(w => w.ruta === ruta);
            if (!web) {
                return { success: false, message: 'Página no encontrada' };
            }

            //Recuperar la página
            const filePath = path.join(__dirname, '..', web.file);
            fs.writeFileSync(filePath, nuevoContenido, 'utf-8');
            console.log(`${ruta} editada correctemente`);
            return { success: true, message: 'Página editada correctamente' };

        } catch (error) {
            return { success: false, message: 'Error al editar la página' };
        }
    },

    //Eliminar página según ruta
    delete: function (ruta) {
        try {
            // Leer el archivo de rutas
            const data = fs.readFileSync(this.dataFile, 'utf-8');
            const jsonData = JSON.parse(data);

            const webIndex = jsonData.webs.findIndex(w => w.ruta === ruta);
            if (webIndex === -1) {
                return { success: false, message: 'Página no encontrada' };
            }

            const web = jsonData.webs[webIndex];
            const filePath = path.join(__dirname, '..', web.file);

            //Eliminar archivo
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }

            //Elminiar ruta de la lista
            jsonData.webs.splice(webIndex, 1);
            fs.writeFileSync(this.dataFile, JSON.stringify(jsonData, null, 2));
            console.log(`${ruta} eliminada`);
            return { success: true, message: 'Página eliminada correctamente' };

        } catch (error) {
            return { success: false, message: 'Error al eliminar la página' };
        }
    }

}

module.exports = myWeb;