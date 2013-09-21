var parser = require('libxml-to-js'),
  authReq = [
  '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:typ="http://www.epam.com/wsapi/types">
     <soapenv:Header>
      <wsse:Security xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd" soapenv:actor="" soapenv:mustUnderstand="0">
        <wsse:UsernameToken wsu:Id="" xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd">
          <wsse:Username>test_user</wsse:Username>
          <wsse:Password Type="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-username-token-profile-1.0#PasswordText">12345678</wsse:Password>
        </wsse:UsernameToken>
      </wsse:Security>
    </soapenv:Header>
     <soapenv:Body>
        <typ:authenticateAsAPIClient>
           <typ:login>', 'login', '</typ:login>
           <typ:password>', 'password', '</typ:password>
        </typ:authenticateAsAPIClient>
     </soapenv:Body>
  </soapenv:Envelope>'];


var routeLogin = function(req, res) {
  parser(xml, function (error, result) {
    if (error) {
        console.error(error);
    } else {
        console.log(result);
    }
});

};

module.exports = function(app) {
  app.post('/login', routeLogin);
};