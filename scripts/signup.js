window.addEventListener('load', function () {
    /* ---------------------- obtenemos variables globales ---------------------- */
    const form=document.querySelector('form')
    const button=document.querySelector('button')
    const inputNombre=document.querySelector('#inputNombre')
    const inputApellido=document.querySelector('#inputApellido')
    const inputEmail=document.querySelector('#inputEmail')
    const inputContraseña=document.querySelector('#inputPassword')
    const inputRepetirContraseña=document.querySelector('#inputPasswordRepetida')
    const endPoint='https://todo-api.ctd.academy/v1/users'   
 
    
    /* -------------------------------------------------------------------------- */
    /*            FUNCIÓN 1: Escuchamos el submit y preparamos el envío           */
    /* -------------------------------------------------------------------------- */
    form.addEventListener('submit', function (event) {
        event.preventDefault()
        btnOf()
        let datos=obtenerDatosUsuario()
            const config = {
                method: 'POST',
                body: JSON.stringify(datos ),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                }
            }

            realizarRegister(config);
    });
    
    /* -------------------------------------------------------------------------- */
    /*                    FUNCIÓN 2: Realizar el signup [POST]                    */
    /* -------------------------------------------------------------------------- */
    function realizarRegister(settings) {
        fetch(endPoint, settings)
        .then(  respuesta =>  respuesta.json() )
        .then( (json)=> {
        
            if( json.jwt && json!='El usuario ya se encuentra registrado') {
                // Guardo en el localStorage el toke
                localStorage.setItem('jwt', JSON.stringify(json.jwt));
                location.replace('mis-tareas.html');
            }else if(json=='El usuario ya se encuentra registrado'){
                Swal.fire({
                    title: 'UPS!',
                    text: json,
                    icon: 'error',
                  });
            }
        })
        .finally(()=>{
            console.log('FINALIZO EL ENVIO');
            btnOn()
        })
        
    };
    function obtenerDatosUsuario() {
        console.log('obtener datos');
        (validarTexto(inputNombre.value,'n')),
        (validarTexto(inputApellido.value,'a')),
        (validarEmail(inputEmail.value)),
        (validarContrasenia(inputContraseña.value)),
        (compararContrasenias(inputContraseña.value,inputRepetirContraseña.value))
        if(errores.length<1){
            const datos = {
                firstName : (inputNombre.value),
                lastName: (inputApellido.value),
                email: inputEmail.value,
                password: inputContraseña.value  
            }
            console.log(datos);
            return datos
        }else{ 
            
            Swal.fire({
                title: 'UPS!',
                text: errores,
                icon: 'error',
              })
              errores=[]
        }
    }
    function btnOf() {
        button.setAttribute('disabled','disabled')
        button.style.color='grey'
    }
    function btnOn() {
        button.removeAttribute('disabled')
        button.style.color='white'
    }
    
    
    
    
});
