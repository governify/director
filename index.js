'use strict';

var fs = require('fs'),
    http = require('http'),
    path = require('path');

var express = require("express");
var cors = require('cors')
var app = express();
var bodyParser = require('body-parser');
const taskExecutor = require('./controllers/taskExecutor')
app.use(bodyParser.json({
  strict: false
}));

app.use(cors());
var oasTools = require('oas-tools');
var jsyaml = require('js-yaml');
var serverPort = 80;

var spec = fs.readFileSync(path.join(__dirname, '/api/oas-doc.yaml'), 'utf8');
var oasDoc = jsyaml.safeLoad(spec);

var options_object = {
  controllers: path.join(__dirname, './controllers'),
  loglevel: 'info',
  strict: false,
  router: true,
  validator: true
};

oasTools.configure(options_object);

oasTools.initialize(oasDoc, app, function() {
  http.createServer(app).listen(serverPort, function() {
    console.log("App running at http://localhost:" + serverPort);
    console.log("________________________________________________________________");
    if (options_object.docs !== false) {
      console.log('API docs (Swagger UI) available on http://localhost:' + serverPort + '/docs');
      console.log("________________________________________________________________");
    }
  });
});

app.get('/info', function(req, res) {
  res.send({
    info: "This API was generated using oas-generator!",
    name: oasDoc.info.title
  });
});

console.log('Starting task executor')
taskExecutor.startExecutor();
