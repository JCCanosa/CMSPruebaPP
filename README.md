## Instalación y ejecución

#### Clonar reposirotio
~~~
git clone url
cd proyecto
~~~

#### Instalar dependencias
~~~
npm install
~~~

#### Iniciar proyecto
~~~
npm run dev
~~~

#### URL por defecto
http://localhost:3000

## Estructura de carpetas
~~~
/proyecto
  /public            -> estáticos (JS cliente, CSS, imágenes)
  /views             -> plantillas Handlebars
  /webs              -> HTML dinámicos guardados
  webs.json          -> índice de páginas creadas
  myWeb.js           -> componente Node.js (gestor de páginas)
  myWebClient.js     -> componente cliente (consume la REST API)
  server.js          -> configuración Express + rutas

~~~

## Componente Node.js (myweb.js)
Este módulo administra las páginas dinámicas.

~~~
const myWebs = require("./myWeb");

myWebs.list(); 
// => devuelve [{ ruta: 'servicios', file: 'webs/servicios.html' }, ...]

myWebs.new('nosotros', 'webs/nosotros.html');
// => crea archivo y actualiza webs.json

myWebs.edit('nosotros', '<h1>Quiénes somos</h1>');
// => guarda nuevo HTML en webs/nosotros.html

myWebs.delete('nosotros');
// => elimina entrada y archivo

~~~

## API REST
- GET /api/list → devuelve lista de páginas.

- POST /api/new → body { ruta, contenido }.

- POST /api/edit → body { ruta, contenido }.

- DELETE /api/delete/:ruta → elimina página.

## Componente JS para consumir API (mybweb_client.js)
Consume la API, posteriormente se usan los metodos en la vista.

~~~
myWebClient.list();
// => devuelve la lista de páginas

myWebClient.get(ruta);
// => devuelve una página concreta en base a la ruta especificada

myWebClient.new(data);
// => crea una nueva página en base a la ruta y al contenido especificados

myWebClient.edit(ruta, contenido);
// => edita la página especificada en ruta y la actualiza según el nuevo contenido dado.

myWebClient.delete(ruta);
// => borra la página especificada con la ruta

~~~

## Panel de administración

- Listado de páginas → tabla con rutas + botones de editar / borrar.

- Formulario de creación → inputs para ruta y contenido.

- Botón actualizar → vuelve a llamar a list.

- Edición → abre el contenido en textarea, luego client.edit.

## Flujo de ejemplo

- En /admin creas una ruta servicios con el HTML que quieras.

- Se guarda en webs.json y en webs/servicios.html.

- Si navegas a http://localhost:3000/servicios, Express renderiza esa página.

- Desde /admin puedes editar o borrar en cualquier momento.