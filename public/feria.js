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
var escribirFeria = function(nombre,descripcion,descripcionGalego,pic,picName,fecha,fechaFinal,lugar,direccion,direccionGalego,mapsLink,urlFeria){
  dataBase.ref('ferias/').push({
    nombre: nombre,
    descripcion: descripcion,
    descripcionGalego:descripcionGalego,
    pic: pic,
    picName:picName,
    fecha:fecha,
    fechaFinal: fechaFinal,
    caducada: false,
    lugar: lugar,
    direccion: direccion,
    direccionGalego:direccionGalego,
    mapsLink: mapsLink,
    urlFeria: urlFeria,
    id: '',
    timeStamp: new Date(),
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
      li.appendChild(document.createTextNode('FECHA: ' + childData.fecha))
      li.appendChild(document.createElement('br'))
      li.appendChild(document.createTextNode('FECHA FINAL: ' + childData.fechaFinal))
      li.appendChild(document.createElement('br'))
      li.appendChild(document.createTextNode('LUGAR: ' + childData.lugar))
      li.appendChild(document.createElement('br'))
      li.appendChild(document.createTextNode('DESCRIPCION: ' + childData.descripcion))
      li.appendChild(document.createElement('br'))
      li.appendChild(document.createTextNode('DIRECCION: ' + childData.direccion))
      li.appendChild(document.createElement('br'))
      li.appendChild(document.createTextNode('MAPS LINK: ' + childData.mapsLink))
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
  alert('procesando el eliminado de la feria.... espera un momento')
  dataBase.ref('ferias/'+id).once('value',function(snapshot){
    var creacionAeliminar= snapshot.val()

    // Create a reference to the file to delete
    var pic1 = storageRef.child('ferias/'+creacionAeliminar.picName)
    // Delete the file
    pic1.delete().then(function() {
      // File deleted successfully
      dataBase.ref('ferias/'+id).remove().then(function(){
        alert('feria eliminada')
        window.location = 'ferias.html'
        console.log('ferias eliminada')
      }).catch(function(error){
        console.log('no se borro el elemento'+ error)
      })

    }).catch(function(error) {
      console.log('error al intentar borrar la pic del storage')
    })
  }).catch(function(error) {
    console.log('error al cargar la feria para ver el nombre de los archivos a borrar en el estorage')
  })
  /*dataBase.ref('ferias/'+id).remove().then(function(){
    alert('Feria eliminada')
    window.location = 'ferias.html'
    console.log('Feria eliminada')
  }).catch(function(error){
    console.log('no se borro el elemento'+ error)
  })*/
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
      document.getElementById('archivoName').value = archivo.name
    }
    )
  }
  else{console.log('no hay archivo q subir'+ archivo)}
}


function SubirFeria(event){
  //cogemos el evento para que no se cambie de pagina antes de hacer el push
  //a la base de datos y recibir el then en la promesa
  event.preventDefault()
  let nombre = document.getElementById('nombre').value
  let pic = document.getElementById('url').value
  var picName = document.getElementById('archivoName').value
  let fecha = document.getElementById('fecha').value
  let fechaFinal = document.getElementById('fechaFinal').value
  let lugar = document.getElementById('lugar').value
  let descripcion = document.getElementById('descripcion').value
  let descripcionGalego = document.getElementById('descripcionGalego').value
  let direccion = document.getElementById('direccion').value
  let direccionGalego = document.getElementById('direccionGalego').value
  let mapsLink = document.getElementById('mapsLink').value
  let urlFeria = document.getElementById('urlFeria').value

  //////////////////////  SUBIENDO LA NUEVA Feria   /////////////////

  escribirFeria(nombre,descripcion,descripcionGalego,pic,picName,fecha,fechaFinal,lugar,direccion,direccionGalego,mapsLink,urlFeria)

}
