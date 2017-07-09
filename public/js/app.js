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

  function lg(dato) {
    console.log(dato)
  }

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
          boton: "Buscarme",
          cargando: false,
        },
        mapa: {
          lugar: "Costa Rica",
          mapa: "",
          geocoder: "",
        },
        estado: 0, //0 disponible, 1 buscando, 2 respuesta-positiva, 3 respuesta-negativa
      }
    },
    methods: {
      buscarme: function () {

            lg("click buscarme")
            var thes = this;
            var estado = thes.log.estado;
            function Estado(nuevo) {
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
                      console.log(code)
                      thes.log.datos.code = code;
                      var canton;
                      if (code.canton === "CENTRAL") {
                        canton = code.provincia;
                      } else {
                        canton = code.canton;
                      }
                      thes.log.mapa.lugar = code.distrito + ", " + canton + ", " + code.provincia;
                      console.log(thes.log.mapa.lugar)
                      Form(false, 2)
                      thes.log.form.cargando = false;
                      thes.log.datos.visible = true;
                      Estado(2)
                      app.geocodeAddress(thes.log.mapa.geocoder, thes.log.mapa.mapa);
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
              break;
              case 1://nueva busqueda, cuando se esta buscando
                alert("¡Espere por favor!")
              break;
              case 2://nueva busq, elimina resp positiva y reestablece
                disponible()
              break;
              case 3://nueva busq, elimina resp negativa y reestablece
                disponible()
              break;
            }
      },
      mapa: function () {
        var thes = this;
        var map = new google.maps.Map(document.getElementById('map'), {
          zoom: 10,
          center: {lat: 9.93774, lng: -84.041977}
        });
        thes.log.mapa.mapa = map;
        var geocoder = new google.maps.Geocoder();
        thes.log.mapa.geocoder = geocoder;
      },
      geocodeAddress: function (geocoder, resultsMap) {
        var thes = this;
        var address = thes.log.mapa.lugar;
        geocoder.geocode({'address': address}, function(results, status) {
          if (status === 'OK') {
            resultsMap.setCenter(results[0].geometry.location);
            var marker = new google.maps.Marker({
              map: resultsMap,
              position: results[0].geometry.location
            });
          } else {
            alert('No se encontró resultados en Google Maps: ' + status);
          }
        });
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