window.addEventListener('load', function () {
    /* ---------------------- obtenemos variables globales ---------------------- */
   const formulario=this.document.querySelector('form')
   const inputEmail=this.document.querySelector('#inputEmail')  
   const inputContraseña=this.document.querySelector('#inputPassword')
   const button=this.document.querySelector('button')
   const endPoint='https://todo-api.ctd.academy/v1/users/login'    


    /* -------------------------------------------------------------------------- */
    /*            FUNCIÓN 1: Escuchamos el submit y preparamos el envío           */
    /* -------------------------------------------------------------------------- */
    formulario.addEventListener('submit', function (event) {
        event.preventDefault()
        btnOf()
        let datos=obtenerDatosUsuario()
        const config = {
            method: 'POST',
            body: JSON.stringify(datos),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            }
        }
        realizarLogin(config)
        



    });


    /* -------------------------------------------------------------------------- */
    /*                     FUNCIÓN 2: Realizar el login [POST]                    */
    /* -------------------------------------------------------------------------- */
    function realizarLogin(settings) {

        fetch(endPoint, settings)
        .then(  respuesta =>  respuesta.json() )
        .then( (json)=> {
            console.log(json);
            if( json.jwt ) {
                // Guardo en el localStorage el token
                localStorage.setItem('jwt', JSON.stringify(json.jwt));
                location.replace('mis-tareas.html');
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Datos incorrectos',
                    
                  })
            }
        })
        .catch(  error => {  // Si no se cumple
            console.log('ocurrio error' , error);
        })
        .finally(()=>{
            console.log('FINALIZO EL ENVIO');
            btnOn()
        })




        
    };
    function obtenerDatosUsuario() {
        console.log('obtener datos');
            const datos = {
                email: inputEmail.value,
                password: inputContraseña.value  
            }
            datos.email.add=(inputEmail.value)
            datos.password.add=(inputContraseña.value)
            console.log(datos);
            return datos
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