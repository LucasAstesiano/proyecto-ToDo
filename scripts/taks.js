// SEGURIDAD: Si no se encuentra en localStorage info del usuario
// no lo deja acceder a la página, redirigiendo al login inmediatamente.

if (localStorage.length < 1) {
  location.replace('index.html')
}



/* ------ comienzan las funcionalidades una vez que carga el documento ------ */
window.addEventListener('load', function () {

  
  /* ---------------- variables globales y llamado a funciones ---------------- */
  const btnCerrarSesion=this.document.querySelector('#closeApp')
  const formCrearTarea=this.document.querySelector('.nueva-tarea')
  const userName=this.document.querySelector('.user-info p')
  const inputNuevaTarea=this.document.querySelector('#nuevaTarea')
  const btnCrearTarea=this.document.querySelector('.nueva-tarea button')
  const listaTareasPendientes=document.querySelector('.tareas-pendientes')
  const listaTareasFinalizadas=document.querySelector('.tareas-terminadas')
  
  
  const jwt=JSON.parse(this.localStorage.getItem('jwt'))
  
  obtenerNombreUsuario()
  const tarea=consultarTareas()
  
  
  /* -------------------------------------------------------------------------- */
  /*                          FUNCIÓN 1 - Cerrar sesión                         */
  /* -------------------------------------------------------------------------- */

  btnCerrarSesion.addEventListener('click', function () {
    Swal.fire({
      title: 'Desea salir?',
      text: "Se cerrará la sesión",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Salir'
    }).then((result) => {
      if (result.isConfirmed) {
          localStorage.clear()
          location.replace('index.html')
          btnCerrarSesion.setAttribute('disabled','disabled')
          btnCerrarSesion.style.color='grey'
      }
    })
  })
    
    /* -------------------------------------------------------------------------- */
    /*                 FUNCIÓN 2 - Obtener nombre de usuario [GET]                */
    /* -------------------------------------------------------------------------- */
    function obtenerNombreUsuario() {
      
      const endPoint='https://todo-api.ctd.academy/v1/users/getMe'
      
      const config = {
        method: 'GET',
        headers: {
          authorization:jwt
        }
      }
      
      fetch(endPoint,config)
      .then(respuesta=>{
        const jsonUser=respuesta.json()
        return jsonUser
      })
      .then(json=>{
        const user=(json.firstName+' '+json.lastName)
        userName.innerText=user
        console.log(json);
      })
      
    };
    
    
    /* -------------------------------------------------------------------------- */
    /*                 FUNCIÓN 3 - Obtener listado de tareas [GET]                */
    /* -------------------------------------------------------------------------- */

  function consultarTareas() {

    const endPoint='https://todo-api.ctd.academy/v1/tasks'

      const config = {
        method: 'GET',
        headers: {
          authorization:jwt,
          "Content-type": "application/json",
        }
      }

      fetch(endPoint,config)
        .then(respuesta=>{
            const jsonTasks=respuesta.json()
            return jsonTasks
        })
        .then(json=>{
          renderizarTareas(json)
          
        })
        .catch((error)=>{
          console.log('ocurrio un error:',error);
        })        
      
    }


  /* -------------------------------------------------------------------------- */
  /*                    FUNCIÓN 4 - Crear nueva tarea [POST]                    */
  /* -------------------------------------------------------------------------- */

formCrearTarea.addEventListener('submit', function (event) {
    event.preventDefault();
    if (inputNuevaTarea.value=='') {
      Swal.fire({
        title: 'UPS!',
        text: 'No puedes agregar tareas vacias',
        icon: 'error',
      })}else{
      const settings={
        description: inputNuevaTarea.value,
        completed: false
      }
      const endPoint = 'https://todo-api.ctd.academy/v1/tasks';
      const config= {
        method: "POST",
        body: JSON.stringify(settings),
        headers: {
          authorization:jwt,
          'Content-type': 'application/json'
        }
      }
      
      fetch(endPoint, config)
      .then(  respuesta =>  respuesta.json() )
      .then( (json)=> {
        console.log(json);
        consultarTareas()
      })
      .catch( (error) => {  // Si no se cumple
        console.log('ocurrio error' , error);
      })
    }
    });
    
    
    /* -------------------------------------------------------------------------- */
  /*                  FUNCIÓN 5 - Renderizar tareas en pantalla                 */
  /* -------------------------------------------------------------------------- */
  function renderizarTareas(listado) {
    
    listaTareasPendientes.innerHTML="";
    listaTareasFinalizadas.innerHTML="";
    listado.forEach((tarea) => {
      let fecha=new Date(tarea.createdAt)
      if (!tarea.completed) {
        listaTareasPendientes.innerHTML +=
        `<li class='tarea'>
        <button class='change complete'id=${tarea.id} value="${tarea.description}">
        <i class="fa-regular fa-circle"></i>
          </button>
          <div class="descripcion">
            <p class="nombre">${tarea.description}</p>
            <p class='timeStamp'>${fecha.toLocaleDateString()}:${fecha.toLocaleTimeString()}</p>
          </div>
        </li>`
      }else{
        let fecha=new Date(tarea.createdAt)
        listaTareasFinalizadas.innerHTML+= //Html
        `<li class='tarea'>
          <button class='hecha'id=${tarea.id}>
            <i class="fa-regular fa-circle-check"></i>
          </button>
          <div class="descripcion">
          <p class="nombre">${tarea.description}</p>
            <p class='timeStamp'>${fecha.toLocaleDateString()}:${fecha.toLocaleTimeString()}</p>
            <div>
            <button class="change incompleta pendiente" id="${tarea.id}"value="${
              tarea.description}" > 
              <i class="fa-solid fa-rotate-left"  id=${tarea.id}></i>
            </button>
            <button class='borrar'>
              <i class="fa-regular fa-trash-can borrar" id=${tarea.id}></i>
            </button>
            </div>
            </div>
            </li>`
          }
          
          return listaTareasFinalizadas
        });

      //Obtener botones
        const btnEnviarARealizada=document.querySelectorAll('.complete')
        const btnVolverAPendiente=document.querySelectorAll('.pendiente')
        const btnborrar=document.querySelectorAll('.borrar')

      //Enviar a realizadas
        btnEnviarARealizada.forEach(btn => {
          btn.addEventListener('click',function(event){
            event.preventDefault()
            if (btn.id==event.target.id) {
                botonesCambioEstado(event.target.id,true,listado)
              }
          })
        });

      //Enviar a pendientes
        btnVolverAPendiente.forEach(btn => {
          btn.addEventListener('click',function(event){
            event.preventDefault()
            if (btn.id==event.target.id) {
              botonesCambioEstado(event.target.id,false,listado)
            }
          })
        });
        btnborrar.forEach(btn => {
          btn.addEventListener('click',function(event){
            console.log(event);
            console.log(btn);
            if (btn.id==event.target.id) {
              botonBorrarTarea(btn.id)
            }
          })
        });
  };
  
  /* -------------------------------------------------------------------------- */
  /*                  FUNCIÓN 6 - Cambiar estado de tarea [PUT]                 */
  /* -------------------------------------------------------------------------- */
  function botonesCambioEstado(id,estado,listado) {
    const endPoint = 'https://todo-api.ctd.academy/v1/tasks/'+id;

    const settings={
      description: tarea,
      completed: estado
    }
    const config= {
      method: 'PUT',
      body: JSON.stringify(settings),
      headers: {
        authorization:jwt,
        'Content-type': 'application/json'
      }
    }
    
    fetch(endPoint, config)
    .then(  respuesta =>  respuesta.json() )
    .then( (json)=> {
      return json
    })
    .catch(  error => {  // Si no se cumple
      console.log('ocurrio error', error);
      })
    .finally(()=>{
        consultarTareas() 
        renderizarTareas(listado)
    })

  }
  /* -------------------------------------------------------------------------- */
  /*                     FUNCIÓN 7 - Eliminar tarea [DELETE]                    */
  /* -------------------------------------------------------------------------- */
  function botonBorrarTarea(id) {
    
    const endPoint = 'https://todo-api.ctd.academy/v1/tasks/'+id;

    const config= {
      method: 'DELETE',
      headers: {
        authorization:jwt,
      }
    } 
    fetch(endPoint, config)
    .then( (respuesta) =>  respuesta.json() )
    .then(()=> {
      consultarTareas()
    })
    .catch( (error) => {  // Si no se cumple
      console.log('ocurrio error', error);
      })
    
  };
});