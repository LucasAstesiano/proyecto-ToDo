/* ---------------------------------- texto --------------------------------- */
let errores=[]
function validarTexto(texto,x) {
    if ((isNaN(texto)) && texto.length>4) {
        return true
    }
    else if(x=='n'){
     errores.push('Nombre invalido')
    }else errores.push('Apellido invalido')
}

function normalizarTexto(texto) {
    
}

/* ---------------------------------- email --------------------------------- */
function validarEmail(valor) {
    if ( /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/ .test(valor)){
        return true
       } else {
        errores.push("La dirección de email es incorrecta.");
       }
}

function normalizarEmail(email) {
    
    
}

/* -------------------------------- password -------------------------------- */
function validarContrasenia(contrasenia) {
    if (contrasenia.length>=4) {
        return true
    }else errores.push("La contraseña debe tener al menos 4 caracteres")
}

function compararContrasenias(contrasenia_1, contrasenia_2) {
    if (contrasenia_1==contrasenia_2) {
        return true
    }else errores.push('Las contraseñas no coinciden')
}

