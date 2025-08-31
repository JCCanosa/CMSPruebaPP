//Componente JS para consumir la API
const MyWebsClient = {
    //Configuración
    config: {
        baseUrl: '/api',
        timeout: 5000
    },

    //Metodo helper para la peticiones fetch
    _request: async function (endpoint, options = {}) {
        const url = this.config.baseUrl + endpoint;
        const defaultOptions = {
            headers: {
                'Conten-Type': 'application/json'
            }
        };

        const finalOptions = { ...defaultOptions, ...options };

        try {
            const response = await fetch(url, finalOptions);
            const data = await response.json();

            if (response.ok) {
                return data;
            } else {
                throw new Error(data.message || 'Error en la petición');
            }

        } catch (error) {
            throw error
        }
    },

    //Listar todas las páginas
    list: async function (callback) {
        try {
            const response = await this._request('/list');

            if (callback && typeof callback === 'function') {
                callback(response, null);
            }

            return response;
        } catch (error) {
            if (callback && typeof callback === 'function') {
                callback(null, error);
            }
            throw error;
        }
    },

    //Obtener una página especifica
    get: async function (ruta, callback) {
        try {
            const response = await this._request(`/get/${ruta}`);

            if (callback && typeof callback === 'function') {
                callback(response, null);
            }
            return response;

        } catch (error) {
            if (callback && typeof callback === 'function') {
                callback(null, error);
            }
            throw error;
        }
    },

    //Crear nueva página
    new: async function (data, callback) {
        const { ruta, contenido } = data;

        if (!ruta || !contenido) {
            const error = new Error('Los campos ruta y contenido son obligatorios');
            if (callback && typeof callback === 'function') {
                callback(null, error);
            }
            throw error;
        }

        try {
            const response = await this._request('/new', {
                method: 'POST',
                body: JSON.stringify({ ruta, contenido })
            });

            if (callback && typeof callback === 'function') {
                callback(response, null);
            }
            return response;

        } catch (error) {
            if (callback && typeof callback === 'function') {
                callback(null, error);
            }
            throw error;
        }
    },

    //Editar página
    edit: async function (ruta, contenido, callback) {
        if (!ruta || !contenido) {
            const error = new Error('El campo contenido es obligatorio');
            if (callback && typeof callback === 'function') {
                callback(null, error);
            }
            throw error;
        }

        try {
            const response = await this._request(`/edit/${ruta}`, {
                method: 'PUT',
                body: JSON.stringify({ contenido })
            });

            if (callback && typeof callback === 'function') {
                callback(response, null);
            }
            return response;

        } catch (error) {
            if (callback && typeof callback === 'function') {
                callback(null, error);
            }
            throw error;
        }
    },

    //Elminiar páginas
    delete: async function (ruta, callback) {
        if (!ruta) {
            const error = new Error('Se requiere la ruta');
            if (callback && typeof callback === 'function') {
                callback(null, error);
            }
            throw error;
        }

        try {
            const response = await this._request(`/delete/${ruta}`, {
                method: 'DELETE'
            });

            if (callback && typeof callback === 'function') {
                callback(response, null);
            }
            return response;

        } catch (error) {
            if (callback && typeof callback === 'function') {
                callback(null, error);
            }
            throw error;
        }
    }
};

//Hacer disponible globalmente
if(typeof window !== 'undefined'){
    window.MyWebsClient = MyWebsClient;
}