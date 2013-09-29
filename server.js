'use strict';

require('colors');

var express = require('express'),
  app = express(),
  pmcApi = require('./pmc-api.js'),
  mg = require("mongoose");

mg.connect('mongodb://localhost:27018/tt-portal-dev');

var TechTalk = require("./models/TechTalk.js").TechTalk;
var User     = require("./models/User.js").User;

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
  .use(express.query())
  .use(express.bodyParser())
  .use(express.methodOverride())
  .use(express.cookieParser())
  .use(express.session({secret: 'secret_realno'}))
  .use(app.router);

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
  var login = req.body.login,
    password = req.body.password;

  pmcApi.authentication(function(err, response) {
    if (err) {
      console.log(err);
      res.send({
        status: 'error',
        message: err.message || 'Not valid login or password',
        errorCode: err.code
      })
    }
    else {
      res.send({
        status: 'success',
        user: response
      });
      req.session.user = response;
    }
  }, login, password);
});

app.post('/logout', function(req, res) {
  req.session.user = null;
  res.send({
    status: 'success'
  })
});

app.get('/user/:name', function(req, res) {
  var userName = req.params.name;
  User.find({email: userName}, function(err, users) {
    console.log(users);
    if (err || !users.length) {
      console.log(err);
      pmcApi.findUser(function(err, data) {
        if (err) {
          var response = [];
          response.error = err;
          res.send(response);
        }
        else {
          data.forEach(function(userData, i) {
            (new User(userData)).save(function(err) {
              console.log(!err);
            });
          });
          res.send(data);
        }
      }, userName);
    }
    else {
      res.send(users);
    }
  });
});
// NEW REST WITH MONGO

function stringToDate(value) {
  var dateParts, date;

  if (value instanceof String || typeof value == "string") {
    dateParts = value.split("/");
    if (dateParts[0].length === 4){
      date = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
    } else {
      date = new Date(dateParts[2], dateParts[0] - 1, dateParts[1]);
    }
  }
  return date || value;
}
function dateToString(value) {
  var dateParts = [value.getMonth() + 1, value.getDate(), value.getFullYear()];
  return dateParts.join("/");
}

//get
app.get("/api/techtalk/reset", function(req, res){
  TechTalk.remove({},function(){
    for (var i=0; i<data.talks.length; i++){
      data.talks[i].date = stringToDate(data.talks[i].date);
    }
    TechTalk.create(data.talks, function(err, result){
      if (err) return res.send(err);
      res.send(result);
    });
  });
});
app.get("/api/techtalks", function(req, res) {
  console.log("/api/techtalks?from=2013/9/1&to=2013/9/30".cyan,req.query);
  TechTalk.find({})
    .where("date").gte(stringToDate(req.query.from))
    .where("date").lt(stringToDate(req.query.to))
    .exec(function(err, results){
      console.log("\t>> results".grey, results);
      res.json(results);
    });
});
app.get('/api/techtalk', function(req, res) {
  TechTalk.findById(req.query.id, function(err, result){
    if (err) return res.send(err);
    console.log("\t>> result".grey, result);
    res.json(result);
  });
});

// post
app.post("/api/techtalk", function(req, res) {
  console.log("/api/techtalk".cyan,req.body);
  var tt = new TechTalk(req.body);
  tt.save(function (err) {
    if (err) return res.send(err);
    console.log("\t>> results".grey, tt);
    res.send(tt);
  });
});

// put
app.put("/api/techtalk", function(req, res){
  console.log("/api/techtalk".cyan,req.query);
  console.log("/api/techtalk".cyan,req.body);
  TechTalk.findByIdAndUpdate(req.query.id, { $set: req.body}, function (err, result) {
    if (err) return res.send(err);
    console.log("\t>> results".grey, result);
    res.json(result);
  });
});

// delete
app.delete('/api/techtalk', function(req, res) {
  console.log("/api/techtalk".cyan,req.query);
  TechTalk.remove({_id: req.query.id}).exec(function(err){
    if (err) return res.send(err);
    res.send('ok');
  });
});

// fix for direct urls like http://localhost:3000/details/28
app.all('*', function(req, res){
  res.render('index');
});

//server starts here
app.listen(app.get('port'));
console.log(('start web-server on port ' + app.get('port')).green);