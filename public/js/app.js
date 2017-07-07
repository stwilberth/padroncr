// Initialize Firebase
  var config = {
    apiKey: "AIzaSyAYOuDY8ylH0RbQyTPOpyuQoNH3oEJpfk8",
    authDomain: "padron-79f32.firebaseapp.com",
    databaseURL: "https://padron-79f32.firebaseio.com",
    projectId: "padron-79f32",
    storageBucket: "padron-79f32.appspot.com",
    messagingSenderId: "859813990886"
  };
  firebase.initializeApp(config);
  var db = firebase.database();
var vaca = "muuu";
// vue__________________________________________________
$('#boton').popover('show')
  var app = new Vue({
    el: "#app",
    data: {
      log: {
        divmsj: {
          visible: true,
          estatico: "alert",
          estilo: "alert-info",
          info: "Ingrese su numero de cédula",
        },
        datos: {
          cedula: "",
          visible: false,
          user: {},
          code: {}
        },
        form: {
          visible: true,
          boton: "Buscarme",
          cargando: false,
        },
        estado: 0, //0 disponible, 1 buscando, 2 respuesta-positiva, 3 respuesta-negativa
      }
    },
    methods: {
          buscarme: function () {
            console.log("click")
            var thes = this;
            var estado = thes.log.estado;
            function Estado(nuevo) {
              console.log("funcion estado " + nuevo)
              thes.log.estado = nuevo;
            }
            function alerta(msj, tipo, visible) {
              var color = "alert-info";
              switch (tipo){
                case "verde":
                color = "alert-success";
                break;
                case "azul":
                color = "alert-info";
                break;
                case "amarillo":
                color = "alert-warning";
                break;
                case "rojo":
                color = "alert-danger";
                break;
              }
              thes.log.divmsj.visible = visible;
              thes.log.divmsj.estilo = color;
              thes.log.divmsj.info = msj;
            }
            function datos(cedula) {//consulta firebase
              Estado(1);
              alerta("", "azul", false)
              thes.log.form.cargando = true;
              Form(false, 1)
              var refe = db.ref("app/datos/padron/" + cedula);
              refe.on("value", function(snapshot){
                var snap = snapshot.val();
                  if (snap) { console.log(snap)
                    thes.log.datos.user = snap;
                    db.ref("app/datos/code/" + snap.code).on("value", function(snapshot){
                      var code = snapshot.val();
                      thes.log.datos.code = code;
                      Form(false, 2)
                      thes.log.form.cargando = false;
                      thes.log.datos.visible = true;
                      Estado(2)
                    });
                  } else {
                    thes.log.form.cargando = false;
                    Estado(3)
                    Form(false, 2)
                    console.log("hola")
                    var msj = "¡No se encuentra información para este numero de cédula: " + cedula + "!"
                    alerta(msj, "rojo", true)
                  }
              });
            }
            function disponible() {//reestablece todo
              var info = "Ingrese su numero de cédula";
              thes.log.datos.visible = false;
              thes.log.datos.user = "";
              thes.log.datos.code = "";
              thes.log.datos.cedula = "";
              alerta(info, "azul", true)
              Form(true, 0)
              Estado(0)
            }
            function Verifica() { // devuelve cedula o false
              var cedula = thes.log.datos.cedula;
              var vaciomsj = "¡Ingrese su numero de cedula!";
              var incompletomsj = "¡Ingrese un numero de cedula valido!";
              var nueve;
              if (cedula) {
                  nueve = cedula.length;
              } else {
                  alerta(vaciomsj, "amarillo", true)
                  return false
                }
              if (nueve === 9) {
                  return cedula;
              } else {
                  alerta(incompletomsj, "amarillo", true)
                  return false
                }
            }
            function Form(visible, boton) {
              console.log(visible + " " + boton)
              thes.log.form.visible = visible;
              var btnmsj = ["Buscarme", "Cargando...", "Nueva Búsqueda"];
              thes.log.form.boton = btnmsj[boton]
            }
            switch (estado){
              case 0://ejecutara buscando
                var cedula = Verifica();
                if (cedula) {//consulta datos
                  datos(cedula)
                }
                console.log("case: " +0)
              break;
              case 1://nueva busqueda, cuando se esta buscando
                alert("¡Espere por favor!")
                console.log("case: " +1)
              break;
              case 2://nueva busq, elimina resp positiva y reestablece
                disponible()
                console.log("case: " +2)
              break;
              case 3://nueva busq, elimina resp negativa y reestablece
                disponible()
                console.log("case: " +3)
              break;
            }
      }
    },
    filters: {
        sexo: function (value) {
          var respuesta;
          if (!value) respuesta = "";
          if (value == 1) respuesta = "MASCULINO";
          if (value == 2) respuesta = "FEMENENINO";
          return respuesta;
        }
      }
  })
