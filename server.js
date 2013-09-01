require("colors");
express = require("express");

var app = express();

app
  .disable("x-powered-by")
  .engine("html", require("ejs").renderFile)  
  .set("view engine", "html");

app
  .use(express.logger("tiny"))
  .use(express.static("public"));

app.get("/", function(req, res){
  res.render("index");
});

app.get("/views/:templateName", function(req, res){
  res.render(req.params.templateName);
});

app.listen(3000);
console.log("start web-server on port 3000".green);
