require('colors');

var express = require('express'),
  app = express(),
  path = require('path'),
  isProduction = process.argv[2] === 'prod';

app
  .disable('x-powered-by')
  .engine('html', require('ejs').renderFile)  
  
  .set('view engine', 'html')
  .set('port', process.env.PORT || 3000)
  .set('views', (isProduction ? 'dist/' : '') + 'views')
  
  .use(express.favicon())
  .use(express.logger('tiny'))
  .use(express.static((isProduction ? 'dist/' : '') + 'public'))
  .use(express.bodyParser())
  .use(express.methodOverride())
  .use(express.cookieParser())
  .use(app.router);

app.get('/', function(req, res){
  res.render('index');
});

//stub routes
app.get('/views/:templateName', function(req, res) {
  console.log('view changed to: ' + req.params.templateName.green);
  res.render(req.params.templateName);
});

app.get('/test', function(req, res) {
  res.send({
    '3': [{
      id: '1',
      title: 'CSS features',
      location: 'k1-3 215',
      author: {
        id: 'tester',
        firstName: 'Sergey',
        lastName: 'Net ne on'
      }
    }],
    '21': [{
      id: '2',
      title: 'CSS55 features',
      location: 'k1',
      author: {
        id: 'tester',
        firstName: 'Sergey',
        lastName: 'Net ne on'
      }
    }, {
      id: '1',
      title: 'JS',
      location: 'n58',
      author: {
        id: 'tester',
        firstName: 'Sergey',
        lastName: 'Net ne on'
      }
    }]
  });
});

app.get('/details/:techtalkId', function(req, res) {
  var data = {
    '1': {
      title: 'CSS features',
      content: '<b>html here</b>'
    },
    '2': {
      title: 'CSS2 features',
      content: '<i>html here</i>'
    }
  };

  var id = req.params.techtalkId;

  res.send(data[id] || {});
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

//server starts here
app.listen(app.get('port'));
console.log(('start web-server on port ' + app.get('port')).green);
