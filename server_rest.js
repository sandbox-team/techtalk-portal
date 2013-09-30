'use strict';

var fs = require('fs');

// constant data from file
// could be used for reset
var RAW_DATA = fs.readFileSync('./data.json', 'utf8');

// parse raw data
function parse() {
  return JSON.parse(RAW_DATA);  
}

var data = parse();// parsed data



// GETTERS
function getAll() {return data;}                  // get all data (talks+users+tags)
  
function getTalks() {return data.talks;}          // get talks
function getTalk(id) {return data.talks[id];}     // get talk

function getUsers() {return data.users;}          // get users
function getUser(id) {return data.users[id];}     // get user
  
function getTags() {return data.tags;}            // get tags



// DELETE

// delete talk
function deleteTalk(id) {
  delete data.talks[id];
  return getTalks();
}  



// UPDATERS
function updateTalk(id, talk) {
  return data.talks[getIndexById(data.talks, id)] = talk;
}     // update talk
function updateUser(id, user) {data.users[id] = user;}     // update user
 
function getIndexById(sourceArray, id, idKey) {
  var result;

  idKey = idKey || '_id';
  sourceArray.forEach(function(source, i) {
    if (source[idKey] === id) {
      result = i;
      return false;
    }
  });
  return result;
}

// SETTERS

// create new talk
function createTalk(talk) {
  var i = 1;
  while (data.talks[i.toString()]) i++;

  talk._id = i;
  data.talks.push(talk);
  return talk;
}
// create user
function createUser(user) {
  data.users[id] = user;
  return getUsers();
}


module.exports = function(app) {
  // get
  app.get('/data/all', function(req, res) {res.send(getAll() || {});});
  app.get('/data/reset', function(req, res) {res.send(data = parse() || {});});

  app.get('/data/talk', function(req, res) {res.send(getTalks() || {});});
  app.get('/data/talk/:id', function(req, res) {res.send(getTalk(req.params.id) || {});});

  app.get('/data/users', function(req, res) {res.send(getUsers() || {});});
  app.get('/data/user/:id', function(req, res) {res.send(getUser(req.params.id) || {});});

  app.get('/data/tags', function(req, res) {res.send(getTags() || {});});


  // post
  /*could be buggy*/app.post('/data/talk/', function(req, res) {res.send(createTalk(req.body));});
  /*could be buggy*/app.post('/data/talk/:id', function(req, res) {
    console.log(req.session)
    if (req.session.user) {
      res.send(updateTalk(req.params.id, req.body));
    }
    else {
      res.status(403).send('Error. Unauthorized.');
    }
  });
  /*could be buggy*/app.post('/data/user/', function(req, res) {createUser(req.body); res.send('ok');});
  /*could be buggy*/app.post('/data/user/:id', function(req, res) {updateUser(req.params.id, req.body); res.send('ok');});

  // delete
  /*could be buggy*/app.delete('/data/talk/:id', function(req, res) {deleteTalk(req.params.id); res.send('ok');});

  return data;
};
