// Routes.js - Módulo de rutas
const express = require('express');
const router = express.Router();
const push = require('./push');

const mensajes = [

  {
    _id: 'XXX',
    user: 'berserk',
    mensaje: 'Mi primera tarea',
    fecha: '2022-11-11',
    prioridad: '1',
    status: '1'
  }

];


// Get mensajes
router.get('/', function (req, res) {
  // res.json('Obteniendo mensajes');
  // alert(mensajes);
  res.json( mensajes );

});


// Post mensaje
router.post('/', function (req, res) {
  
  console.log(req.body.lat);
  console.log(req.body.lng);
  const mensaje = {
    id: req.body.id,
    mensaje: req.body.mensaje,
    user: req.body.user,
    lat:req.body.lat,
    lng:req.body.lng,
    foto:req.body.foto,
    fecha: req.body.fecha,
    prioridad: req.body.prioridad,
    status:'0',

  };

  mensajes.push( mensaje );

  // console.log(mensajes);


  res.json({
    ok: true,
    mensaje
  });
});
// Post delete
router.delete('/borrartask', function (req, res) {
  

  // delete(mensajes[req.position]);
  // alert(req.body.position);
  if(req.body.position=='0'){
    mensajes.splice(req.body.position,req.body.position+1);
  }else{
    mensajes.splice(req.body.position,req.body.position);
  }

  res.json({
    ok: true
  });
});

router.put('/actualizarstatus', (req, res) => {

  mensajes[req.body.position]['status']='1'
    // console.log();
  res.json({
    ok: true
  });

});
// Almacenar la suscripción
router.post('/subscribe', (req, res) => {


  const suscripcion = req.body;

  
  push.addSubscription( suscripcion );


  res.json('subscribe');

});

// Almacenar la suscripción
router.get('/key', (req, res) => {

  const key = push.getKey();


  res.send(key);

});


// Envar una notificación PUSH a las personas
// que nosotros queramos
// ES ALGO que se controla del lado del server
router.post('/push', (req, res) => {

  const post = {
    titulo: req.body.titulo,
    cuerpo: req.body.cuerpo,
    usuario: req.body.usuario
  };


  push.sendPush( post );

  res.json( post );

});





module.exports = router;