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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//SUBIR ENLACES DE MICO
///////////////////////

//SUBIR Contacto

function subirContact(event){
  //cogemos el evento para que no se cambie de pagina antes de hacer el push
  //a la base de datos y recibir el then en la promesa
  event.preventDefault()
  var contactMail = document.getElementById('contactMail').value
  var contactPhone = document.getElementById('contactPhone').value
  var contactHours = document.getElementById('contactHours').value
  var contactPost = document.getElementById('contactPost').value

  escribirContact(contactMail, contactPhone, contactHours, contactPost)
}
//crear descripcionTipo

var escribirContact = function(contactMail, contactPhone, contactHours, contactPost){
  dataBase.ref('enlaces/contact').set({
    contactMail: contactMail,
    contactPhone: contactPhone,
    contactHours:contactHours,
    contactPost:contactPost,
    id:'',
    timeStamp: Date.now(),

  }).then (function(){
    alert ('se ha agregado correctamente el elemento a la base de datos')
    window.location = 'enlaces.html'

  }).catch(function(error){
    alert ('no se pudo introducir el elemento'+ error)
  })

}

imprimirContactDB = function(){
  var ref = dataBase.ref('enlaces/contact')
  ref.once('value').then(function(snapshot){
    let data =snapshot.val()
    document.getElementById('contactMailDB').value = data.contactMail
    document.getElementById('contactPhoneDB').value = data.contactPhone
    document.getElementById('contactHoursDB').value = data.contactHours
    document.getElementById('contactPostDB').value = data.contactPost

  })
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//SUBIR ENLACES DE FACEBOOK

function subirUrlFacebook(event){
  //cogemos el evento para que no se cambie de pagina antes de hacer el push
  //a la base de datos y recibir el then en la promesa
  event.preventDefault()
  var urlFacebook = document.getElementById('urlFacebook').value
  escribirUrlFacebook(urlFacebook)
}
//crear descripcionTipo

var escribirUrlFacebook = function(urlFacebook){
  dataBase.ref('enlaces/facebook').set({
    urlFacebook: urlFacebook,
    id:'',
    timeStamp: Date.now(),

  }).then (function(){
    alert ('se ha agregado correctamente el elemento a la base de datos')
    window.location = 'enlaces.html'

  }).catch(function(error){
    alert ('no se pudo introducir el elemento'+ error)
  })

}

//leer tipo Creaciones
imprimirUrlFacebookDB = function(){
  var ref = dataBase.ref('enlaces/facebook')
  ref.once('value').then(function(snapshot){
    let data =snapshot.val()
    document.getElementById('urlFacebookDB').value = data.urlFacebook

  })
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


//SUBIR ENLACES DE TWITER

function subirUrlTwiter(event){
  //cogemos el evento para que no se cambie de pagina antes de hacer el push
  //a la base de datos y recibir el then en la promesa
  event.preventDefault()
  var urlTwiter = document.getElementById('urlTwiter').value
  escribirUrlTwiter(urlTwiter)
}
//crear descripcionTipo

var escribirUrlTwiter = function(urlTwiter){
  dataBase.ref('enlaces/twiter').set({
    urlTwiter: urlTwiter,
    id:'',
    timeStamp: Date.now(),

  }).then (function(){
    alert ('se ha agregado correctamente el elemento a la base de datos')
    window.location = 'enlaces.html'

  }).catch(function(error){
    alert ('no se pudo introducir el elemento'+ error)
  })

}

//leer tipo Creaciones
imprimirUrlTwiterDB = function(){
  var ref = dataBase.ref('enlaces/twiter')
  ref.once('value').then(function(snapshot){
    let data =snapshot.val()
    document.getElementById('urlTwiterDB').value = data.urlTwiter

  })
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//SUBIR ENLACES DE INSTAGRAM

function subirUrlInstagram(event){
  //cogemos el evento para que no se cambie de pagina antes de hacer el push
  //a la base de datos y recibir el then en la promesa
  event.preventDefault()
  var urlInstagram = document.getElementById('urlInstagram').value
  escribirUrlInstagram(urlInstagram)
}
//crear descripcionTipo

var escribirUrlInstagram = function(urlInstagram){
  dataBase.ref('enlaces/instagram').set({
    urlInstagram: urlInstagram,
    id:'',
    timeStamp: Date.now(),

  }).then (function(){
    alert ('se ha agregado correctamente el elemento a la base de datos')
    window.location = 'enlaces.html'

  }).catch(function(error){
    alert ('no se pudo introducir el elemento'+ error)
  })

}

//leer tipo Creaciones
imprimirUrlInstagramDB = function(){
  var ref = dataBase.ref('enlaces/instagram')
  ref.once('value').then(function(snapshot){
    let data =snapshot.val()
    document.getElementById('urlInstagramDB').value = data.urlInstagram

  })
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//SUBIR ENLACES DE Youtube

function subirUrlYoutube(event){
  //cogemos el evento para que no se cambie de pagina antes de hacer el push
  //a la base de datos y recibir el then en la promesa
  event.preventDefault()
  var urlYoutube = document.getElementById('urlYoutube').value
  escribirUrlYoutube(urlYoutube)
}
//crear descripcionTipo

var escribirUrlYoutube = function(urlYoutube){
  dataBase.ref('enlaces/youtube').set({
    urlYoutube: urlYoutube,
    id:'',
    timeStamp: Date.now(),

  }).then (function(){
    alert ('se ha agregado correctamente el elemento a la base de datos')
    window.location = 'enlaces.html'

  }).catch(function(error){
    alert ('no se pudo introducir el elemento'+ error)
  })

}

//leer tipo Creaciones
imprimirUrlYoutubeDB = function(){
  var ref = dataBase.ref('enlaces/Youtube')
  ref.once('value').then(function(snapshot){
    let data =snapshot.val()
    document.getElementById('urlYoutubeDB').value = data.urlYoutube

  })
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
