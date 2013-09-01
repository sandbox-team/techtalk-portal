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
  .use(app.router);

app.get('/', function(req, res){
  res.render('index');
});

app.get('/views/:templateName', function(req, res) {
  console.log(req.params.templateName.yellow)
  res.render(req.params.templateName);
});

app.listen(3000);
console.log('start web-server on port 3000'.green);
