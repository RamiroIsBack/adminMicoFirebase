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

var dataBase = firebase.database()
var imprimirUsuarios = function(){
  var query = dataBase.ref('users/')
  query.once('value',function(snapshot){
    //console.log (snapshot.val())
    var ul = document.getElementById('lista')
    snapshot.forEach(function(childSnapshot){
      let childKey = childSnapshot.key
      let childData = childSnapshot.val()

      var li = document.createElement('li')
      var buttonEliminar =document.createElement('button')

      buttonEliminar.setAttribute('id',childKey)
      buttonEliminar.setAttribute('onclick','eliminarElemento(this.id)')
      buttonEliminar.setAttribute('class', 'btn-danger')
      buttonEliminar.appendChild(document.createTextNode('eliminar '+ childData.datosPersonales.nombre))

      li.setAttribute('class', 'list-group-item')
      li.appendChild(document.createTextNode('datos de envio: ' + childData.datosEnvio.hayDatos))
      li.appendChild(document.createElement('br'))
      li.appendChild(document.createTextNode('acepta politica de datos: ' + childData.datosPersonales.fechaAltaYacepta))
      li.appendChild(document.createElement('br'))
      li.appendChild(document.createTextNode('ip: ' + childData.datosPersonales.ip))
      li.appendChild(document.createElement('br'))
      li.appendChild(document.createTextNode('proveedor de datos: ' + childData.datosPersonales.providerId))
      li.appendChild(document.createElement('br'))
      li.appendChild(document.createTextNode('nombre: ' + childData.datosPersonales.nombre))
      li.appendChild(document.createElement('br'))
      li.appendChild(document.createTextNode('email: ' + childData.datosPersonales.email))
      li.appendChild(document.createElement('br'))
      li.appendChild(document.createTextNode('identificador de usuario: ' + childData.datosPersonales.uid))
      li.appendChild(document.createElement('br'))
      li.appendChild(buttonEliminar)

      //el li en el ul
      ul.appendChild(li)
    })
  }
  )
}
//eliminar elementos
var eliminarElemento =function(id){

  dataBase.ref('users/'+id).remove().then(function(){
    window.location = 'usuarios.html'
    alert('usuario eliminado de la base de datos, decirle a Ramiro que lo elimine definitivamente de Firebase con el siguiente uid: '+id)
  }).catch(function(error){
    console.log('no se borro el elemento'+ error)
  })


}
