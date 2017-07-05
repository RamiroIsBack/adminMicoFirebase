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
var escribirFeria = function(nombre,descripcion,pic,fecha,lugar,direccion,urlFeria){
  dataBase.ref('ferias/').push({
    nombre: nombre,
    descripcion: descripcion,
    pic: pic,
    fecha:fecha,
    lugar: lugar,
    direccion: direccion,
    urlFeria: urlFeria,
  }).then (function(){
    alert ('se ha agregado correctamente el elemento a la base de datos')
    window.location = 'agregarFeria.html'

  }).catch(function(error){
    alert ('no se pudo introducir el elemento'+ error)
  })

}
//leer elementos
var imprimirFerias = function(){
  var query = dataBase.ref('ferias/')
  query.on('value',function(snapshot){
    //console.log (snapshot.val())
    var ul = document.getElementById('lista')
    snapshot.forEach(function(childSnapshot){
      let childKey = childSnapshot.key
      let childData = childSnapshot.val()

      var li = document.createElement('li')
      var div = document.createElement('div')
      var img = document.createElement('img')
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
      li.appendChild(document.createTextNode('fecha: ' + childData.fecha))
      li.appendChild(document.createElement('br'))
      li.appendChild(document.createTextNode('lugar: ' + childData.lugar))
      li.appendChild(document.createElement('br'))
      li.appendChild(document.createTextNode('DESCRIPCION: ' + childData.descripcion))
      li.appendChild(document.createElement('br'))
      li.appendChild(document.createTextNode('direccion: ' + childData.direccion))
      li.appendChild(document.createElement('br'))
      li.appendChild(document.createTextNode('urlFeria en la PAGINA: ' + childData.urlFeria))
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
  dataBase.ref('ferias/'+id).remove().then(function(){
    alert('Feria eliminada')
    window.location = 'ferias.html'
    console.log('Feria eliminada')
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
    var subirImagen = storageRef.child('ferias/' + archivo.name).put(archivo)
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


function SubirFeria(event){
  //cogemos el evento para que no se cambie de pagina antes de hacer el push
  //a la base de datos y recibir el then en la promesa
  event.preventDefault()
  var nombre = document.getElementById('nombre').value
  var pic = document.getElementById('url').value
  var fecha = document.getElementById('fecha').value
  var lugar = document.getElementById('lugar').value
  var descripcion = document.getElementById('descripcion').value
  //var unidades = 1 lo meto ya en el push
  var direccion = document.getElementById('direccion').value
  var urlFeria = document.getElementById('urlFeria').value

  //////////////////////  SUBIENDO LA NUEVA Feria   /////////////////

  escribirFeria(nombre,descripcion,pic,fecha,lugar,direccion,urlFeria)

}


