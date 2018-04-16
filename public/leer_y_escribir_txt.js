//parte de html


<div class= "container" style="border:1px solid #cecece;">
  <form onsubmit="subirTxtCreaciones(event)">
    <h4 style="text-align: center;">descripcion general de las creaciones</h4>
    <div class=" form-group row">
      <label class="col-sm-4 form-control-label">el nombre del archivo de texto (.txt) sin espacios</label>
      <div class="col-sm-4">
        <input type="file" class="form-control" id="txtCreaciones" onChange = 'guardarTxtCreaciones()' required="required" />
      </div>
      <div class="col-sm-4">
        <input type='text' class='form-control' id ='urlTxtCreaciones' placeholder="esto se rellena solo cuando metes el .txt" readonly="readonly" required="required"></input>
      </div>
    </div>
    <div class="form-group row" style="background-color: #F2F2F2">
      <div class="col-sm-1 col-sm-offset-3">
        <button type="button" onclick='imprimirTxtCreacionesBD()' class="btn btn-success pull-right" >ver texto anterior en base de datos:</button>
      </div>
      <div class="col-sm-8">
        <embed src="" id = 'txtCreacionesDB' style="height: 200px ; width: 620px"></embed>
      </div>
    </div>
    <div class="row">
      <div class="container">
        <button type="submit" class="btn btn-primary text-center" style="display: block; width: 100%;" >Subir la descripcion general de las creaciones</button>
      </div>
    </div>
  </form>
</div>


// parte de javascript


imprimirTxtCreacionesBD = function(){
  var ref = dataBase.ref('contenidos/creaciones/descripcion')
  ref.once('value').then(function(snapshot){
    let data =snapshot.val()
    let embed = document.getElementById('txtCreacionesDB')
    //doesn't work just by setting the new src
    /*cloneNode() creates a copy of a node, that's all. The node inside the DOM will be replaced (using replaceChild() )by this copy(after the src-attribute of the copy has been changed). developer.mozilla.org/En/DOM/Node.cloneNode*/
    var clone= embed.cloneNode(true)
    clone.setAttribute('src',data.urlTxtCreaciones)
    embed.parentNode.replaceChild(clone,embed)

    console.log('esta es la direccion del txt en el db: '+ data.urlTxtCreaciones)
  })

}

function guardarTxtCreaciones(){
  //el [1] es xq ya habia un imput file mas arriba q este, es xa seleccionarlo
  var archivo = document.querySelectorAll('input[type =file]')[1].files[0]
  if(archivo){
    var subirTxt = storageRef.child('contenidos/' + archivo.name).put(archivo)
    subirTxt.on('state_changed',function(snapshot){
      //los cambios en la carga del archivo
    }, function(error){
      console.log('error en la carga del txt' + error)

    }, function(success){
      //aqui se guarda la direcci'on donde se guarda el archivo
      console.log('success!'+subirTxt.snapshot.downloadURL)
      document.getElementById('urlTxtCreaciones').value = subirTxt.snapshot.downloadURL
    }
    )
  }
  else{console.log('no hay archivo q subir'+ archivo)}
}
function subirTxtCreaciones(event){
  //cogemos el evento para que no se cambie de pagina antes de hacer el push
  //a la base de datos y recibir el then en la promesa
  event.preventDefault()
  var urlTxtCreaciones = document.getElementById('urlTxtCreaciones').value
  escribirsubirTxtCreaciones(urlTxtCreaciones)
}
//crear textCreaciones

var escribirsubirTxtCreaciones = function(urlTxtCreaciones){
  dataBase.ref('contenidos/creaciones/descripcion').set({
    urlTxtCreaciones: urlTxtCreaciones,
    id:'',
    timeStamp: Date.now(),

  }).then (function(){
    alert ('se ha agregado correctamente el elemento a la base de datos')
    window.location = 'contenido.html'

  }).catch(function(error){
    alert ('no se pudo introducir el elemento'+ error)
  })

}
