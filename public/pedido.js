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

//leer elementos
var imprimirPedidos = function(){
  var query = dataBase.ref('users/')
  var ul = document.getElementById('lista')//this is the lista in d .html
  var userList = {}
  var precioTotal, carro, datosCompra, datosEnvio = ''
  query.once('value',function(snapshot){
    userList = snapshot.val()
    //console.log (userList)
    var keyUserList=''
    var keyPedidos = ''
    for(keyUserList in userList){
      if (userList.hasOwnProperty(keyUserList)) {
        var user = userList[keyUserList]
        for(keyPedidos in user.pedidos){
          if(user.pedidos.hasOwnProperty(keyPedidos)){
            var pedido = user.pedidos[keyPedidos]
            datosEnvio = pedido.datosEnvio
            datosCompra = pedido.datosCompra
            carro = pedido.carro
            precioTotal = carro.precioSubTotal + carro.envio

            var li = document.createElement('li')
            li.style.display = 'table'
            var divCarro = document.createElement('div')
            var divActionButton = document.createElement('div')
            var divDatosPersonales = document.createElement('div')
            var divDatosCompra = document.createElement('div')



            //preparando el divDatosCompra
            divDatosCompra.setAttribute('class', 'col-xs-6 col-sm-6 col-md-6 col-lg-6')

            divDatosCompra.appendChild(document.createTextNode('fecha: '+datosCompra.fechaPedido))
            divDatosCompra.appendChild(document.createElement('br'))
            divDatosCompra.appendChild(document.createTextNode('precio total: ' + precioTotal))
            divDatosCompra.appendChild(document.createElement('br'))
            divDatosCompra.style.marginBottom = '20px'

            //preparando el divCarro

            divCarro.setAttribute('class', 'container col-xs-6 col-sm-6 col-md-6 col-lg-6')
            divCarro.style.display = 'table'
            for (var i =0 ; i< carro.cartList.length;i++){
              //la imagen y nombre de la creacion en el divCarro
              var img = document.createElement('img')
              img.src = carro.cartList[i].pic
              img.height = 60
              img.alt = 'img creacion'
              divCarro.appendChild(document.createTextNode(carro.cartList[i].nombre))
              divCarro.appendChild(img)
              divCarro.appendChild(document.createElement('hr'))

            }

            divCarro.style.float = 'right'

            //preparando el divDatosPersonales

            divDatosPersonales.setAttribute('class', 'col-xs-12 col-sm-12 col-md-12 col-lg-12')
            divDatosPersonales.appendChild(document.createTextNode(datosEnvio.nombreCompletoEnvio))
            divDatosPersonales.appendChild(document.createElement('br'))
            divDatosPersonales.appendChild(document.createTextNode(datosEnvio.calle))
            divDatosPersonales.appendChild(document.createElement('br'))
            divDatosPersonales.appendChild(document.createTextNode(datosEnvio.localidad +' '+ datosEnvio.cp))
            divDatosPersonales.appendChild(document.createElement('br'))
            divDatosPersonales.appendChild(document.createTextNode(datosEnvio.provincia))
            divDatosPersonales.style.marginBottom = '20px'


            divActionButton.setAttribute('class', 'col-xs-12 col-sm-12 col-md-12 col-lg-12')
            divActionButton.style.marginBottom = '20px'
            if(datosCompra.localizador){
              // ya se envio el paquete ahora keda ponerlo a 'enviado'

              if(datosCompra.entregado){
                divActionButton.appendChild(document.createTextNode('estado del envio-----> ENTREGADO'))
                divActionButton.appendChild(document.createElement('br'))
                divActionButton.appendChild(document.createTextNode('fecha en que lo marcaste como entregado: '+ datosCompra.entregadoTime))
                divActionButton.appendChild(document.createElement('br'))


              }else{
                divActionButton.appendChild(document.createTextNode('estado del envio-----> PAQUETE ENVIADO'))
                divActionButton.appendChild(document.createElement('br'))
                divActionButton.appendChild(document.createTextNode('localizador: '+ datosCompra.localizador))
                divActionButton.appendChild(document.createElement('br'))


                var infoButtonEnviadoTextNode = document.createTextNode('cuando ya esté entregado el paquete, pulsa este boton para que ya te aparzca a ti y al usuario como entregado' )

                divActionButton.appendChild(infoButtonEnviadoTextNode)
                //meto el boton para subir el localizador
                var button =document.createElement('button')

                button.setAttribute('id',datosCompra.paymentID)
                button.setAttribute('onclick','paqueteEntregado(this.id)')
                button.setAttribute('class', 'btn btn-success text-center')
                button.appendChild(document.createTextNode('marcar como entregado'))

                divActionButton.appendChild(button)
              }
            }else{
              //meto el input para el localizador y el boton para subirlo

              divActionButton.setAttribute('class', 'col-xs-12 col-sm-12 col-md-12 col-lg-12')
              var infoLocalizadorTextNode = document.createTextNode('mete aqui el numero localizador (o codigo de envio) del paquete proporcionado por la empresa de mensajeria ' )

              divActionButton.appendChild(infoLocalizadorTextNode)
              var inputLocalizador= document.createElement('input')
              inputLocalizador.type = 'text'
              var idLocalizador ='localizador-'+datosCompra.paymentID
              inputLocalizador.setAttribute('id',idLocalizador)
              divActionButton.appendChild(inputLocalizador)

              var infoMensajeriaURLTextNode = document.createTextNode(' en el siguiente pon el enlace a la parte de la pagina web del servicio de mensajeria donde se pone el localizador para seguir un paquete ' )

              divActionButton.appendChild(infoMensajeriaURLTextNode)
              var inputURL= document.createElement('input')
              inputURL.type = 'text'
              var idMensajeriaURL ='url-'+datosCompra.paymentID
              inputURL.setAttribute('id',idMensajeriaURL)
              divActionButton.appendChild(inputURL)

              var infoButtonPreparandoTextNode = document.createTextNode(' Una vez rellenados los 2 campos dale al boton, esto mandara un email de paquete enviado y el usuario podra ver el localizador y direcion web para hacer siguimiento' )

              divActionButton.appendChild(infoButtonPreparandoTextNode)
              //meto el boton para subir el localizador
              var button =document.createElement('button')

              button.setAttribute('id',datosCompra.paymentID)
              button.setAttribute('onclick','paqueteEnviado(this.id)')
              button.setAttribute('class', 'btn btn-primary text-center')
              button.appendChild(document.createTextNode('subir localizador'))

              divActionButton.appendChild(button)

            }

            //hago un div para guardar el uid
            var divUid = document.createElement('div')

            divUid.setAttribute('uid',keyUserList)
            divUid.setAttribute('id','div-'+keyPedidos)


            //meto los div en el li

            li.setAttribute('class', 'list-group-item')
            li.appendChild(divCarro)
            li.appendChild(divDatosCompra)
            li.appendChild(divDatosPersonales)
            li.appendChild(divActionButton)
            li.appendChild(divUid)

            li.appendChild(document.createElement('br'))
            li.appendChild(document.createElement('br'))
            li.appendChild(document.createElement('br'))
            li.appendChild(document.createElement('br'))

            //el li en el ul
            ul.appendChild(li)
          }

        }
      }
    }



  }
  )
}


//subir datos de paquete enviado
var paqueteEnviado =function(paymentId){
  var idLocalizador = 'localizador-'+paymentId
  var idMensajeriaURL = 'url-'+paymentId
  var uidDiv = 'div-'+paymentId
  var localizadorPaquete = document.getElementById(idLocalizador).value
  var urlPaquete = document.getElementById(idMensajeriaURL).value
  var uid = document.getElementById(uidDiv).attributes['uid'].value
  if(localizadorPaquete === ''){
    alert('introduce el numero de localizador del envio')
    return
  }else if(urlPaquete === ''){
    alert('introduce la web del servicio de mensajeria')
    return
  }
  var today = dameFecha()

  dataBase.ref('users/'+uid+'/pedidos/'+paymentId+'/datosCompra')
    .update({
      localizador:localizadorPaquete,
      urlMensajeria:urlPaquete,
      enviadoTime: today,
    }).then (function(){
      alert('paquete enviado, tanto el usuario como tu recibireis un email')
      window.location = 'pedidos.html'
      console.log('localizador guardado, esto lanza la funcion de mandar emails')
    }).catch(function(error){
      console.log('no se guardo el localizador'+ error)
    })

}

//subir datos de paquete ENTREGADO
var paqueteEntregado =function(paymentId){

  var uidDiv = 'div-'+paymentId
  var uid = document.getElementById(uidDiv).attributes['uid'].value

  var today = dameFecha()

  dataBase.ref('users/'+uid+'/pedidos/'+paymentId+'/datosCompra')
    .update({
      entregado:true,
      entregadoTime: today,
    }).then (function(){
      alert ('ya está marcado este pedido como entregado')
      window.location = 'pedidos.html'
      console.log('ya está marcado este pedido como entregado')
    }).catch(function(error){
      alert ('ha habido algún problema al ponerlo a entregado dale otra vez luego a ver ')
      console.log('ha habido algún problema al ponerlo a entregado'+ error)
    })
}

var dameFecha =function (){
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

  return today = dd + '/' + mm + '/' + yyyy
}
