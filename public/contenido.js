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
  dataBase.ref('contenidos/mico/descripcion').set({
    desarrolloMico: desarrolloMico,
    headlineMico:headlineMico,
    id:'',
    timeStamp: Date.now(),

  }).then (function(){
    alert ('se ha agregado correctamente el elemento a la base de datos')
    window.location = 'contenido.html'

  }).catch(function(error){
    alert ('no se pudo introducir el elemento'+ error)
  })

}

//leer tipo Creaciones
imprimirHeadlineMicoBD = function(){
  var ref = dataBase.ref('contenidos/mico/descripcion')
  ref.once('value').then(function(snapshot){
    let data =snapshot.val()
    document.getElementById('headlineMicoBD').value = data.headlineMico
    document.getElementById('desarrolloMicoDB').value = data.desarrolloMico

  })
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//fotos para el Taller

var escribirSubirPicTaller = function(urlPicTaller,picName,numberName){
  dataBase.ref('contenidos/taller/pic'+numberName+'/picName').once('value',function(snapshot){
    var picAeliminar= snapshot.val()

    // Create a reference to the file to delete
    var pic = storageRef.child('taller/'+picAeliminar)
    dataBase.ref('contenidos/taller/pic'+numberName).set({
      urlPicTaller: urlPicTaller,
      id:'',
      picName:picName,
      timeStamp: Date.now(),

    }).then (function(){
      alert ('se ha agregado correctamente el elemento a la base de datos... espera a que se recarge la pagina por si sola antes de salir, para que se realicen todos los cambios')
      if(picAeliminar !== picName){
        pic.delete().then(function() {
          console.log('File deleted successfully')
          window.location = 'contenido.html'
        }).catch(function(error) {
          console.log('error al intentar borrar la pic del storage'+error)
        })
      }else{
        window.location = 'contenido.html'
      }

    }).catch(function(error){
      alert ('no se pudo introducir el elemento'+ error)
    })
  }).catch(function(error) {
    console.log('error al cargar  el nombre de los archivos a borrar en el estorage')
  })
}

function SubirPicTaller(event){
  //cogemos el evento para que no se cambie de pagina antes de hacer el push
  //a la base de datos y recibir el then en la promesa
  event.preventDefault()
  var urlPicTaller = document.getElementById('urlPicTaller'+event.target.name).value
  let picName = document.getElementById('archivoNameTaller'+event.target.name).value
  escribirSubirPicTaller(urlPicTaller,picName,event.target.name)
}

//leer foto y header Creaciones
imprimirPicTallerDB = function(event){
  var ref = dataBase.ref('contenidos/taller/pic'+event.target.name)
  ref.once('value').then(function(snapshot){
    let data =snapshot.val()
    document.getElementById('urlPicTaller'+event.target.name+'DB').src = data.urlPicTaller

  })
}


function guardarArchivoPicTaller(event){

  if (event.target.name ==='1'){
    var archivo = document.querySelectorAll('input[type =file]')[0].files[0]
  }else if (event.target.name ==='2'){
    var archivo = document.querySelectorAll('input[type =file]')[1].files[0]
  }else if (event.target.name ==='3'){
    var archivo = document.querySelectorAll('input[type =file]')[2].files[0]
  }else if (event.target.name ==='4'){
    var archivo = document.querySelectorAll('input[type =file]')[3].files[0]
  }
  if(archivo){
    var subirImagen = storageRef.child('taller/'+ archivo.name).put(archivo)
    subirImagen.on('state_changed',function(snapshot){
      //los cambios en la carga del archivo
    }, function(error){
      console.log('error en la carga de la imagen' + error)

    }, function(success){
      //aqui se guarda la direcci'on donde se guarda el archivo
      console.log('success!'+subirImagen.snapshot.downloadURL)
      document.getElementById('urlPicTaller'+event.target.name).value = subirImagen.snapshot.downloadURL
      document.getElementById('archivoNameTaller'+event.target.name).value = archivo.name
    }
    )
  }
  else{console.log('no hay archivo q subir'+ archivo)}
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
  dataBase.ref('contenidos/taller/descripcion').set({
    descripcionTaller: descripcionTaller,
    id:'',
    timeStamp: Date.now(),

  }).then (function(){
    alert ('se ha agregado correctamente el elemento a la base de datos')
    window.location = 'contenido.html'

  }).catch(function(error){
    alert ('no se pudo introducir el elemento'+ error)
  })

}

//leer tipo Creaciones
imprimirDescripcionTallerBD = function(){
  var ref = dataBase.ref('contenidos/taller/descripcion')
  ref.once('value').then(function(snapshot){
    let data =snapshot.val()
    document.getElementById('descripcionTallerDB').value = data.descripcionTaller

  })
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//crear LOGO ARTESANIA

var escribirSubirLogoArtesania = function(urlLogoArtesania){
  dataBase.ref('contenidos/artesania/logo').set({
    urlLogoArtesania: urlLogoArtesania,
    id:'',
    timeStamp: Date.now(),

  }).then (function(){
    alert ('se ha agregado correctamente el elemento a la base de datos')
    window.location = 'contenido.html'

  }).catch(function(error){
    alert ('no se pudo introducir el elemento'+ error)
  })

}

function SubirLogoArtesania(event){
  //cogemos el evento para que no se cambie de pagina antes de hacer el push
  //a la base de datos y recibir el then en la promesa
  event.preventDefault()
  var urlLogoArtesania = document.getElementById('urlLogoArtesania').value
  escribirSubirLogoArtesania(urlLogoArtesania)
}

//leer foto y header Creaciones
imprimirLogoArtesaniaBD = function(){
  var ref = dataBase.ref('contenidos/artesania/logo')
  ref.once('value').then(function(snapshot){
    let data =snapshot.val()
    document.getElementById('urlLogoArtesaniaDB').src = data.urlLogoArtesania

  })
}


function guardarArchivoLogoArtesania(){
  var archivo = document.querySelectorAll('input[type =file]')[4].files[0]
  if(archivo){
    var subirImagen = storageRef.child('contenidos/' + archivo.name).put(archivo)
    subirImagen.on('state_changed',function(snapshot){
      //los cambios en la carga del archivo
    }, function(error){
      console.log('error en la carga de la imagen' + error)

    }, function(success){
      //aqui se guarda la direcci'on donde se guarda el archivo
      console.log('success!'+subirImagen.snapshot.downloadURL)
      document.getElementById('urlLogoArtesania').value = subirImagen.snapshot.downloadURL
    }
    )
  }
  else{console.log('no hay archivo q subir'+ archivo)}
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//SUBIR UN NUEVO TIPO DE PRODUCTO
function subirNuevoTipo(event){
  //cogemos el evento para que no se cambie de pagina antes de hacer el push
  //a la base de datos y recibir el then en la promesa
  event.preventDefault()
  var tipo = document.getElementById('nuevoTipo').value
  escribirsubirNuevoTipo(tipo)
}
//crear nuevoTipo

var escribirsubirNuevoTipo = function(tipo){
  dataBase.ref('contenidos/creaciones/tipo/'+tipo ).set({
    descripcionTipo: '',
    tipo: tipo,
    id:'',
    timeStamp: Date.now(),

  }).then (function(){
    alert ('se ha agregado correctamente el elemento a la base de datos')
    window.location = 'contenido.html'

  }).catch(function(error){
    alert ('no se pudo introducir el elemento'+ error)
  })

}



//SUBIR LA DESCRIPCION DE LOS TIPOS DE CREACIONES EN PARTICULAR Y SU ICONO
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
  dataBase.ref('contenidos/creaciones/tipo/'+tipo ).set({
    descripcionTipo: descripcionTipo,
    tipo: tipo,
    id:'',
    timeStamp: Date.now(),

  }).then (function(){
    alert ('se ha agregado correctamente el elemento a la base de datos')
    window.location = 'contenido.html'

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
      label.appendChild(document.createTextNode(childData.tipo))


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
    document.getElementById('txtTipoDB').value = data.descripcionTipo

  })
}

function selectTipo(){
  let tipo = document.querySelector('input[name=tipo]:checked').value

  return tipo
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//crear FotoYheaderConocenos

var escribirSubirFotoYheaderConocenos = function(urlPicConocenos,picName){
  dataBase.ref('contenidos/conocenos/headerFoto/picName').once('value',function(snapshot){
    var picAeliminar= snapshot.val()

    // Create a reference to the file to delete
    var pic = storageRef.child('contenidos/'+picAeliminar)
    // Delete the file
    dataBase.ref('contenidos/conocenos/headerFoto').set({
      urlPicConocenos: urlPicConocenos,
      id:'',
      timeStamp: Date.now(),
      picName: picName,

    }).then (function(){
      alert ('se ha agregado correctamente el elemento a la base de datos... espera a que se recarge la pagina por si sola antes de salir, para que se realicen todos los cambios')
      if(picAeliminar !== picName){
        pic.delete().then(function() {
          console.log('File deleted successfully')
          window.location = 'contenido.html'
        }).catch(function(error) {
          console.log('error al intentar borrar la pic del storage')
        })
      }else{
        window.location = 'contenido.html'
      }

    }).catch(function(error){
      alert ('no se pudo introducir el elemento'+ error)
    })
  }).catch(function(error) {
    console.log('error al cargar  el nombre de los archivos a borrar en el estorage')
  })

}

function SubirFotoYheaderConocenos(event){
  //cogemos el evento para que no se cambie de pagina antes de hacer el push
  //a la base de datos y recibir el then en la promesa
  event.preventDefault()

  var urlPicConocenos = document.getElementById('urlPicConocenos').value
  let picName = document.getElementById('archivoNameConocenos').value
  escribirSubirFotoYheaderConocenos(urlPicConocenos,picName)
}

//leer foto y header Conocenos
imprimirFotoYheaderConocenosBD = function(){
  var ref = dataBase.ref('contenidos/conocenos/headerFoto')
  ref.once('value').then(function(snapshot){
    let data =snapshot.val()
    document.getElementById('picConocenosDB').src = data.urlPicConocenos

  })
}


function guardarArchivoPicConocenos(){
  var archivo = document.querySelectorAll('input[type =file]')[5].files[0]
  if(archivo){
    var subirImagen = storageRef.child('contenidos/' + archivo.name).put(archivo)
    subirImagen.on('state_changed',function(snapshot){
      //los cambios en la carga del archivo
    }, function(error){
      console.log('error en la carga de la imagen' + error)

    }, function(success){
      //aqui se guarda la direcci'on donde se guarda el archivo
      console.log('success!'+subirImagen.snapshot.downloadURL)
      document.getElementById('urlPicConocenos').value = subirImagen.snapshot.downloadURL
      document.getElementById('archivoNameConocenos').value = archivo.name
    }
    )
  }
  else{console.log('no hay archivo q subir'+ archivo)}
}
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
  dataBase.ref('contenidos/conocenos/descripcion').set({
    descripcionConocenos: descripcionConocenos,
    id:'',
    timeStamp: Date.now(),

  }).then (function(){
    alert ('se ha agregado correctamente el elemento a la base de datos')
    window.location = 'contenido.html'

  }).catch(function(error){
    alert ('no se pudo introducir el elemento'+ error)
  })

}

imprimirDescripcionConocenosBD = function(){
  var ref = dataBase.ref('contenidos/conocenos/descripcion')
  ref.once('value').then(function(snapshot){
    let data =snapshot.val()
    document.getElementById('descripcionConocenosDB').value = data.descripcionConocenos

  })
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//crear FotoYheaderContacto

var escribirSubirFotoYheaderContacto = function(urlPicContacto,picName){
  dataBase.ref('contenidos/contacto/headerFoto/picName').once('value',function(snapshot){
    var picAeliminar= snapshot.val()

    // Create a reference to the file to delete
    var pic = storageRef.child('contenidos/'+picAeliminar)
    // Delete the file
    dataBase.ref('contenidos/contacto/headerFoto').set({
      urlPicContacto: urlPicContacto,
      id:'',
      timeStamp: Date.now(),
      picName: picName,

    }).then (function(){
      alert ('se ha agregado correctamente el elemento a la base de datos... espera a que se recarge la pagina por si sola antes de salir, para que se realicen todos los cambios')
      if(picAeliminar !== picName){
        pic.delete().then(function() {
          console.log('File deleted successfully')
          window.location = 'contenido.html'
        }).catch(function(error) {
          console.log('error al intentar borrar la pic del storage')
        })
      }else{
        window.location = 'contenido.html'
      }

    }).catch(function(error){
      alert ('no se pudo introducir el elemento'+ error)
    })
  }).catch(function(error) {
    console.log('error al cargar  el nombre de los archivos a borrar en el estorage')
  })

}

function SubirFotoYheaderContacto(event){
  //cogemos el evento para que no se cambie de pagina antes de hacer el push
  //a la base de datos y recibir el then en la promesa
  event.preventDefault()

  var urlPicContacto = document.getElementById('urlPicContacto').value
  let picName = document.getElementById('archivoNameContacto').value
  escribirSubirFotoYheaderContacto(urlPicContacto,picName)
}

//leer foto y header Creaciones
imprimirFotoYheaderContactoBD = function(){
  var ref = dataBase.ref('contenidos/contacto/headerFoto')
  ref.once('value').then(function(snapshot){
    let data =snapshot.val()
    document.getElementById('picContactoDB').src = data.urlPicContacto

  })
}


function guardarArchivoPicContacto(){
  var archivo = document.querySelectorAll('input[type =file]')[6].files[0]
  if(archivo){
    var subirImagen = storageRef.child('contenidos/' + archivo.name).put(archivo)
    subirImagen.on('state_changed',function(snapshot){
      //los cambios en la carga del archivo
    }, function(error){
      console.log('error en la carga de la imagen' + error)

    }, function(success){
      //aqui se guarda la direcci'on donde se guarda el archivo
      console.log('success!'+subirImagen.snapshot.downloadURL)
      document.getElementById('urlPicContacto').value = subirImagen.snapshot.downloadURL
      document.getElementById('archivoNameContacto').value = archivo.name
    }
    )
  }
  else{console.log('no hay archivo q subir'+ archivo)}
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


//SUBIR EL CONTENDIDO DE Contacto

function subirDescripcionContacto(event){
  //cogemos el evento para que no se cambie de pagina antes de hacer el push
  //a la base de datos y recibir el then en la promesa
  event.preventDefault()
  var descripcionContacto = document.getElementById('descripcionContacto').value
  escribirDescripcionContacto(descripcionContacto)
}
//crear descripcionTipo

var escribirDescripcionContacto = function(descripcionContacto){
  dataBase.ref('contenidos/contacto/descripcion').set({
    descripcionContacto: descripcionContacto,
    id:'',
    timeStamp: Date.now(),

  }).then (function(){
    alert ('se ha agregado correctamente el elemento a la base de datos')
    window.location = 'contenido.html'

  }).catch(function(error){
    alert ('no se pudo introducir el elemento'+ error)
  })

}

imprimirDescripcionContactoBD = function(){
  var ref = dataBase.ref('contenidos/contacto/descripcion')
  ref.once('value').then(function(snapshot){
    let data =snapshot.val()
    document.getElementById('descripcionContactoDB').value = data.descripcionContacto

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
  dataBase.ref('contenidos/registrarse/descripcion').set({
    registrarseInfo: registrarseInfo,
    registrarseTitulo:registrarseTitulo,
    id:'',
    timeStamp: Date.now(),

  }).then (function(){
    alert ('se ha agregado correctamente el elemento a la base de datos')
    window.location = 'contenido.html'

  }).catch(function(error){
    alert ('no se pudo introducir el elemento'+ error)
  })

}

//leer tipo Creaciones
imprimirRegistrarseDB = function(){
  var ref = dataBase.ref('contenidos/registrarse/descripcion')
  ref.once('value').then(function(snapshot){
    let data =snapshot.val()
    document.getElementById('registrarseTituloDB').value = data.registrarseTitulo
    document.getElementById('registrarseInfoDB').value = data.registrarseInfo

  })
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//fondo para dialogo de registrarse

var escribirSubirPicRegistrarse = function(urlPicRegistrarse,picName){
  dataBase.ref('contenidos/registrarse/pic/picName').once('value',function(snapshot){
    var picAeliminar= snapshot.val()

    // Create a reference to the file to delete
    var pic = storageRef.child('contenidos/'+picAeliminar)

    dataBase.ref('contenidos/registrarse/pic').set({
      urlPicRegistrarse: urlPicRegistrarse,
      id:'',
      picName:picName,
      timeStamp: Date.now(),

    }).then (function(){
      alert ('se ha agregado correctamente el elemento a la base de datos... espera a que se recarge la pagina por si sola antes de salir, para que se realicen todos los cambios')
      if(picAeliminar !== picName){
        pic.delete().then(function() {
          console.log('File deleted successfully')
          window.location = 'contenido.html'
        }).catch(function(error) {
          console.log('error al intentar borrar la pic del storage'+error)
        })
      }else{
        window.location = 'contenido.html'
      }

    }).catch(function(error){
      alert ('no se pudo introducir el elemento'+ error)
    })
  }).catch(function(error) {
    console.log('error al cargar  el nombre de los archivos a borrar en el estorage')
  })
}

function SubirPicRegistrarse(event){
  //cogemos el evento para que no se cambie de pagina antes de hacer el push
  //a la base de datos y recibir el then en la promesa
  event.preventDefault()
  var urlPicRegistrarse = document.getElementById('urlPicRegistrarse').value
  let picName = document.getElementById('archivoNameRegistrarse').value
  escribirSubirPicRegistrarse(urlPicRegistrarse,picName)
}


imprimirPicRegistrarseDB = function(){
  var ref = dataBase.ref('contenidos/registrarse/pic')
  ref.once('value').then(function(snapshot){
    let data =snapshot.val()
    document.getElementById('urlPicRegistrarseDB').src = data.urlPicRegistrarse

  })
}


function guardarArchivoPicRegistrarse(){
  var archivo = document.querySelectorAll('input[type =file]')[7].files[0]
  if(archivo){
    var subirImagen = storageRef.child('contenidos/' + archivo.name).put(archivo)
    subirImagen.on('state_changed',function(snapshot){
      //los cambios en la carga del archivo
    }, function(error){
      console.log('error en la carga de la imagen' + error)

    }, function(success){
      //aqui se guarda la direcci'on donde se guarda el archivo
      console.log('success!'+subirImagen.snapshot.downloadURL)
      document.getElementById('urlPicRegistrarse').value = subirImagen.snapshot.downloadURL
      document.getElementById('archivoNameRegistrarse').value = archivo.name
    }
    )
  }
  else{console.log('no hay archivo q subir'+ archivo)}
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
  dataBase.ref('contenidos/pedido/descripcion').set({
    pedidoInfo: pedidoInfo,
    pedidoTitulo:pedidoTitulo,
    id:'',
    timeStamp: Date.now(),

  }).then (function(){
    alert ('se ha agregado correctamente el elemento a la base de datos')
    window.location = 'contenido.html'

  }).catch(function(error){
    alert ('no se pudo introducir el elemento'+ error)
  })

}

//leer tipo Creaciones
imprimirPedidoDB = function(){
  var ref = dataBase.ref('contenidos/pedido/descripcion')
  ref.once('value').then(function(snapshot){
    let data =snapshot.val()
    document.getElementById('pedidoTituloDB').value = data.pedidoTitulo
    document.getElementById('pedidoInfoDB').value = data.pedidoInfo

  })
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//SUBIR TITULO Y EXPLICACION DE REGISTRARSE CON MICO

function SubirTituloYexplicacionPostVenta(event){
  //cogemos el evento para que no se cambie de pagina antes de hacer el push
  //a la base de datos y recibir el then en la promesa
  event.preventDefault()
  let postVentaTitulo = document.getElementById('postVentaTitulo').value
  var postVentaInfo = document.getElementById('postVentaInfo').value
  escribirDescripcionPostVenta(postVentaTitulo , postVentaInfo)
}
//crear descripcionTipo

var escribirDescripcionPostVenta = function(postVentaTitulo,postVentaInfo){
  dataBase.ref('contenidos/postVenta/descripcion').set({
    postVentaInfo: postVentaInfo,
    postVentaTitulo:postVentaTitulo,
    id:'',
    timeStamp: Date.now(),

  }).then (function(){
    alert ('se ha agregado correctamente el elemento a la base de datos')
    window.location = 'contenido.html'

  }).catch(function(error){
    alert ('no se pudo introducir el elemento'+ error)
  })

}

//leer tipo Creaciones
imprimirPostVentaDB = function(){
  var ref = dataBase.ref('contenidos/postVenta/descripcion')
  ref.once('value').then(function(snapshot){
    let data =snapshot.val()
    document.getElementById('postVentaTituloDB').value = data.postVentaTitulo
    document.getElementById('postVentaInfoDB').value = data.postVentaInfo

  })
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//fotos para el carousell

var escribirSubirPicCarousell = function(urlPicCarousell,picName,numberName){
  dataBase.ref('contenidos/carousell/pic'+numberName+'/picName').once('value',function(snapshot){
    var picAeliminar= snapshot.val()

    // Create a reference to the file to delete
    var pic = storageRef.child('carousell/'+picAeliminar)
    dataBase.ref('contenidos/carousell/pic'+numberName).set({
      urlPicCarousell: urlPicCarousell,
      id:'',
      picName:picName,
      timeStamp: Date.now(),

    }).then (function(){
      alert ('se ha agregado correctamente el elemento a la base de datos... espera a que se recarge la pagina por si sola antes de salir, para que se realicen todos los cambios')
      if(picAeliminar !== picName){
        pic.delete().then(function() {
          console.log('File deleted successfully')
          window.location = 'contenido.html'
        }).catch(function(error) {
          console.log('error al intentar borrar la pic del storage'+error)
        })
      }else{
        window.location = 'contenido.html'
      }

    }).catch(function(error){
      alert ('no se pudo introducir el elemento'+ error)
    })
  }).catch(function(error) {
    console.log('error al cargar  el nombre de los archivos a borrar en el estorage')
  })
}

function SubirPicCarousell(event){
  //cogemos el evento para que no se cambie de pagina antes de hacer el push
  //a la base de datos y recibir el then en la promesa
  event.preventDefault()
  var urlPicCarousell = document.getElementById('urlPicCarousell'+event.target.name).value
  let picName = document.getElementById('archivoNameCarousell'+event.target.name).value
  escribirSubirPicCarousell(urlPicCarousell,picName,event.target.name)
}

//leer foto y header Creaciones
imprimirPicCarousellDB = function(event){
  var ref = dataBase.ref('contenidos/carousell/pic'+event.target.name)
  ref.once('value').then(function(snapshot){
    let data =snapshot.val()
    document.getElementById('urlPicCarousell'+event.target.name+'DB').src = data.urlPicCarousell

  })
}


function guardarArchivoPicCarousell(event){

  if (event.target.name ==='1'){
    var archivo = document.querySelectorAll('input[type =file]')[8].files[0]
  }else if (event.target.name ==='2'){
    var archivo = document.querySelectorAll('input[type =file]')[9].files[0]
  }else if (event.target.name ==='3'){
    var archivo = document.querySelectorAll('input[type =file]')[10].files[0]
  }else if (event.target.name ==='4'){
    var archivo = document.querySelectorAll('input[type =file]')[11].files[0]
  }else if (event.target.name ==='5'){
    var archivo = document.querySelectorAll('input[type =file]')[12].files[0]
  }
  if(archivo){
    var subirImagen = storageRef.child('carousell/'+ archivo.name).put(archivo)
    subirImagen.on('state_changed',function(snapshot){
      //los cambios en la carga del archivo
    }, function(error){
      console.log('error en la carga de la imagen' + error)

    }, function(success){
      //aqui se guarda la direcci'on donde se guarda el archivo
      console.log('success!'+subirImagen.snapshot.downloadURL)
      document.getElementById('urlPicCarousell'+event.target.name).value = subirImagen.snapshot.downloadURL
      document.getElementById('archivoNameCarousell'+event.target.name).value = archivo.name
    }
    )
  }
  else{console.log('no hay archivo q subir'+ archivo)}
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
