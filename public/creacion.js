// Initialize Firebase
var config = {
  apiKey: 'AIzaSyClcb4B5oRktWDQWGU8Ev4hgYm5p_NXgL4',
  authDomain: 'mico-62a9a.firebaseapp.com',
  databaseURL: 'https://mico-62a9a.firebaseio.com',
  projectId: 'mico-62a9a',
  storageBucket: 'mico-62a9a.appspot.com',
  messagingSenderId: '307587845773'
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
var escribirCreacion = function(nombre,descripcion,pic,precio,materiales,tipo,disponibilidad,disponibilidadFeria){
  dataBase.ref('creaciones/').push({
    nombre: nombre,
    descripcion: descripcion,
    pic: pic,
    precio:precio,
    materiales: materiales,
    tipo: tipo,
    unidades: 1,
    disponibilidad: disponibilidad,
    disponibilidadFeria: disponibilidadFeria,
  }).then (function(){
    alert ('se ha agregado correctamente el elemento a la base de datos')
    window.location = 'agregarCreacion.html'

  }).catch(function(error){
    alert ('no se pudo introducir el elemento'+ error)
  })

}
//leer elementos
var imprimirCreaciones = function(){
  var query = dataBase.ref('creaciones/')
  query.on('value',function(snapshot){
    //console.log (snapshot.val())
    var ul = document.getElementById('lista')
    snapshot.forEach(function(childSnapshot){
      let childKey = childSnapshot.key
      let childData = childSnapshot.val()

      var li = document.createElement('li')
      var div = document.createElement('div')
      var img = document.createElement('img')
      //var br = document.createElement('br')
      var button =document.createElement('button')

      button.setAttribute('id',childKey)
      button.setAttribute('onclick','eliminarElemento(this.id)')
      button.setAttribute('class', 'btn-danger')
      button.appendChild(document.createTextNode('eliminar '+ childData.nombre))

      img.src = childData.pic
      img.height = 60
      img.alt = 'imagen del elemento'
      //la imagen en el div
      div.appendChild(img)
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
      li.appendChild(document.createTextNode('disponibilidad en la PAGINA: ' + childData.disponibilidad))
      li.appendChild(document.createElement('br'))
      li.appendChild(document.createTextNode('disponibilidad en la FERIA: ' + childData.disponibilidadFeria))
      li.appendChild(document.createElement('br'))
      li.appendChild(button)

      //el li en el ul
      ul.appendChild(li)
    })
  }
  )
}
//eliminar elementos
var eliminarElemento =function(id){
  dataBase.ref('creaciones/'+id).remove().then(function(){
    alert('creacion eliminada')
    window.location = 'creaciones.html'
    console.log('creacion eliminada')
  }).catch(function(error){
    console.log('no se borro el elemento'+ error)
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
  var pic = document.getElementById('url').value
  var precio = document.getElementById('precio').value
  var materiales = document.getElementById('materiales').value
  var descripcion = document.getElementById('descripcion').value
  //var unidades = 1 lo meto ya en el push
  var tipo = selectTipo()
  var disponibilidadFeria = ''
  var disponibilidad = ''
  ///////////// disponibilidad//////////////
  if (document.getElementById('proximamente').checked) {
    disponibilidad = document.getElementById('proximamente').value
  }
  else if (document.getElementById('si').checked) {
    disponibilidad = document.getElementById('si').value
  }
  else if (document.getElementById('no').checked) {
    disponibilidad = document.getElementById('no').value
  }
  /////////////disponibilidadFeria//////////
  if (document.getElementById('proximamenteFeria').checked) {
    disponibilidadFeria = document.getElementById('proximamenteFeria').value
  }
  else if (document.getElementById('siFeria').checked) {
    disponibilidadFeria = document.getElementById('siFeria').value
  }
  else if (document.getElementById('noFeria').checked) {
    disponibilidadFeria = document.getElementById('noFeria').value
  }

  //////////////////////  SUBIENDO LA NUEVA CREACION   /////////////////

  escribirCreacion(nombre,descripcion,pic,precio,materiales,tipo,disponibilidad,disponibilidadFeria)

}

function selectTipo(){
  let tipo = ''
  if (document.getElementById('bolsos').checked) {
    tipo = document.getElementById('bolsos').value
  }
  else if (document.getElementById('faldas').checked) {
    tipo = document.getElementById('faldas').value
  }
  else if (document.getElementById('libretas').checked) {
    tipo = document.getElementById('libretas').value
  }
  else if (document.getElementById('monederos').checked) {
    tipo = document.getElementById('monederos').value
  }
  else if (document.getElementById('fundasMovil').checked) {
    tipo = document.getElementById('fundasMovil').value
  }
  else if (document.getElementById('pinzas').checked) {
    tipo = document.getElementById('pinzas').value
  }
  else if (document.getElementById('pendientes').checked) {
    tipo = document.getElementById('pendientes').value
  }
  else if (document.getElementById('mochilas').checked) {
    tipo = document.getElementById('mochilas').value
  }
  else if (document.getElementById('chapas').checked) {
    tipo = document.getElementById('chapas').value
  }
  return tipo
}

