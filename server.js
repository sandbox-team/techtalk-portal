'use strict';

require('colors');

var express = require('express'),
  app = express();



//config
app
  .disable('x-powered-by')
  .engine('html', require('ejs').renderFile)  
  
  .set('view engine', 'html')
  .set('port', process.env.PORT || 3000)
  .set('views', 'views')
  
  .use(express.favicon())
  .use(express.logger('tiny'))
  .use(express.static('public'))
  .use(express.bodyParser())
  .use(express.methodOverride())
  .use(express.cookieParser())
  .use(app.router);


//stub routes
app.get('/views/:templateName', function(req, res) {
  console.log('view changed to: ' + req.params.templateName.green);
  res.render(req.params.templateName);
});

app.post('/auth', function(req, res) {
  console.log(req.body.green);
  var login = req.body.login,
    password = req.body.password;

  if (login === 'test' && password === '123') {
    res.send({
      status: 'success'
    });
  }
  else {
    res.send({
      status: 'error',
      message: 'Not valid login or password'
    })
  }
})

// REST API
require('./server_rest.js')(app);

// fix for direct urls like http://localhost:3000/details/28
app.all('*', function(req, res){
  res.render('index');
});

//server starts here
app.listen(app.get('port'));
console.log(('start web-server on port ' + app.get('port')).green);