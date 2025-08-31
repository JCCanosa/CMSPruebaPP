//Script panel admin
var myWebClient = MyWebsClient;

//Al cargar la página
document.addEventListener('DOMContentLoaded', function(){
    setupEvents();
    loadPages();
});

function loadPages() {
    myWebClient.list((data, error) => {
        if (error) {
            showAlert('Error al cargar las páginas: ' + error.message, 'error');
            return;
        }

        displayPages(data.data || []);
    });
}

//Tabla para mostrar páginas
function displayPages(pages) {
    const tbody = document.getElementById('pageslist');

    if (pages.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" class="text-muted"><em>Aún no hay págias creadas</em></td></tr>'
        return;
    }

    tbody.innerHTML = pages.map(page => `
            <tr>
                <td><strong>/${page.ruta}</strong></td>
                <td>${page.file}</td>
                <td><a href="/${page.ruta}">Ver página</a></td>
                <td>
                    <button class="btn btn-sm btn-warning" onclick="editPage('${page.ruta}')" >Editar</button>
                    <button class="btn btn-sm btn-danger" onclick="deletePage('${page.ruta}')" >Eliminar</button>
                </td>
            </tr>
        `).join('');
}

//Configuracion de eventlistener
function setupEvents(){
    //Boton refresh
    document.getElementById('btn-refresh').addEventListener('click', function(){
        loadPages();
    });

    //Formulario crear páginas
    document.getElementById('page-form').addEventListener('submit', function(e) {
        e.preventDefault();

        const ruta = document.getElementById('ruta').value.trim();
        const contenido = document.getElementById('contenido').value.trim();

        if(!ruta || !contenido){
            showAlert('Por favor completa todos los campos', 'danger');
            return;
        }

        //Crear página.
        myWebClient.new({ruta, contenido}, function (data, error){
            if(error){
                alert('Error creando la página');
                return;
            }
            showAlert('Página creada correactamente', 'success');

            //Limpiar formulario
            document.getElementById('ruta').value = '';
            document.getElementById('contenido').value = '';

            //Recargar las páginas
            loadPages();
        });
    });
}

function editPage(ruta){
    myWebClient.get(ruta, function(data, error){
        if(error){
            showAlert('Error al cargar la página ', 'danger')
            return;
        }

        //Rellenar el textarea con el contenido antes de editar
        document.getElementById('editContenido').value = data.data.contenido;

        //Guardar la ruta en el boton Guardar
        document.getElementById('saveEditBtn').dataset.ruta = ruta;

        //Abrir modal (click botón oculto)
        document.getElementById('editModalBtn').click();
    });
}

//Evento para guardar cambios desde el modal creado en admin.hbs
document.getElementById('saveEditBtn').addEventListener('click', () => {
    const ruta = document.getElementById('saveEditBtn').dataset.ruta;
    const nuevoContenido = document.getElementById('editContenido').value;

    myWebClient.edit(ruta, nuevoContenido, (resp, err) => {
        if(err){
            showAlert('Error al guardar página', 'danger');
            return;
        }

        //Cerrar el modal despues de guardar
        const modal = bootstrap.Modal.getInstance(document.getElementById('editModal'));
        modal.hide;

        showAlert('Página actualizada correctamente', 'success');
        location.reload();
    });
}); 


//Elminar páginas + confirmación
function deletePage(ruta){
    if(!confirm('¿Estás seguro de que quieres eliminar ' + ruta + '?')){
        return;
    }

    myWebClient.delete(ruta, function(data, error){
        if(error){
            showAlert('Error al eliminar la página', 'danger');
            return;
        }

        showAlert(`Página ${ruta}, eliminada correctamente`, 'success');
        loadPages();
    });
}

//Mostar alertas
function showAlert(message, type){
    const alertContainer = document.getElementById('alert-container');

    alertContainer.innerHTML = `
        <div class="alert alert-${type} alert-dissmisible fade show" role="alert">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;

    //Ocultar tras 4 segundos
    setTimeout(function() {
        alertContainer.innerHTML='';
    }, 4000);
}
