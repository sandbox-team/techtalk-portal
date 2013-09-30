'use strict';

require('colors');

var express = require('express'),
    fs = require('fs'),
    app = express(),
    pmcApi = require('./pmc-api.js'),
    mg = require('mongoose'),
    data = JSON.parse(fs.readFileSync('./data.json', 'utf8'));

//mg.connect('mongodb://localhost:27018/tt-portal-dev');

var TechTalk = require('./models/TechTalk.js').TechTalk;
var Tag = require('./models/Tag.js').Tag;
var User = require('./models/User.js').User;
var News = require('./models/News.js').News;

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

function stringToDate(value) {
  var dateParts, date;

  if (value instanceof String || typeof value == 'string') {
    dateParts = value.split('/');
    if (dateParts[0].length === 4) {
      date = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
    } else {
      date = new Date(dateParts[2], dateParts[0] - 1, dateParts[1]);
    }
  }
  return date || value;
}

function dateToString(value) {
  var dateParts = [value.getMonth() + 1, value.getDate(), value.getFullYear()];
  return dateParts.join('/');
}

//Authentication
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

//User API
app.get('/api/user/:id?', function(req, res) {
  var id = req.params.id;

  User.find(id ?
    (~id.indexOf('@') || ~id.indexOf('_') ?  {email: id} : {name: id}) :
    {},
    function(err, users) {
      if ((err || !users.length) && id) {
        console.log(err);
        pmcApi.findUser(function(err, data) {
          if (err) {
            var response = [];
            response.error = err;
            res.send(response);
          }
          else {
            data.forEach(function(user) {
              (new User(user)).save(function(err) {
                console.log(!err);
              });
            })
            res.json(data);
          }
        }, id);
      }
      else {
        console.log(users);
        res.json(users);
      }
  });
});

//Techtalks
app.get('/api/techtalk/reset', function(req, res) {
  TechTalk.remove(function() {
    data.talks.forEach(function(talk, i) {
      talk.date = stringToDate(talk.date);
    });
    TechTalk.create(data.talks, function(err, result) {
      if (err) return res.send(err);
      res.send(result);
    });
  });
});

app.get('/api/techtalk/:id?', function(req, res) {
  var _id = req.param.id,
      query = req.query;

  if (typeof _id !== 'undefined') {
    TechTalk.findById(req.query.id, function(err, result) {
      if (err) return res.send(err);
      //console.log('\t>> result'.grey, result);
      res.json(result);
    });
  }
  else if (query.from && query.to) {
    TechTalk.find()
        .where('date').gte(stringToDate(req.query.from))
        .where('date').lt(stringToDate(req.query.to))
        .exec(function(err, results) {
          if (err) return res.send(err);
          console.log('\t>> results'.grey, results);
          res.json(results);
        });
  }
  else {
    TechTalk.find(function(err, results) {
      if (err) return res.send(err);
      //console.log('\t>> results'.grey, results);
      res.json(results);
    });
  }
});

app.post('/api/techtalk', function(req, res) {
  console.log('/api/techtalk'.cyan, req.body);
  TechTalk.create(req.body, function(err, result) {
    if (err) return res.send(err);
    console.log('\t>> results'.grey, result);
    res.json(result);
  });
});

app.put('/api/techtalk', function(req, res) {
  console.log('/api/techtalk'.cyan, req.query);
  console.log('/api/techtalk'.cyan, req.body);

  var updatedData = req.body;
  delete updatedData._id;
  updatedData.updated = new Date();

  TechTalk.findByIdAndUpdate(req.query.id, { $set: updatedData }, function(err, result) {
    if (err) return res.send(err);
    console.log('\t>> results'.grey, result);
    res.json(result);
  });
});

app.delete('/api/techtalk', function(req, res) {
  console.log('/api/techtalk'.cyan, req.query);
  TechTalk.remove({_id: req.query.id}).exec(function(err) {
    if (err) return res.send(err);
    res.send('ok');
  });
});

//Tags
app.get('/api/tags/reset', function(req, res) {
  var tags = [];
  Tag.remove({}, function() {
    for (var i = 0; i < data.tags.length; i++) {
      tags.push({_id: data.tags[i]});
    }
    Tag.create(tags, function(err, result) {
      if (err) return res.send(err);
      res.send(result);
    });
  });
});

app.get('/api/tags', function(req, res) {
  var tags = [];
  Tag.find({}).exec(function(err, results) {
    if (err) return res.send(err);
    console.log('\t>> results'.grey, results);
    for (var i = 0; i < results.length; i++) {
      tags.push(results[i]._id);
    }
    res.json(tags);
  });
});

app.post('/api/tag', function(req, res) {
  console.log('/api/tag'.cyan, req.body);
  Tag.create({_id: req.body.tag}, function(err, result) {
    if (err) return res.send(err);
    console.log('\t>> results'.grey, result);
    res.send('ok');
  });
});

//News
app.get('/api/news/reset', function(req, res) {
  News.remove({}, function() {
    res.send({});
  });
});

app.get('/api/news', function(req, res) {
  console.log('/api/news?page=1|id=1'.cyan, req.query);
  var page = req.query.page,
      countOnPage = 2;

  if (req.query.id) {
    News.findById(req.query.id, function(err, result) {
      if (err) return res.send(err);
      console.log('\t>> result'.grey, result);
      res.json(result);
    });
  } else {
    News.find({}).exec(function(err, results) {
      if (err) return res.send(err);
      if (page) {
        var from = (page - 1) * countOnPage,
            to = from + countOnPage;
        res.json(results.slice(from, to));
      } else {
        res.json(results);
      }
    });
  }
});

app.post('/api/news', function(req, res) {
  console.log('/api/news'.cyan, req.body);
  News.create(req.body, function(err, result) {
    if (err) return res.send(err);
    console.log('\t>> results'.grey, result);
    res.json(result);
  });
});

app.put('/api/news', function(req, res) {
  console.log('/api/news'.cyan, req.query);
  console.log('/api/news'.cyan, req.body);

  var updatedData = req.body;
  delete updatedData._id;
  updatedData.updated = new Date();

  News.findByIdAndUpdate(req.query.id, { $set: updatedData }, function(err, result) {
    if (err) return res.send(err);
    console.log('\t>> results'.grey, result);
    res.json(result);
  });
});

app.delete('/api/news', function(req, res) {
  console.log('/api/news'.cyan, req.query);
  News.remove({_id: req.query.id}).exec(function(err) {
    if (err) return res.send(err);
    res.send('ok');
  });
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

  if (slug == 'sample-news-1') {
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
  if (slug == 'sample-news-2') {
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

//handling routes on client
app.all('*', function(req, res) {
  res.render('index');
});

//server starts here
app.listen(app.get('port'));
console.log(('start web-server on port ' + app.get('port')).green);