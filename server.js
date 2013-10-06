'use strict';

require('colors');

var express = require('express'),
    fs = require('fs'),
    app = express(),
    pmcApi = require('./pmc-api.js'),
    mg = require('mongoose'),
    async = require('async'),
    data = JSON.parse(fs.readFileSync('./data.json', 'utf8'));

mg.connect('mongodb://localhost:27018/tt-portal-dev');

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

function checkAuth(req, res, next) {
  if (req.session && req.session.user) {
    next();
  }
  else {
    //TODO: 401 or 403 ??
    res
      .status(401)
      .send({code: "NOPERMISSION", error: "Session expired"});
  }
}

//Authentication
app.post('/auth', function(req, res) {
  var login = req.body.login,
      password = req.body.password;

  pmcApi.authentication(login, password, function(err, user) {
    if (err) {
      console.log(err);
      res.send({
        status: 'error',
        message: err.message || 'Not valid login or password',
        errorCode: err.code
      })
    }
    else {
      req.session.user = user;
      findUser(user.email, req.session, function(err, users){
        res.send({
          status: 'success',
          user: err ? null : users[0]
        });
      });
    }
  });
});

app.post('/logout', function(req, res) {
  console.log('logout');
  req.session.user = null;
  res.send({
    status: 'success'
  })
});

//User API
function findUser(name, session, callback) {
  if (!name || !session || !session.user) return;

  var regExp = { $regex: new RegExp(name, "i") },
    findCondition = (/[\@\_]/g.test(name)) ? { email: regExp } : { name: regExp };

  User.find(findCondition, function(err, users) {
    if (err || !users.length) {
      try {
        pmcApi.findUser(session.user.token, name, function(err, data) {
          if (err) {
            callback(err);
          }
          else {
            async.map(data, function(user, next) {
              console.log(user.name);
              async.parallel({
                image: function(callback) {
                  fs.writeFile('./files/user-photo/' + user._id + '.gif', user.photo, 'base64', function() {
                    callback(null);
                  });
                },
                user: function(callback) {
                  user.photo = user._id;
                  User.create(user, function(err, user) {
                    callback(err, user);
                  })
                }
              },
              function(err, results) {
                next(err, results.user);
              });
            }, callback)
          }
        });
      }
      catch(e) {
        console.log('pmcApi exception', e);
        callback(e, null);
      }
    }
    else {
      callback(null, users);
    }
  });
}

app.get('/api/user/:name?', function(req, res) {
  var name = req.params.name;

  if (name) {
    checkAuth(req, res, function() {
      findUser(name, req.session, function(err, users) {
        res.json(err ? {
            status: 'error',
            error: err
          } : users);
      });
    });
  }
  else {
    User.find(function(err, users) {
      if (err) res.json({status: 'error', error: err});
      else res.json(users);
    });
  }
});

//Techtalks
app.get('/api/techtalk/reset', function(req, res) {
  console.log(data.talks[0].date);
  TechTalk.remove(function() {
    TechTalk.create(data.talks, function(err, result) {
      console.log(result);
      console.log(error);
      if (err) return res.send(err);
      res.send(result);
    });
  });
});

app.get('/api/techtalk/:id?', function(req, res) {
  var id = req.params.id,
      query = req.query;

  if (typeof id !== 'undefined') {
    TechTalk.findOne(id, function(err, result) {
      if (err) return res.send(err);
      //console.log('\t>> result'.grey, result);
      res.json(result);
    });
  }
  else if (query.from && query.to) {
    TechTalk.find()
        .where('date').gte(new Date(req.query.from))
        .where('date').lt(new Date(req.query.to))
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

app.post('/api/techtalk', checkAuth, function(req, res) {
  console.log('/api/techtalk'.cyan, req.body);
  TechTalk.create(req.body, function(err, result) {
    if (err) return res.send(err);
    console.log('\t>> results'.grey, result);
    res.json(result);
  });
});

app.put('/api/techtalk/:id', checkAuth, function(req, res) {
  var updatedData = req.body;
  delete updatedData._id;
  updatedData.updated = new Date();

  TechTalk.findOneAndUpdate({id: req.params.id}, { $set: updatedData }, function(err, result) {
    if (err) return res.send(err);
    //console.log('\t>> results'.grey, result);
    res.json({status: 'success', result: result});
  });
});

app.delete('/api/techtalk/:id', checkAuth, function(req, res) {
  TechTalk.remove({id: req.params.id}).exec(function(err) {
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

/**
 * News
 */
app.get('/api/news/reset', function(req, res) {
  News.remove({}, function() {
    res.send({});
  });
});

app.get('/api/news', function(req, res) {
  console.log('/api/news?page=1|id=1'.cyan, req.query);
  var page = req.query.page,
      countOnPage = 5;

  if (req.query.id) {
    News
      .findById(req.query.id)
      .populate('author')
      .exec(function(err, result) {
        if (err) return res.send(err);
        console.log('\t>> result'.grey, result);
        res.json(result);
      });
  } else {
    News
      .find({})
      .sort('-date')
      .populate('author')
      .exec(function(err, results) {
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

  var id = req.query.id;
  var updatedData = {
      title: req.body.title,
      content: req.body.content,
      updated: new Date()
  };

  News.findByIdAndUpdate(id, { $set: updatedData }, function(err, result) {
    if (err) return res.send(err);
    result.populate('author', function(err, result){
      if (err) return res.send(err);
      console.log('\t>> results'.grey, result);
      res.json(result);
    });
  });
});

app.delete('/api/news', function(req, res) {
  var id = req.query.id;
  console.log('delete news id '.cyan, id);

  News.findByIdAndRemove(id, function(err) {
    if (err) return res.send(err);
    res.send('ok');
  });
});

/*
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
*/

//handling routes on client
app.all('*', function(req, res) {
  res.render('index');
});

//server starts here
app.listen(app.get('port'));
console.log(('start web-server on port ' + app.get('port')).green);