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

// vue__________________________________________________

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
          boton: "Buscarme"
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
              console.log(nuevo)
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
            function espiner(onoff) {
              if (onoff === true) {
                  var opts = {
                        lines: 12 // The number of lines to draw
                      , length: 28 // The length of each line
                      , width: 14 // The line thickness
                      , radius: 42 // The radius of the inner circle
                      , scale: 0.5 // Scales overall size of the spinner
                      , corners: 1 // Corner roundness (0..1)
                      , color: "#000" // #rgb or #rrggbb or array of colors
                      , opacity: 0.25 // Opacity of the lines
                      , rotate: 0 // The rotation offset
                      , direction: 1 // 1: clockwise, -1: counterclockwise
                      , speed: 1 // Rounds per second
                      , trail: 60 // Afterglow percentage
                      , fps: 20 // Frames per second when using setTimeout() as a fallback for CSS
                      , zIndex: 2e9 // The z-index (defaults to 2000000000)
                      , className: "spinner" // The CSS class to assign to the spinner
                      , top: "50%" // Top position relative to parent
                      , left: "50%" // Left position relative to parent
                      , shadow: true // Whether to render a shadow
                      , hwaccel: false // Whether to use hardware acceleration
                      , position: "absolute" // Element positioning
                  }
                  var target = document.getElementById("foo");
                  var spinner = new Spinner(opts).spin(target);
                  $(target).data("spinner", spinner);
              } else {
                $("#foo").remove();
              }
            }
            function datos(cedula) {//consulta firebase
              Estado(1);
              alerta("", "azul", false)
              espiner(true)
              var refe = db.ref("app/datos/padron/" + cedula);
              refe.on("value", function(snapshot){
                var snap = snapshot.val();
                  if (snap) { console.log(snap)
                    thes.log.datos.user = snap;
                    db.ref("app/datos/code/" + snap.code).on("value", function(snapshot){
                      var code = snapshot.val();
                      thes.log.datos.code = code;
                      espiner(false);
                      thes.log.datos.visible = true;
                      Estado(2)
                    });
                  } else {
                    Estado(3)
                    espiner(false)
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
              form(true)
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
            function form(visible) {
              thes.log.form.visible = visible;
              var buscarme = "Buscarme";
              var nuevabusqueda = "Nueva Búsqueda";
              if (visible) {
                thes.log.form.boton = buscarme;
              }
              thes.log.form.boton = nuevabusqueda;
            }
            switch (estado){
              case 0://ejecutara buscando
                var cedula = Verifica();
                if (cedula) {//consulta datos
                  form(false)
                  datos(cedula)
                }
                console.log(0)
              break;
              case 1://nueva busqueda, cuando se esta buscando
                alert("¡Espere por favor!")
                console.log(1)
              break;
              case 2://nueva busq, elimina resp positiva y reestablece
                disponible()
                console.log(2)
              break;
              case 3://nueva busq, elimina resp negativa y reestablece
                disponible()
                console.log(3)
              break;
            }
      }
    },
    filters: {
        sexo: function (value) {
          var respuesta;
          if (!value) respuesta = "";
          if (value == 1) respuesta = "Masculino";
          if (value == 2) respuesta = "Femenino";
          return respuesta;
        }
      }
  })
