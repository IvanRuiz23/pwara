
var url = window.location.href;
var swLocation = '/Mi Crud/sw.js';

var swReg;

if ( navigator.serviceWorker ) {


    if ( url.includes('localhost') ) {
        swLocation = '/sw.js';
    }


    window.addEventListener('load', function() {

        navigator.serviceWorker.register( swLocation ).then( function(reg){

            swReg = reg;
            swReg.pushManager.getSubscription().then( verificaSuscripcion );

        });

    });

}





// Referencias de jQuery
var googleMapKey = 'AIzaSyA5mjCwx1TRLuBAjwQw84WE6h5ErSe7Uj8';


var titulo      = $('#titulo');
var nuevoBtn    = $('#nuevo-btn');
var salirBtn    = $('#salir-btn');
var cancelarBtn = $('#cancel-btn');
var postBtn     = $('#post-btn');
var avatarSel   = $('#seleccion');
var timeline    = $('#timeline');

var modal       = $('#modal');
// var modalAvatar = $('#modal-avatar');
var id =  $('#idtask');
var avatarBtns  = $('.seleccion-avatar');
var txtMensaje  = $('#txtMensaje');
var inputfecha  = $('#inputdate01');
var selectprioridad = $('#inputGroupSelect01');
// var inputstatus = $('#inputstatus');

var btnActivadas    = $('.btn-noti-activadas');
var btnDesactivadas = $('.btn-noti-desactivadas');


var btnLocation      = $('#location-btn');

var modalMapa        = $('.modal-mapa');

var btnTomarFoto     = $('#tomar-foto-btn');
var btnPhoto         = $('#photo-btn');
var contenedorCamara = $('.camara-contenedor');
const camara = new Camara($('#player')[0]);


var lat  = null;
var lng  = null; 
var foto = null; 

var fecha = null;
var prioridad  = null; 
// El usuario, contiene el ID del héroe seleccionado
var usuario;


// ===== Codigo de la aplicación

function crearMensajeHTML(mensaje, personaje, lat, lng,foto, fecha, prioridad, id,status) {
    var valprioridad = '';
    if(prioridad=='1'){
        valprioridad ='Baja';
    }
    if(prioridad=='2'){
        valprioridad ='Media';
    }
    if(prioridad=='3'){
        valprioridad ='Alta';
    }
    var statusfin ="";
    var html = "";
    if(status=='0'){
        statusfin="En proceso";
        html = '<i class="fa fa-circle" aria-hidden="true"></i>';
    }
    if(status=='1'){
        statusfin="Terminado";
        html ='<i class="fa fa-check" aria-hidden="true"></i>';
    }
    // console.log(mensaje, personaje, lat, lng);
    var content =`
    <div class="row">
    <div class="col-10">
    <li class="animated fadeIn fast"
        data-tipo="mensaje">
        <div class="bubble-container">
            <div class="bubble">
                <div class="row"> 
                    
                    <div class="col-4"><h5>Fecha estimada: ${ fecha }</h5> </div>
                    <div class="col-4"><h5>Nivel de prioridad: ${ valprioridad }</h5> </div>
                    <div class="col-4"><h5>Estatus: ${html}${ statusfin }</h5></div>
                    
                </div>
                
                <br/>
                ${ mensaje }
                `;
    if ( foto ) {
        content += `
                <br>
                <img class="foto-mensaje" src="${ foto }">
        `;
    }
        
    content += `</div>        
                <div class="arrow"></div>
            </div>
        </li>
    </div>
        <div class="col-2  w-20" style="margin-top: 50px !important;">
            <div class="row">
            <div class="col-6">
                <button type="button" class="btn btn-success" onclick="actualizarstatus(${id});"><i class="fa fa-check" aria-hidden="true"></i></button>
            </div>
            <div class="col-6">
                <button type="button" class="btn btn-danger" onclick="deletetask(${id});"><i class="fa fa-trash" aria-hidden="true"></i></button>
            </div>
        </div>
    </div>
    </div>
        
    `;

    
    // si existe la latitud y longitud, 
    // llamamos la funcion para crear el mapa
    if ( lat ) {
        crearMensajeMapa( lat, lng, personaje );
    }
    
    // Borramos la latitud y longitud por si las usó
    lat = null;
    lng = null;

    $('.modal-mapa').remove();

    timeline.prepend(content);
    cancelarBtn.click();

}



function crearMensajeMapa(lat, lng, personaje) {


    let content = `
    <li class="animated fadeIn fast"
        data-tipo="mapa"
        data-user="${ personaje }"
        data-lat="${ lat }"
        data-lng="${ lng }">
                <div class="bubble-container">
                    <div class="bubble">
                        <iframe
                            width="100%"
                            height="250"
                            frameborder="0" style="border:0"
                            src="https://www.google.com/maps/embed/v1/view?key=${ googleMapKey }&center=${ lat },${ lng }&zoom=17" allowfullscreen>
                            </iframe>
                    </div>
                    
                    <div class="arrow"></div>
                </div>
            </li> 
    `;

    timeline.prepend(content);
}
function actualizarstatus(id){
    if (confirm("Desea marcarlo como terminado la actividad "+id+"?")) {
        //   console.log("Has pulsado aceptar");
          var data = {
            position: id,
        };
    
        fetch('api/actualizarstatus', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify( data )
        })
        .then( res => res.json() )
        .then( res => console.log( 'app.js', res ))
        .then(location.reload())
        .catch( err => console.log( 'app.js error:', err ));
        } else {
          console.log("Has pulsado cancelar");
        }
}

function deletetask(id){
        if (confirm("Desea eliminar la actividad "+id+"?")) {
        //   console.log("Has pulsado aceptar");
          var data = {
            position: id,
        };
    
    
        fetch('api/borrartask', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify( data )
        })
        .then( res => res.json() )
        .then( res => console.log( 'app.js', res ))
        .then(location.reload())
        .catch( err => console.log( 'app.js error:', err ));
        } else {
          console.log("Has pulsado cancelar");
        }

}


// Globals
function logIn( ingreso ) {

    if ( ingreso ) {
        nuevoBtn.removeClass('oculto');
        salirBtn.removeClass('oculto');
        timeline.removeClass('oculto');
        avatarSel.addClass('oculto');
        // modalAvatar.attr('src', 'img/avatars/' + usuario + '.jpg');
    } else {
        nuevoBtn.addClass('oculto');
        salirBtn.addClass('oculto');
        timeline.addClass('oculto');
        avatarSel.removeClass('oculto');

        titulo.text('Seleccione Personaje');
    
    }

}


// Seleccion de personaje
avatarBtns.on('click', function() {

    // usuario = $(this).data('user');

    titulo.text('Hola, aquí se encuentran sus actividades...');

    logIn(true);

});

// Boton de salir
salirBtn.on('click', function() {

    logIn(false);

});

// Boton de nuevo mensaje
nuevoBtn.on('click', function() {

    modal.removeClass('oculto');
    modal.animate({ 
        marginTop: '-=1000px',
        opacity: 1
    }, 200 );

});


// Boton de cancelar mensaje
cancelarBtn.on('click', function() {

    if ( !modal.hasClass('oculto') ) {
        modal.animate({ 
            marginTop: '+=1000px',
            opacity: 0
         }, 200, function() {
             modal.addClass('oculto');
             modalMapa.addClass('oculto');
             txtMensaje.val('');
             id.val('');
             inputfecha.val('');
             selectprioridad.val(0);
             
         });
    }

});

// Boton de enviar mensaje
postBtn.on('click', function() {
    var ids = id.val();
    var mensaje = txtMensaje.val();
    var fecha = inputfecha.val();
    var prioridad = selectprioridad.val();
    // var status = inputstatus.val();

    if ( mensaje.length === 0 ) {
        cancelarBtn.click();
        return;
    }

    var data = {
        id: ids,
        mensaje: mensaje,
        user: usuario,
        lat: lat,
        lng: lng,
        foto: foto,
        fecha: fecha,
        prioridad: prioridad,
        status:'0'
    };


    fetch('api', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify( data )
    })
    .then( res => res.json() )
    .then( res => console.log( 'app.js', res ))
    .then( location.reload())
    .catch( err => console.log( 'app.js error:', err ));

    // camera.apagar();
    // contenedorCamara.addClass('oculto');
    // console.log(res.mensaje);
    crearMensajeHTML( mensaje, usuario, lat, lng,foto, fecha, prioridad, popid+1, '0');
    
    foto = null;
});



// Obtener mensajes del servidor
var popid = 0;
function getMensajes() {
    let i = 0;
    fetch('api')
        .then( res => res.json() )
        .then( posts => {
            // console.log(posts.indexOf(posts));
            // console.log(posts[0]);
            // alert(posts[0][posts.indexOf()])
            posts.forEach( post => 
                // console.log(i)
                crearMensajeHTML( post.mensaje, post.user, post.lat, post.lng, post.foto, post.fecha, post.prioridad, i++,post.status ));
        });
        popid =i;


}

getMensajes();



// Detectar cambios de conexión
function isOnline() {

    if ( navigator.onLine ) {
        // tenemos conexión
        // console.log('online');
        $.mdtoast('Online', {
            interaction: true,
            interactionTimeout: 1000,
            actionText: 'OK!'
        });


    } else{
        // No tenemos conexión
        $.mdtoast('Offline', {
            interaction: true,
            actionText: 'OK',
            type: 'warning'
        });
    }

}

window.addEventListener('online', isOnline );
window.addEventListener('offline', isOnline );

isOnline();


// Notificaciones
function verificaSuscripcion( activadas ) {

    if ( activadas ) {
        
        btnActivadas.removeClass('oculto');
        btnDesactivadas.addClass('oculto');

    } else {
        btnActivadas.addClass('oculto');
        btnDesactivadas.removeClass('oculto');
    }

}



function enviarNotificacion() {

    const notificationOpts = {
        body: 'Este es el cuerpo de la notificación',
        icon: 'img/icons/icon-72x72.png'
    };


    const n = new Notification('Hola Mundo', notificationOpts);

    n.onclick = () => {
        console.log('Click');
    };

}


function notificarme() {

    if ( !window.Notification ) {
        // 
        console.log('Este navegador no soporta notificaciones');
        return;
    }

    if ( Notification.permission === 'granted' ) {
        
        // new Notification('Hola Mundo! - granted');
        enviarNotificacion();

    } else if ( Notification.permission !== 'denied' || Notification.permission === 'default' )  {

        Notification.requestPermission( function( permission ) {

            console.log( permission );

            if ( permission === 'granted' ) {
                // new Notification('Hola Mundo! - pregunta');
                enviarNotificacion();
            }

        });

    }



}

// notificarme();


// Get Key
function getPublicKey() {

    // fetch('api/key')
    //     .then( res => res.text())
    //     .then( console.log );

    return fetch('api/key')
        .then( res => res.arrayBuffer())
        // returnar arreglo, pero como un Uint8array
        .then( key => new Uint8Array(key) );


}

// getPublicKey().then( console.log );
btnDesactivadas.on( 'click', function() {

    if ( !swReg ) return console.log('No hay registro de SW');

    getPublicKey().then( function( key ) {

        swReg.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: key
        })
        .then( res => res.toJSON() )
        .then( suscripcion => {

            // console.log(suscripcion);
            fetch('api/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify( suscripcion )
            })
            .then( verificaSuscripcion )
            .catch( cancelarSuscripcion );


        });


    });


});



function cancelarSuscripcion() {

    swReg.pushManager.getSubscription().then( subs => {

        subs.unsubscribe().then( () =>  verificaSuscripcion(false) );

    });


}

btnActivadas.on( 'click', function() {

    cancelarSuscripcion();


});


// Crear mapa en el modal
function mostrarMapaModal(lat, lng) {

    $('.modal-mapa').remove();
    
    var content = `
            <div class="modal-mapa">
                <iframe
                    width="100%"
                    height="250"
                    frameborder="0"
                    src="https://www.google.com/maps/embed/v1/view?key=${ googleMapKey }&center=${ lat },${ lng }&zoom=17" allowfullscreen>
                    </iframe>
            </div>
    `;

    modal.append( content );
}


// Sección 11 - Recursos Nativos


// Obtener la geolocalización
btnLocation.on('click', () => {
    $.mdtoast('Cargando mapa...',{
        interaction:true,
        interactionTimeout:2000,
        actionText:'Ok!'
    });

    // console.log('Botón geolocalización');
    navigator.geolocation.getCurrentPosition(pos=>{
        console.log(pos);
        mostrarMapaModal(pos.coords.latitude,pos.coords.longitude);
        lat = pos.coords.latitude;
        lng = pos.coords.longitude;
    });

});



// Boton de la camara
// usamos la funcion de fleca para prevenir
// que jQuery me cambie el valor del this
btnPhoto.on('click', () => {

    // console.log('Inicializar camara');
    contenedorCamara.removeClass('oculto');
    camara.encender();

});


// Boton para tomar la foto
btnTomarFoto.on('click', () => {

    console.log('Botón tomar foto');
    foto = camara.tomarFoto();
    camara.apagar();
    // console.log(foto);
});




// Share API



