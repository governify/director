'use strict';
const deploy = (env, commonsMiddleware) => {
  return new Promise((resolve, reject) => {
    try {
      const fs = require('fs');
      const http = require('http');
      const path = require('path');

      const express = require('express');
      const cors = require('cors');
      const app = express();
      const bodyParser = require('body-parser');
      const taskExecutor = require('./controllers/taskExecutor');
      app.use(bodyParser.json({
        strict: false
      }));
      app.use(cors());
      app.use(commonsMiddleware);

      const logger = require('governify-commons').getLogger().tag('controller-tasks');

      const oasTools = require('oas-tools');
      const jsyaml = require('js-yaml');
      const serverPort = process.env.PORT || 5800;

      const spec = fs.readFileSync(path.join(__dirname, '/api/oas-file.yaml'), 'utf8');
      const oasDoc = jsyaml.load(spec);

      const optionsObject = {
        controllers: path.join(__dirname, './controllers'),
        loglevel: env === 'test' ? 'error' : 'info',
        strict: false,
        router: true,
        validator: true
      };

      oasTools.configure(optionsObject);

      oasTools.initialize(oasDoc, app, function () {
        http.createServer(app).listen(serverPort, function () {
          if (env !== 'test') {
            logger.info('________________________________________________________________');
            logger.info('App running at http://localhost:' + serverPort);
            logger.info('________________________________________________________________');
            if (optionsObject.docs !== false) {
              logger.info('API docs (Swagger UI) available on http://localhost:' + serverPort + '/docs');
              logger.info('________________________________________________________________');
            }
          }
          resolve();
        });
      });

      app.get('/info', function (req, res) {
        res.send({
          info: 'This API was generated using oas-generator!',
          name: oasDoc.info.title
        });
      });

      logger.info('Starting task executor');
      taskExecutor.startExecutor();
    } catch (err) {
      reject(err);
    }
  });
};

const undeploy = () => {
  process.exit();
};

module.exports = {
  deploy: deploy,
  undeploy: undeploy
};
