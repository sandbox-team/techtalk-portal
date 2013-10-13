var fs = require('fs'),
  async = require('async'),
  xmldom = require('xmldom'),
  request = require('request'),
  serviceConfig = JSON.parse(fs.readFileSync(__dirname + '/pmc-service-config.json', 'utf8')),
  parser = new xmldom.DOMParser(),
  serializer = new xmldom.XMLSerializer();

/* Create XML requests to PMC */
var authXML, usersXML, photoXML;

authXML = parser.parseFromString(fs.readFileSync(__dirname + '/pmc-request/AuthRequest.xml', 'utf8'));
authXML.getElementsByTagName('wsse:Username')[0].textContent = serviceConfig.login;
authXML.getElementsByTagName('wsse:Password')[0].textContent = serviceConfig.password;

usersXML = parser.parseFromString(fs.readFileSync(__dirname + '/pmc-request/UsersRequest.xml', 'utf8'));
photoXML = parser.parseFromString(fs.readFileSync(__dirname + '/pmc-request/PhotoRequest.xml', 'utf8'));

/* Create requests */
request = request.defaults({
  headers: {
    "Content-Type": "text/xml; charset=utf-8",
    "Accept": "application/soap+xml, application/dime, multipart/related, text/*",
    "Cache-Control": "no-cache",
    "Pragma": "no-cache",
    "SOAPAction": ""
  }
});

var pmc = function() {
  function getAuthenticationService () {
    return serviceConfig.serviceUrl + serviceConfig.authSerice + serviceConfig.postfixUrl;
  }
  function getUserService () {
    return serviceConfig.serviceUrl + serviceConfig.userSerice + serviceConfig.postfixUrl;
  }

  this.authentication = function(login, password, mainCallback) {
    async.waterfall([
      /* Request to authentification service */
      function(callback) {
        authXML.getElementsByTagName('login')[0].textContent = login;
        authXML.getElementsByTagName('password')[0].textContent = password;

        request.post({
          uri: getAuthenticationService(),
          body: serializer.serializeToString(authXML)
        }, callback);
      },
      /* Response from authentification server */
      function(response, body, callback) {
        var responseXML = parser.parseFromString(body, 'text/xml'),
          errorString = responseXML.getElementsByTagName('faultstring')[0],
          errorCode = responseXML.getElementsByTagName('java:ErrorCode')[0],
          error = null,
          returnValue,
          token;

        if (errorString) {
          error = {
            code: errorCode && errorCode.textContent,
            message: errorString.textContent
          };
        } else {
          returnValue = responseXML.getElementsByTagName('m:return')[0];
          token = returnValue.textContent;
        }

        callback(error, token);
      }
    ], function(error, result) {
      var user = {};

      if (error) {
        mainCallback(error);
      } else {
        user.email = ~login.indexOf('@') ? login : (login + '@epam.com');
        user.token = result;
        mainCallback(null, user);
      }
    });
  };
  this.findUser = function(userName, token, mainCallback) {
    var users = [];

    async.waterfall([
      /* Request for user data */
      function(callback) {
        usersXML.getElementsByTagName('sessionHash')[0].textContent = token;
        if (~userName.indexOf('@') || ~userName.indexOf('_')) {
          usersXML.getElementsByTagName('ns19:Email')[0].textContent = userName;
        } else {
          usersXML.getElementsByTagName('ns13:FullName')[0].textContent = userName;
        }

        request.post({
          uri: getUserService(),
          body: serializer.serializeToString(usersXML)
        }, callback);
      },
      /* Response with user data */
      function(response, body, callback) {
        var responseXML = parser.parseFromString(body, 'text/xml'),
          returnValue = responseXML.getElementsByTagName('m:return')[0];

        for (var i=0; i < returnValue.childNodes.length; i++) {
          var userValue = returnValue.childNodes[i],
            user = {};

          for (var j=0; j < userValue.childNodes.length; j++) {
            switch (userValue.childNodes[j].nodeName) {
              case 'java:Id':
                user._id = userValue.childNodes[j].textContent;
                break;
              case 'java:FullName':
                user.name = userValue.childNodes[j].textContent;
                break;
              case 'java:Email':
                user.email = userValue.childNodes[j].textContent;
                break;
            }
          }

          users.push(user);
        }

        /* Request for user photos */
        async.map(users, function (user, callback) {
          photoXML.getElementsByTagName('sessionHash')[0].textContent = token;
          photoXML.getElementsByTagName('personId')[0].textContent = user._id;

          request.post({
            uri: getUserService(),
            body: serializer.serializeToString(photoXML)
          }, function(error, response, body) {
            if (error) {
              callback(error);
            } 
            else {
              try {
                var responseXML = parser.parseFromString(body, 'text/xml'),
                  returnValue = responseXML.getElementsByTagName('m:return')[0],
                  attach;

                attach = returnValue.getElementsByTagName('java:AttachBody')[0].textContent;
                user.photo = attach;
                callback(null, user);
              }
              catch(e) {
                console.log(e);
                callback(e);
              }
            }
          });
        }, callback);
      }
    ], mainCallback);
  };
};

module.exports = new pmc();