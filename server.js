'use strict';

require('colors');

var express = require('express'),
  app = express(),
  fs = require('fs'),
  data = JSON.parse(fs.readFileSync('data.json', {
    encoding: 'utf-8'
  })),
  talks = data.talks,
  users = data.users,
  tags = data.tags;

//helper
var getTalkById = (function() {
  var memory = {};

  return function(id) {
    var memorized = memory[id],
      talk;

    if (memorized) {
      return memorized;
    }
    else {
      talks.forEach(function(resource, i) {
        if (resource._id === id) {
          talk = resource;
          memory[id] = resource;
          return false;
        }
      });

      return talk;
    }
  }; 
})();

var getSchedule = (function() {
  var memory = {};

  return function(year, month) {
    var dateStack = {},
      periodId = year + '/' + month,
      memorized = memory[periodId];

    if (memorized) {
      return memorized;
    } 
    else {
      talks.forEach(function(talk, i) {
        var talkDate = new Date(talk.date),
          date = talkDate.getDate();

        if(talkDate.getFullYear() == year && talkDate.getMonth() == month) {
          var current = dateStack[date] = dateStack[date] || [];
          current.push(talk);
        }
      });
      
      return (memory[periodId] = dateStack);
    }
  };
})();

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

app.get('/', function(req, res){
  res.render('index');
});

//stub routes
app.get('/views/:templateName', function(req, res) {
  console.log('view changed to: ' + req.params.templateName.green);
  res.render(req.params.templateName);
});

app.get('/talks/:year/:month', function(req, res) {
  var year = req.params.year,
    month = req.params.month;

  res.send(getSchedule(year, month) || talks);
});

app.get('/details/:talkId', function(req, res) {
  var id = req.params.talkId;

  res.send(getTalkById(id) || {});
});

app.get('/user', function(req, res) {
  res.send(users);
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