var fs = require('fs'),
	async = require('async'),
	xmldom = require('xmldom'),
	request = require('request'),	
	serviceConfig = JSON.parse(fs.readFileSync(__dirname + '/pmc-service-config.json', 'utf8')),
	parser = new xmldom.DOMParser(),
	serializer = new xmldom.XMLSerializer();

/* Create XML requests to PMC */
var authXML, userXML, photoXML, usersXML;
fs.readFile(__dirname + '/pmc-request/AuthRequest.xml', 'utf8', function(err, data) {
	authXML = parser.parseFromString(data, 'text/xml');
	authXML.getElementsByTagName('wsse:Username')[0].textContent = serviceConfig.login;
	authXML.getElementsByTagName('wsse:Password')[0].textContent = serviceConfig.password;
});
fs.readFile(__dirname + '/pmc-request/UserRequest.xml', 'utf8', function(err, data) {
	userXML = parser.parseFromString(data, 'text/xml');	
});
fs.readFile(__dirname + '/pmc-request/PhotoRequest.xml', 'utf8', function(err, data) {
	photoXML = parser.parseFromString(data, 'text/xml');	
});
fs.readFile(__dirname + '/pmc-request/UsersRequest.xml', 'utf8', function(err, data) {
	usersXML = parser.parseFromString(data, 'text/xml');	
});

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
	var token;

	function getAuthenticationService () {
		return serviceConfig.serviceUrl + serviceConfig.authSerice + serviceConfig.postfixUrl;
	}
	function getUserService () {
		return serviceConfig.serviceUrl + serviceConfig.userSerice + serviceConfig.postfixUrl;
	}
	function findPhoto(user, callback) {
		photoXML.getElementsByTagName('sessionHash')[0].textContent = token;
		photoXML.getElementsByTagName('personId')[0].textContent = user.id;
			
		request.post({
			uri: getUserService(),
			body: serializer.serializeToString(photoXML)
		}, function(error, response, body) {
			if (error) {
				callback(error);
			} else {
				var responseXML = parser.parseFromString(body, 'text/xml'),
					returnValue = responseXML.getElementsByTagName('m:return')[0],
					attach;
				
				attach = returnValue.getElementsByTagName('java:AttachBody')[0].textContent;
				user.photo = "data:image/gif;base64," + attach;
				
				callback(null, user);
			}
		});
	}
	
	this.authentication = function(mainCallback, login, password) {
		var user = {};
	
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
            returnValue;

        if (errorString) {
          error = {
            code: errorCode && errorCode.textContent,
            message: errorString.textContent
          };
        }
        else {
          returnValue = responseXML.getElementsByTagName('m:return')[0];
          token = returnValue.textContent;
        }

				callback(error, token);
			},
			/* Request for user data */
			function(token, callback) {
				userXML.getElementsByTagName('sessionHash')[0].textContent = token;
				
				request.post({
					uri: getUserService(),
					body: serializer.serializeToString(userXML)
				}, callback);
			},
			/* Response with user data */
			function(response, body, callback) {
				var responseXML = parser.parseFromString(body, 'text/xml'),
					returnValue = responseXML.getElementsByTagName('m:return')[0];

				for (var i=0; i < returnValue.childNodes.length; i++) {
					switch (returnValue.childNodes[i].nodeName) {
						case 'java:Id':
							user.id = returnValue.childNodes[i].textContent;
							break;
						case 'java:FullName':
							user.name = returnValue.childNodes[i].textContent;
							break;
						case 'java:EMail':
							user.email = returnValue.childNodes[i].textContent;
							break;
					}
				}

				callback(null, user);			
			},
			/* Request for user photo */
			findPhoto
		], function(error, result) {
			if (error) {
				mainCallback(error);		
			} else {
				mainCallback(null, result);
			}			
		});
	};	
	this.findUser = function(mainCallback, userName) {
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
								user.id = userValue.childNodes[j].textContent;
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
				async.map(users, findPhoto, function(err, users){
					callback(null, users);
				});				
			}
		], function(error, result) {
			if (error) {
				mainCallback(error);		
			} else {
				mainCallback(null, result);
			}			
		});
	};
}

module.exports = new pmc();