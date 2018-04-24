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
//crear elementos

var dataBase = firebase.database()
var escribirCreacion = function(nombre,nombreGalego,descripcionGalego,descripcion,pic,pic2,precio,materialesGalego,materiales,tipo,picName,picName2){
  dataBase.ref('creaciones/').push({
    nombre: nombre,
    nombreGalego:nombreGalego,
    descripcion: descripcion,
    descripcionGalego:descripcionGalego,
    pic: pic,
    picName:picName,
    pic2: pic2,
    picName2:picName2,
    precio:precio,
    materiales: materiales,
    materialesGalego:materialesGalego,
    tipo: tipo,
    id:'',
    timeStamp: new Date(),

  }).then (function(){
    alert ('se ha agregado correctamente el elemento a la base de datos')
    window.location = 'agregarCreacion.html'

  }).catch(function(error){
    alert ('no se pudo introducir el elemento'+ error)
  })

}
//
var seleccionarTipo = function(){
  var query = dataBase.ref('contenidos/creaciones/tipo')
  query.on('value',function(snapshot){
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
var opcionesRespiro = ()=>{
  var query = dataBase.ref('contenidos/creaciones/respiro')
  query.once('value',function(snapshot){
    let respiroData = snapshot.val()

    var ulRespiro = document.getElementById('respiro')
    let liRespiro = document.createElement('li')

    var buttonActivar =document.createElement('button')
    buttonActivar.setAttribute('id','activar')
    buttonActivar.setAttribute('onclick','respiroAction(this.id)')
    buttonActivar.setAttribute('class', 'btn-info')
    buttonActivar.appendChild(document.createTextNode('volver a activar la tienda'))

    var buttonDesactivar =document.createElement('button')
    buttonDesactivar.setAttribute('id','desactivar')
    buttonDesactivar.setAttribute('onclick','respiroAction(this.id)')
    buttonDesactivar.setAttribute('class', 'btn-danger')
    buttonDesactivar.appendChild(document.createTextNode('No permitir la compra'))
    if(respiroData.activo){

      var inputMensaje = document.createElement('textarea')
      inputMensaje.type = 'text'
      inputMensaje.setAttribute('id','mensaje')
      inputMensaje.setAttribute('placeholder','mensaje mientras no funciona la tienda')
      var inputMensajeGalego = document.createElement('textarea')
      inputMensajeGalego.type = 'text'
      inputMensajeGalego.setAttribute('id','mensajeGalego')
      inputMensajeGalego.setAttribute('placeholder','mensaje en Galego')
      liRespiro.appendChild(inputMensaje)
      liRespiro.appendChild(inputMensajeGalego)
      liRespiro.appendChild(buttonDesactivar)
    }else{
      liRespiro.appendChild(buttonActivar)

    }
    //el li en el ul
    ulRespiro.appendChild(liRespiro)
  })
}
respiroAction= (id) =>{
  if(id ==='desactivar'){
    let mensaje = document.getElementById('mensaje').value
    let mensajeGalego = document.getElementById('mensajeGalego').value
    dataBase.ref('contenidos/creaciones/respiro')
      .update({
        activo:false,
        mensaje : mensaje,
        mensajeGalego: mensajeGalego,
      }).then (function(){
        alert ('puedes tomarte un respiro, la tienda esta desactivada')
        window.location = 'creaciones.html'

      }).catch(function(error){
        alert ('no se pudo rebajar el elemento '+ error)
      })
  }
  if(id==='activar'){
    dataBase.ref('contenidos/creaciones/respiro')
      .update({
        activo:true,
        mensaje : '',
        mensajeGalego: false,
      }).then (function(){
        alert ('la tienda en pleno funcionamiento!!')
        window.location = 'creaciones.html'

      }).catch(function(error){
        alert ('no se pudo rebajar el elemento '+ error)
      })
  }
}
//leer elementos
var imprimirCreaciones = function(){
  var query = dataBase.ref('creaciones/')
  query.once('value',function(snapshot){
    //console.log (snapshot.val())
    var ul = document.getElementById('lista')
    snapshot.forEach(function(childSnapshot){
      let childKey = childSnapshot.key
      let childData = childSnapshot.val()

      var li = document.createElement('li')
      var div = document.createElement('div')
      var img1 = document.createElement('img')
      var img2 = document.createElement('img')
      //var br = document.createElement('br')
      var buttonEliminar =document.createElement('button')
      var buttonVendido =document.createElement('button')
      var buttonRestablecer =document.createElement('button')
      var buttonRebajar =document.createElement('button')

      buttonEliminar.setAttribute('id',childKey)
      buttonEliminar.setAttribute('onclick','eliminarElemento(this.id)')
      buttonEliminar.setAttribute('class', 'btn-danger')
      buttonEliminar.appendChild(document.createTextNode('eliminar '+ childData.nombre))

      buttonRebajar.setAttribute('id',childKey)
      buttonRebajar.setAttribute('onclick','rebajarElemento(this.id)')
      buttonRebajar.setAttribute('class', 'btn-info')
      buttonRebajar.appendChild(document.createTextNode('rebajar '+ childData.nombre))

      buttonRestablecer.setAttribute('id',childKey)
      buttonRestablecer.setAttribute('onclick','restablecerElemento(this.id)')
      buttonRestablecer.setAttribute('class', 'btn-success')
      buttonRestablecer.appendChild(document.createTextNode('restablecer '+ childData.nombre))

      buttonVendido.setAttribute('id',childKey)
      buttonVendido.setAttribute('onclick','elementoVendido(this.id)')
      buttonVendido.setAttribute('class', 'btn-warning')
      buttonVendido.appendChild(document.createTextNode('marcar como vendido '+ childData.nombre))


      img1.src = childData.pic
      img1.height = 60
      img1.alt = 'imagen del elemento'

      img2.src = childData.pic2
      img2.height = 60
      img2.alt = 'imagen del elemento'
      //la imagen1 en el div
      div.appendChild(img1)
      //la imagen2 en el div
      div.appendChild(img2)
      div.style.float = 'right'
      //el div en el li
      li.setAttribute('class', 'list-group-item')
      li.appendChild(div)
      li.appendChild(document.createTextNode('NOMBRE: ' + childData.nombre))
      li.appendChild(document.createElement('br'))
      li.appendChild(document.createTextNode('PRECIO: ' + childData.precio))
      li.appendChild(document.createElement('br'))
      li.appendChild(document.createTextNode('MATERIALES: ' + childData.materiales))
      li.appendChild(document.createElement('br'))
      li.appendChild(document.createTextNode('DESCRIPCION: ' + childData.descripcion))
      li.appendChild(document.createElement('br'))
      li.appendChild(document.createTextNode('TIPO: ' + childData.tipo))
      li.appendChild(document.createElement('br'))
      li.appendChild(buttonEliminar)
      if(childData.vendido){
        li.appendChild(document.createTextNode('producto vendido '+ childData.vendidoTime))
        li.appendChild(buttonRestablecer)
      }else{
        li.appendChild(buttonVendido)
        var inputRebaja = document.createElement('input')
        inputRebaja.type = 'text'
        inputRebaja.setAttribute('id','precioRebajado'+childKey)
        inputRebaja.setAttribute('placeholder','precio rebajado')
        li.appendChild(inputRebaja)
        li.appendChild(buttonRebajar)
      }
      //el li en el ul
      ul.appendChild(li)
    })
  }
  )
}
//eliminar elementos
var eliminarElemento =function(id){
  dataBase.ref('creaciones/'+id).once('value',function(snapshot){
    var creacionAeliminar= snapshot.val()
    var pic2 = storageRef.child('creaciones/'+creacionAeliminar.picName2)
    // Delete the 2nd pic cos d first one I need it for the carro and pedidos
    pic2.delete().then(function() {
      // File deleted successfully
      dataBase.ref('creaciones/'+id).remove().then(function(){
        alert('creacion eliminada')
        window.location = 'creaciones.html'
        console.log('creacion eliminada')
      }).catch(function(error){
        console.log('no se borro el elemento'+ error)
      })

    }).catch(function(error) {
      console.log ('error al intentar borrar el segundo pic del storage')
    })

  }).catch(function(error) {
    console.log('error al cargar la creacion para ver el nombre de los archivos a borrar en el estorage')
  })
}

var rebajarElemento =(id)=>{
  let precioRebajado = document.getElementById('precioRebajado'+id).value
  if(precioRebajado===''){
    alert('introduce un precio rebajado primero')
  }else{

    dataBase.ref('creaciones/'+id).update({
      precioRebajado:precioRebajado,

    }).then (function(){
      alert ('se ha rebajado el elemento a: '+precioRebajado)
      window.location = 'creaciones.html'

    }).catch(function(error){
      alert ('no se pudo rebajar el elemento '+ error)
    })
  }
}

var restablecerElemento =(id)=>{
  dataBase.ref('creaciones/'+id).update({
    vendido:false,
    vendidoTime: '',
    precioRebajado: false,

  }).then (function(){
    alert ('se ha restablecido el elemento')
    window.location = 'creaciones.html'

  }).catch(function(error){
    alert ('no se pudo restablecer el elemento '+ error)
  })
}

var elementoVendido = function(id){
  var today = new Date()
  var dd = today.getDate()
  var mm = today.getMonth()+1 //January is 0!
  var yyyy = today.getFullYear()

  if(dd<10) {
    dd = '0'+dd
  }

  if(mm<10) {
    mm = '0'+mm
  }

  today = dd + '/' + mm + '/' + yyyy

  dataBase.ref('creaciones/'+id).update({
    vendido:true,
    vendidoTime: today,

  }).then (function(){
    alert ('se ha puesto como vendido el elemento')
    window.location = 'creaciones.html'

  }).catch(function(error){
    alert ('no se pudo poner como vendido '+ error)
  })

}
//guardar imagen en el storage de firebase
var storage = firebase.storage()
var storageRef =storage.ref()

function guardarArchivo(){
  var archivo = document.querySelector('input[type =file]').files[0]
  if(archivo){
    var subirImagen = storageRef.child('creaciones/' + archivo.name).put(archivo)
    subirImagen.on('state_changed',function(snapshot){
      //los cambios en la carga del archivo
    }, function(error){
      console.log('error en la carga de la imagen' + error)

    }, function(success){
      //aqui se guarda la direcci'on donde se guarda el archivo
      console.log('success!'+subirImagen.snapshot.downloadURL)
      document.getElementById('url').value = subirImagen.snapshot.downloadURL
      document.getElementById('archivoName').value = archivo.name
    }
    )
  }
  else{console.log('no hay archivo q subir'+ archivo)}
}
function guardarArchivoSecundario(){
  //asi coge el segundo elemento que sea un input type file
  var archivo = document.querySelectorAll('input[type =file]')[1].files[0]
  if(archivo){
    var subirImagen = storageRef.child('creaciones/' + archivo.name).put(archivo)
    subirImagen.on('state_changed',function(snapshot){
      //los cambios en la carga del archivo
    }, function(error){
      console.log('error en la carga de la imagen' + error)

    }, function(success){
      //aqui se guarda la direcci'on donde se guarda el archivo
      console.log('success!'+subirImagen.snapshot.downloadURL)
      document.getElementById('urlSecundaria').value = subirImagen.snapshot.downloadURL
      document.getElementById('archivoNameSecundario').value = archivo.name
    }
    )
  }
  else{console.log('no hay archivo q subir'+ archivo)}
}



function SubirProducto(event){
  //cogemos el evento para que no se cambie de pagina antes de hacer el push
  //a la base de datos y recibir el then en la promesa
  event.preventDefault()
  var nombre = document.getElementById('nombre').value
  var nombreGalego = document.getElementById('nombreGalego').value
  var pic = document.getElementById('url').value
  var picName = document.getElementById('archivoName').value
  var picName2 = document.getElementById('archivoNameSecundario').value
  var picSecundaria = document.getElementById('urlSecundaria').value
  var precio = document.getElementById('precio').value
  var materiales = document.getElementById('materiales').value
  var materialesGalego = document.getElementById('materialesGalego').value
  var descripcion = document.getElementById('descripcion').value
  var descripcionGalego = document.getElementById('descripcionGalego').value
  //var unidades = 1 lo meto ya en el push
  var tipo = selectTipo()

  //////////////////////  SUBIENDO LA NUEVA CREACION   /////////////////

  escribirCreacion(nombre,nombreGalego,descripcionGalego,descripcion,pic,picSecundaria,precio,materialesGalego,materiales,tipo,picName,picName2)

}

function selectTipo(){

  let tipo = document.querySelector('input[name=tipo]:checked').value

  return tipo
}
