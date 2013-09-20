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

app.get(/^\/(:?(:?details|edit)?\/.+)?$/i, function(req, res){
  res.render('index');
});

//stub routes
app.get('/views/:templateName', function(req, res) {
  console.log('view changed to: ' + req.params.templateName.green);
  res.render(req.params.templateName);
});

app.get('/news/:page', function(req, res) {
  res.send([
    {
      id: '1',
      slug: 'sample-news-1',
      title: 'Sample news item 1',
      content: '<p><b>rich</b> <i>text</i> news item contents</p>',
      author: {
        id: 'i_rule_uii@epam.com',
        firstName: 'Maxim',
        lastName: 'Mallets'
      }
    },
    {
      id: '2',
      slug: 'sample-news-2',
      title: 'Sample news item 2',
      content: '<p><b>rich</b> <i>text</i> news item contents</p>',
      author: {
        id: 'i_rule_uii@epam.com',
        firstName: 'Maxim',
        lastName: 'Mallets'
      }
    }
  ]);
});

app.get('/new/:slug', function(req, res) {
  var slug = req.params.slug;

  if(slug == 'sample-news-1'){
    res.send({
      id: '1',
      date: '2013-09-04 21:45:40',
      slug: 'sample-news-1',
      title: 'Sample news item 1',
      content: '<p><b>rich</b> <i>text</i> news item contents</p><p><b>rich</b> <i>text</i> news item contents</p>' +
        '<p><b>rich</b> <i>text</i> news item contents</p><p><b>rich</b> <i>text</i> news item contents</p>',
      author: {
        id: 'i_rule_uii@epam.com',
        firstName: 'Maxim',
        lastName: 'Mallets'
      }
    });
  }
  if(slug == 'sample-news-2'){
    res.send({
      id: '2',
      date: '2013-09-05 11:40:20',
      slug: 'sample-news-2',
      title: 'Sample news item 2',
      content: '<p><b>rich</b> <i>text</i> news item contents</p><p><b>rich</b> <i>text</i> news item contents</p>' +
        '<p><b>rich</b> <i>text</i> news item contents</p><p><b>rich</b> <i>text</i> news item contents</p>',
      author: {
      id: 'i_rule_uii@epam.com',
        firstName: 'Maxim',
        lastName: 'Mallets'
      }
    });
  }
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

//server starts here
app.listen(app.get('port'));
console.log(('start web-server on port ' + app.get('port')).green);