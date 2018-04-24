// Initialize Firebase
var config = {
  apiKey: "AIzaSyAikVZnJteFavPRHv7M_Qiv-RIPyE0lrCM",
  authDomain: "micotextil-3f024.firebaseapp.com",
  databaseURL: "https://micotextil-3f024.firebaseio.com",
  projectId: "micotextil-3f024",
  storageBucket: "micotextil-3f024.appspot.com",
  messagingSenderId: "1069659429917"
}
firebase.initializeApp(config)

//ingresar
var ingresar = function(){
  //si esta funcion la llamas desde un <form> no funciona lol
  var email = document.getElementById('inputEmail').value
  var password = document.getElementById('inputPassword').value
  firebase.auth().signInWithEmailAndPassword(email, password)
    .then(function(result){
      console.log('t has logeado correctamente ' +result)
      //ir a la p'agina de agregar creaci'on
      window.location = 'agregarCreacion.html'

    })
    .catch(function(error) {
    // Handle Errors here.
      var errorCode = error.code
      var errorMessage = error.message

      alert('error en autenticacion ' +errorCode +' ' +errorMessage)
      console.log('error en autenticacion ' +errorCode +' ' +errorMessage)
      // ...

    })


}
//esto se ejecuta todo el rato x eso en cuanto no est'es logeado vas pal index
//observador del estado de autenticacion

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.
    console.log ('si esta autorizado')
  } else {
    // No user is signed in.
    console.log('no esta autorizado')
    //para que no t haga una relocalizacion todo el rato
    if(window.location.pathname != '/index.html'){
      window.location ='index.html'
    }
  }
})

//cerrar sesion
var salir = function(){
  firebase.auth().signOut().then(function() {
    // Sign-out successful.
    console.log('sesion terminada')
  }).catch(function(error) {
    // An error happened.
    console.log('error al terminar la sesion: '+error)
  }).then

}
////////////////////////////////////////referencias/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//ref al database
var dataBase = firebase.database()
//referencia al storage para poder subir las fotos
var storage = firebase.storage()
var storageRef =storage.ref()
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//SUBIR HEADLINE Y BREVE DESARROLLO SOBRE MICO

function subirDescripcionMico(event){
  //cogemos el evento para que no se cambie de pagina antes de hacer el push
  //a la base de datos y recibir el then en la promesa
  event.preventDefault()
  let headlineMico = document.getElementById('headlineMico').value
  var desarrolloMico = document.getElementById('desarrolloMico').value
  escribirHeadlineMico(headlineMico , desarrolloMico)
}
//crear descripcionTipo

var escribirHeadlineMico = function(headlineMico,desarrolloMico){
  dataBase.ref('contenidos/mico/descripcion').update({
    desarrolloMicoGalego: desarrolloMico,
    headlineMicoGalego:headlineMico,

  }).then (function(){
    alert ('se ha agregado correctamente el elemento a la base de datos')
    window.location = 'contenidoGalego.html'

  }).catch(function(error){
    alert ('no se pudo introducir el elemento'+ error)
  })

}

//leer tipo Creaciones
imprimirHeadlineMicoBD = function(){
  var ref = dataBase.ref('contenidos/mico/descripcion')
  ref.once('value').then(function(snapshot){
    let data =snapshot.val()
    document.getElementById('headlineMicoBD').value = data.headlineMicoGalego
    document.getElementById('desarrolloMicoDB').value = data.desarrolloMicoGalego

  })
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


//SUBIR EL CONTENDIDO DE Taller

function subirDescripcionTaller(event){
  //cogemos el evento para que no se cambie de pagina antes de hacer el push
  //a la base de datos y recibir el then en la promesa
  event.preventDefault()
  var descripcionTaller = document.getElementById('descripcionTaller').value
  escribirDescripcionTaller(descripcionTaller)
}
//crear descripcionTipo

var escribirDescripcionTaller = function(descripcionTaller){
  dataBase.ref('contenidos/taller/descripcion').update({
    descripcionTallerGalego: descripcionTaller,

  }).then (function(){
    alert ('se ha agregado correctamente el elemento a la base de datos')
    window.location = 'contenidoGalego.html'

  }).catch(function(error){
    alert ('no se pudo introducir el elemento'+ error)
  })

}

//leer tipo Creaciones
imprimirDescripcionTallerBD = function(){
  var ref = dataBase.ref('contenidos/taller/descripcion')
  ref.once('value').then(function(snapshot){
    let data =snapshot.val()
    document.getElementById('descripcionTallerDB').value = data.descripcionTallerGalego

  })
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



//SUBIR LA DESCRIPCION DE LOS TIPOS DE CREACIONES EN PARTICULAR
function subirTxtTipo(event){
  //cogemos el evento para que no se cambie de pagina antes de hacer el push
  //a la base de datos y recibir el then en la promesa
  event.preventDefault()
  var descripcionTipo = document.getElementById('descripcionTipo').value
  var tipo = selectTipo()
  escribirsubirTxtTipo(descripcionTipo,tipo)
}
//crear descripcionTipo

var escribirsubirTxtTipo = function(descripcionTipo ,tipo){
  dataBase.ref('contenidos/creaciones/tipo/'+tipo ).update({
    descripcionTipoGalego: descripcionTipo,

  }).then (function(){
    alert ('se ha agregado correctamente el elemento a la base de datos')
    window.location = 'contenidoGalego.html'

  }).catch(function(error){
    alert ('no se pudo introducir el elemento'+ error)
  })

}
seleccionarTipo = function(){
  var query = dataBase.ref('contenidos/creaciones/tipo')
  query.once('value',function(snapshot){
    //console.log (snapshot.val())
    var radioHome = document.getElementById('radioHome')
    snapshot.forEach(function(childSnapshot){
      let childKey = childSnapshot.key
      let childData = childSnapshot.val()


      var label = document.createElement('label')
      var radio = document.createElement('input')
      radio.type = 'radio'
      radio.name = 'tipo'
      radio.id = childData.tipo
      radio.value = childData.tipo
      radio.required = 'required'
      label.appendChild(radio)
      label.appendChild(document.createTextNode(childData.tipoGalego))


      radioHome.appendChild(label)


    })
  }
  )

}
//limpio lo que hay escrito en el textarea q viene de la bd al cambiar de tipo
clearTextDB  = function(){
  document.getElementById('txtTipoDB').value = ''
}
//leer tipo Creaciones
imprimirDescripcionTipoBD = function(){
  var tipo = selectTipo()
  var ref = dataBase.ref('contenidos/creaciones/tipo/'+tipo)
  ref.once('value').then(function(snapshot){
    let data =snapshot.val()
    document.getElementById('txtTipoDB').value = data.descripcionTipoGalego

  })
}

function selectTipo(){
  let tipo = document.querySelector('input[name=tipo]:checked').value

  return tipo
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


//SUBIR EL CONTENDIDO DE CONOCENOS

function subirDescripcionConocenos(event){
  //cogemos el evento para que no se cambie de pagina antes de hacer el push
  //a la base de datos y recibir el then en la promesa
  event.preventDefault()
  var descripcionConocenos = document.getElementById('descripcionConocenos').value
  escribirDescripcionConocenos(descripcionConocenos)
}
//crear descripcionconocenos

var escribirDescripcionConocenos = function(descripcionConocenos){
  dataBase.ref('contenidos/conocenos/descripcion').update({
    descripcionConocenosGalego: descripcionConocenos,

  }).then (function(){
    alert ('se ha agregado correctamente el elemento a la base de datos')
    window.location = 'contenidoGalego.html'

  }).catch(function(error){
    alert ('no se pudo introducir el elemento'+ error)
  })

}

imprimirDescripcionConocenosBD = function(){
  var ref = dataBase.ref('contenidos/conocenos/descripcion')
  ref.once('value').then(function(snapshot){
    let data =snapshot.val()
    document.getElementById('descripcionConocenosDB').value = data.descripcionConocenosGalego

  })
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


//SUBIR EL CONTENDIDO DE Contacto

function subirDescripcionContacto(event){
  //cogemos el evento para que no se cambie de pagina antes de hacer el push
  //a la base de datos y recibir el then en la promesa
  event.preventDefault()
  var descripcionContacto = document.getElementById('descripcionContacto').value
  escribirDescripcionContacto(descripcionContacto)
}

var escribirDescripcionContacto = function(descripcionContacto){
  dataBase.ref('contenidos/contacto/descripcion').update({
    descripcionContactoGalego: descripcionContacto,

  }).then (function(){
    alert ('se ha agregado correctamente el elemento a la base de datos')
    window.location = 'contenidoGalego.html'

  }).catch(function(error){
    alert ('no se pudo introducir el elemento'+ error)
  })

}

imprimirDescripcionContactoBD = function(){
  var ref = dataBase.ref('contenidos/contacto/descripcion')
  ref.once('value').then(function(snapshot){
    let data =snapshot.val()
    document.getElementById('descripcionContactoDB').value = data.descripcionContactoGalego

  })
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



//SUBIR TITULO Y EXPLICACION DE REGISTRARSE CON MICO

function SubirTituloYexplicacionRegistrarse(event){
  //cogemos el evento para que no se cambie de pagina antes de hacer el push
  //a la base de datos y recibir el then en la promesa
  event.preventDefault()
  let registrarseTitulo = document.getElementById('registrarseTitulo').value
  var registrarseInfo = document.getElementById('registrarseInfo').value
  escribirHeadlineRegistrarse(registrarseTitulo , registrarseInfo)
}


var escribirHeadlineRegistrarse = function(registrarseTitulo,registrarseInfo){
  dataBase.ref('contenidos/registrarse/descripcion').update({
    registrarseInfoGalego: registrarseInfo,
    registrarseTituloGalego:registrarseTitulo,

  }).then (function(){
    alert ('se ha agregado correctamente el elemento a la base de datos')
    window.location = 'contenidoGalego.html'

  }).catch(function(error){
    alert ('no se pudo introducir el elemento'+ error)
  })

}

//leer tipo Creaciones
imprimirRegistrarseDB = function(){
  var ref = dataBase.ref('contenidos/registrarse/descripcion')
  ref.once('value').then(function(snapshot){
    let data =snapshot.val()
    document.getElementById('registrarseTituloDB').value = data.registrarseTituloGalego
    document.getElementById('registrarseInfoDB').value = data.registrarseInfoGalego

  })
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//SUBIR TITULO Y EXPLICACION DE CARRITO

function SubirTituloYexplicacionPedido(event){
  //cogemos el evento para que no se cambie de pagina antes de hacer el push
  //a la base de datos y recibir el then en la promesa
  event.preventDefault()
  let pedidoTitulo = document.getElementById('pedidoTitulo').value
  var pedidoInfo = document.getElementById('pedidoInfo').value
  escribirPedidoDescripcion(pedidoTitulo , pedidoInfo)
}
//crear descripcionTipo

var escribirPedidoDescripcion = function(pedidoTitulo,pedidoInfo){
  dataBase.ref('contenidos/pedido/descripcion').update({
    pedidoInfoGalego: pedidoInfo,
    pedidoTituloGalego:pedidoTitulo,

  }).then (function(){
    alert ('se ha agregado correctamente el elemento a la base de datos')
    window.location = 'contenidoGalego.html'

  }).catch(function(error){
    alert ('no se pudo introducir el elemento'+ error)
  })

}

//leer tipo Creaciones
imprimirPedidoDB = function(){
  var ref = dataBase.ref('contenidos/pedido/descripcion')
  ref.once('value').then(function(snapshot){
    let data =snapshot.val()
    document.getElementById('pedidoTituloDB').value = data.pedidoTituloGalego
    document.getElementById('pedidoInfoDB').value = data.pedidoInfoGalego

  })
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
