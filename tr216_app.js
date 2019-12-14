var express = require('express');

var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var engine = require('ejs-locals')
var errorHandler = require('errorhandler');
var i18n=require("i18n-express");

global.path = require('path');
global.fs = require('fs');
global.moment = require('moment');

global.uuid = require('node-uuid');

global.config = require('./config.json');
if(process.argv.length>=3){
    if(process.argv[2]=='localhost' || process.argv[2]=='-l'){
        global.config = require('./config_local.json');
    }
}

global.mrutil = require('./_lib/mrutil.js');
global.ttext = require('./_lib/language.js');

global.api = require('./providers/api/api.js');



var app = express();
var flash = require('connect-flash');


app.engine('ejs', engine);
app.set('views', path.join(__dirname, 'catalog'));
app.set('view engine', 'ejs');

app.set('port', config.httpserver.port);

app.use(favicon(__dirname + '/assets/images/tr216-short-icon1.png'));

app.use(logger('dev'));

app.use(bodyParser.json({limit: "50mb"}));
app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'assets')));
app.use(express.static(path.join(__dirname, 'vendor'), { maxAge: (60 * 1000 * 60 * 24 * 365) }));

app.use(flash());

app.use(i18n({
  translationsPath: path.join(__dirname, 'language'), 
  siteLangs: ["tr","en"],
  textsVarName: 'translation',
  paramLangName:'lang',
  cookieLangName :'lang'

}));

require('./_lib/loader_db.js')((err)=>{
  if(!err){
    require('./routes/routes.js')(app);
    require('./providers/index');
  }else{
    console.log('loader_db.js ERROR:',err);
  }
});


if( app.get('env') == 'development')
{
    errorHandler.title = "Ups...";
    app.use(errorHandler());
   
}

app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error/error',{title:'Sistem hatasi',code:err.status || 500,message:err.message});
  
});


global.menu=require('./_lib/menu.json');
// global.sysmenu=require('./_lib/sysmenu.json');
global.staticvalues=require('./_lib/staticvalues.json');

//============= HTTP SERVER ==================
var debug = require('debug')('node-sbadmin:server');
var http = require('http');


var server = http.createServer(app);

server.listen(config.httpserver.port);
server.on('error', onError);
server.on('listening', onListening);




function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}


function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}

// ==========HTTP SERVER /===========



process.on('uncaughtException', function (err) {
   console.log('Caught exception:', err);
});



