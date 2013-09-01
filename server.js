require('colors');

var express = require('express'),
  app = express(),
  path = require('path');

app
  .disable('x-powered-by')
  .engine('html', require('ejs').renderFile)  
  
  .set('view engine', 'html')
  .set('port', process.env.PORT || 3001)
  .set('views', __dirname + '/views')
  
  .use(express.favicon())
  .use(express.logger('tiny'))
  .use(express.static(path.join(__dirname, 'public')))
  .use(express.bodyParser())
  .use(express.methodOverride())
  .use(express.cookieParser())
  .use(app.router);

app.get('/', function(req, res){
  res.render('index');
});

app.get('/views/:templateName', function(req, res) {
  console.log('view changed to: ' + req.params.templateName.green);
  res.render(req.params.templateName);
});

app.get('/test', function(req, res) {
  res.send({
    '3': [{
      id: 'asd',
      title: 'CSS features',
      location: 'k1-3 215',
      author: {
        id: 'tester',
        firstName: 'Sergey',
        lastName: 'Net ne on'
      }
    }],
    '21': [{
      id: 'asd',
      title: 'CSS55 features',
      location: 'k1',
      author: {
        id: 'tester',
        firstName: 'Sergey',
        lastName: 'Net ne on'
      }
    }, {
      id: 'asd',
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

app.listen(3000);
console.log('start web-server on port 3000'.green);
