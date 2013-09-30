var mg = require('mongoose');
var fs = require('fs');
var data = JSON.parse(fs.readFileSync('./data.json', 'utf8'));
var pmcApi = require('./pmc-api.js');

mg.connect('mongodb://localhost:27018/tt-portal-dev');

var TechTalk = require('./models/TechTalk.js').TechTalk;
var Tag = require('./models/Tag.js').Tag;
var User = require('./models/User.js').User;
var News = require('./models/News.js').News;

a();
//b();
//c();

function c() {
  User.remove(function() {
    console.log('removed')
  })
}

function b() {
  User.find(function() {
    console.log(arguments)
  })
}

function a() {
  User.remove(function() {
    pmcApi.authentication(function(err) {
      User.remove(function() {
        for (var i in data.users) {
          console.log(i);
          pmcApi.findUser(function(err, data) {
            data.forEach(function(user) {
              (new User(user)).save(function(err) {
                console.log(!err);
              });
            })
          }, i);
        }
      })
    }, 'ivan_straltsou', 'Vkusnota24!');
  });
}

