const assert = require('assert');
const fs = require('fs');
const path = require('path');
const sinon = require('sinon');
const governify = require('governify-commons');

const server = require('../server');
const nockController = require('./nockController');

const serverUrl = 'http://localhost:5800';

describe('Testing', function () {
  before((done) => {
    governify.init().then((commonsMiddleware) => {
      server.deploy('test', commonsMiddleware).then(() => {
        governify.httpClient.setRequestLogging(false);
        nockController.instantiateMockups('test').then(() => {
          sinon.stub(console);
          done();
        }).catch(err2 => {
          console.log(err2.message);
          done(err2);
        });
      }).catch(err1 => {
        console.log(err1.message)
        done(err1);
      });
    });
  });

  //Positive tests
  describe('#apiRestPositiveGetStatusAndBadgeTaskTestRequest()', function () {
    apiRestPositiveGetStatusAndBadgeTaskTestRequest();
  });

  describe('#apiRestPositiveGetTestRequest()', function () {
    apiRestPositiveGetTestRequest();
  });

  describe('#apiRestPositivePostGetDeleteTaskTestRequest()', function () {
    apiRestPositivePostGetDeleteTaskTestRequest();
  });

  describe('#apiRestPositivePutTestRequest()', function () {
    apiRestPositivePutTestRequest();
  });

  describe('#apiRestPositiveStatusActionTaskTestRequest()', function () {
    apiRestPositiveStatusActionTaskTestRequest();
  });

  describe('#apiRestPositiveTestTaskTestRequest()', function () {
    apiRestPositiveTestTaskTestRequest();
  });

  describe('#apiRestPositiveRunTaskTestRequest()', function () {
    apiRestPositiveRunTaskTestRequest();
  });

  //Negative tests
  describe('#apiRestNegativePostTaskTestRequest()', function () {
    apiRestNegativePostTaskTestRequest();
  });

  describe('#apiRestNegativeGetTaskStatusAndBadgeTestRequest()', function () {
    apiRestNegativeGetTaskStatusAndBadgeTestRequest();
  });

  describe('#apiRestNegativePutTaskTestRequest()', function () {
    apiRestNegativePutTaskTestRequest();
  });

  describe('#apiRestNegativeDeleteTaskTestRequest()', function () {
    apiRestNegativeDeleteTaskTestRequest();
  });

  describe('#apiRestNegativeStatusActionTaskTestRequest()', function () {
    apiRestNegativeStatusActionTaskTestRequest();
  });

  describe('#apiRestNegativeGetTaskTestRequest()', function () {
    apiRestNegativeGetTaskTestRequest();
  });

  describe('#apiRestNegativeRunTaskTestRequest()', function () {
    apiRestNegativeRunTaskTestRequest();
  });

  describe('#apiRestNegativeTestTaskTestRequest()', function () {
    apiRestNegativeTestTaskTestRequest();
  });

  after((done) => {
    server.undeploy(done);
  });
});


//Positive tests
function apiRestPositiveGetTestRequest() {
  const testRequests = JSON.parse(fs.readFileSync(path.join(__dirname, '/testRequests.json')));
  for (const testRequest of testRequests) {
    if ( testRequest.name === 'GET all tasks') {
      it('should respond with 200 OK on GET (' + testRequest.name + ')', function (done) {
        try {
          governify.httpClient.get(serverUrl + '/api/v1/tasks').then(response => {
            assert.strictEqual(response.status, 200);
            assert.strictEqual(JSON.stringify(response.data), JSON.stringify(testRequest.response));
            done();
          }).catch(err => {
            assert.fail('Error on request');
          });
        } catch (err) {
          assert.fail('Error when sending request');
        }
      });
    }
  }
}

function apiRestPositivePostGetDeleteTaskTestRequest() {
  const testRequests = JSON.parse(fs.readFileSync(path.join(__dirname, '/testRequests.json')));
  for (const testRequest of testRequests) {
    if ( testRequest.name === 'POST task') {
      it('should respond with 200 OK on POST (' + testRequest.name + ')', function (done) {
        try {
          const options = {
            method: 'POST',
            url: serverUrl + '/api/v1/tasks',
            data: testRequest.body,
            headers: {
              'User-Agent': 'request'
            }
          }
          governify.httpClient.request(options).then(response => {
            assert.strictEqual(response.status, 200);
            assert.strictEqual(fs.existsSync('./tasks/' + testRequest.body.id + '.json'),true);
            done();
          }).catch(err => {
            assert.fail('Error on request');
          });
        } catch (err) {
          assert.fail('Error when sending request');
        }
      });

      it('should respond with 200 OK on GET Task created with (' + testRequest.name + ') and response data should be correct', function (done) {
        try {
          governify.httpClient.get(serverUrl + '/api/v1/tasks/' + testRequest.body.id).then(response => {
            assert.strictEqual(response.status, 200);
            assert.strictEqual(JSON.stringify(response.data), JSON.stringify(testRequest.body));
            done();
          }).catch(err => {
            assert.fail('Error on request');
          });
        } catch (err) {
          assert.fail('Error when sending request');
        }
      });

      it('should respond with 200 OK on DELETE Task created with (' + testRequest.name + ')', function (done) {
        try {
          const options = {
            method: 'DELETE',
            url: serverUrl + '/api/v1/tasks/' + testRequest.body.id,
            headers: {
              'User-Agent': 'request'
            }
          }
          governify.httpClient.request(options).then(response => {
            assert.strictEqual(response.status, 202);
            assert.strictEqual(fs.existsSync('./tasks/' + testRequest.body.id + '.json'),false);
            done();
          }).catch(err => {
            console.log(err)
            assert.fail('Error on request');
          });
        } catch (err) {
          assert.fail('Error when sending request');
        }
      });
    }
  }
}

function apiRestPositivePutTestRequest() {
  const testRequests = JSON.parse(fs.readFileSync(path.join(__dirname, '/testRequests.json')));
  for (const testRequest of testRequests) {
    if ( testRequest.name === 'PUT task') {
      it('should respond with 200 OK on POST (' + testRequest.name + ')', function (done) {
        try {
          const options = {
            method: 'POST',
            url: serverUrl + '/api/v1/tasks',
            data: testRequest.bodyPOST,
            headers: {
              'User-Agent': 'request'
            }
          }
          governify.httpClient.request(options).then(response => {
            assert.strictEqual(response.status, 200);
            assert.strictEqual(fs.existsSync('./tasks/' + testRequest.bodyPOST.id + '.json'),true);
            done();
          }).catch(err => {
            assert.fail('Error on request');
          });
        } catch (err) {
          assert.fail('Error when sending request');
        }
      });

      it('should respond with 200 OK on PUT Task created with (' + testRequest.name + ')', function (done) {
        try {
          const options = {
            method: 'PUT',
            url: serverUrl + '/api/v1/tasks/' + testRequest.bodyPUT.id,
            data: testRequest.bodyPUT,
            headers: {
              'User-Agent': 'request'
            }
          }
          governify.httpClient.request(options).then(response => {
            assert.strictEqual(response.status, 200);
            done();
          }).catch(err => {
            assert.fail('Error on request');
          });
        } catch (err) {
          assert.fail('Error when sending request');
        }
      });

      it('should respond with 200 OK on GET Task created with (' + testRequest.name + ') and response data should be correct', function (done) {
        try {
          governify.httpClient.get(serverUrl + '/api/v1/tasks/' + testRequest.bodyPUT.id).then(response => {
            assert.strictEqual(response.status, 200);
            assert.strictEqual(JSON.stringify(response.data), JSON.stringify(testRequest.bodyPUT));
            done();
          }).catch(err => {
            assert.fail('Error on request');
          });
        } catch (err) {
          assert.fail('Error when sending request');
        }
      });

      it('should respond with 200 OK on DELETE Task created with (' + testRequest.name + ')', function (done) {
        try {
          const options = {
            method: 'DELETE',
            url: serverUrl + '/api/v1/tasks/' + testRequest.bodyPUT.id,
            headers: {
              'User-Agent': 'request'
            }
          }
          governify.httpClient.request(options).then(response => {
            assert.strictEqual(response.status, 202);
            assert.strictEqual(fs.existsSync('./tasks/' + testRequest.bodyPUT.id + '.json'),false);
            done();
          }).catch(err => {
            assert.fail('Error on request');
          });
        } catch (err) {
          assert.fail('Error when sending request');
        }
      });
    }
  }
}


function apiRestPositiveGetStatusAndBadgeTaskTestRequest() {
  const testRequests = JSON.parse(fs.readFileSync(path.join(__dirname, '/testRequests.json')));
  for (const testRequest of testRequests) {
    if ( testRequest.name === 'GET status and budget task') {
      it('should respond with 200 OK on POST (' + testRequest.name + ')', function (done) {
        try {
          const options = {
            method: 'POST',
            url: serverUrl + '/api/v1/tasks',
            data: testRequest.body,
            headers: {
              'User-Agent': 'request'
            }
          }
          governify.httpClient.request(options).then(response => {
            assert.strictEqual(response.status, 200);
            assert.strictEqual(fs.existsSync('./tasks/' + testRequest.body.id + '.json'),true);
            done();
          }).catch(err => {
            assert.fail('Error on request');
          });
        } catch (err) {
          assert.fail('Error when sending request');
        }
      });

      it('should respond with 200 OK on GET Task badge on (' + testRequest.name + ')', function (done) {
        try {
          governify.httpClient.get(serverUrl + '/api/v1/tasks/' + testRequest.body.id + '/badge').then(response => {
            assert.strictEqual(response.status, 200);
            assert.notStrictEqual(response.data, undefined);
            done();
          }).catch(err => {
            assert.fail('Error on request');
          });
        } catch (err) {
          assert.fail('Error when sending request');
        }
      });

      
      it('should respond with 200 OK on GET Task status on (' + testRequest.name + ') and response data should be correct', function (done) {
        try {
          governify.httpClient.get(serverUrl + '/api/v1/tasks/' + testRequest.body.id + '/status').then(response => {
            assert.strictEqual(response.status, 200);
            assert.strictEqual(JSON.stringify(response.data), JSON.stringify(testRequest.response))
            done();
          }).catch(err => {
            assert.fail('Error on request');
          });
        } catch (err) {
          assert.fail('Error when sending request');
        }
      });
      
      

      it('should respond with 200 OK on DELETE Task created with (' + testRequest.name + ')', function (done) {
        try {
          const options = {
            method: 'DELETE',
            url: serverUrl + '/api/v1/tasks/' + testRequest.body.id,
            headers: {
              'User-Agent': 'request'
            }
          }
          governify.httpClient.request(options).then(response => {
            assert.strictEqual(response.status, 202);
            assert.strictEqual(fs.existsSync('./tasks/' + testRequest.body.id + '.json'),false);
            done();
          }).catch(err => {
            assert.fail('Error on request');
          });
        } catch (err) {
          assert.fail('Error when sending request');
        }
      });
    }
  }
}

function apiRestPositiveStatusActionTaskTestRequest() {
  const testRequests = JSON.parse(fs.readFileSync(path.join(__dirname, '/testRequests.json')));
  for (const testRequest of testRequests) {
    if ( testRequest.name === 'Status Action') {
      it('should respond with 200 OK on POST (' + testRequest.name + ')', function (done) {
        try {
          const options = {
            method: 'POST',
            url: serverUrl + '/api/v1/tasks',
            data: testRequest.body,
            headers: {
              'User-Agent': 'request'
            }
          }
          governify.httpClient.request(options).then(response => {
            assert.strictEqual(response.status, 200);
            assert.strictEqual(fs.existsSync('./tasks/' + testRequest.body.id + '.json'),true);
            done();
          }).catch(err => {
            assert.fail('Error on request');
          });
        } catch (err) {
          assert.fail('Error when sending request');
        }
      });

      it('should respond with 200 OK on POST action(' + testRequest.name + ') and response data should be correct', function (done) {
        try {
          const options = {
            method: 'POST',
            url: serverUrl + '/api/v1/tasks/' + testRequest.body.id + '/status/' + testRequest.type,
            headers: {
              'User-Agent': 'request'
            }
          }
          governify.httpClient.request(options).then(response => {
            assert.strictEqual(response.status, 200);
            assert.strictEqual(JSON.stringify(response.data), JSON.stringify(testRequest.response));
            done();
          }).catch(err => {
            assert.fail('Error on request');
          });
        } catch (err) {
          assert.fail('Error when sending request');
        }
      });

      it('should respond with 200 OK on DELETE Task created with (' + testRequest.name + ')', function (done) {
        try {
          const options = {
            method: 'DELETE',
            url: serverUrl + '/api/v1/tasks/' + testRequest.body.id,
            headers: {
              'User-Agent': 'request'
            }
          }
          governify.httpClient.request(options).then(response => {
            assert.strictEqual(response.status, 202);
            assert.strictEqual(fs.existsSync('./tasks/' + testRequest.body.id + '.json'),false);
            done();
          }).catch(err => {
            assert.fail('Error on request');
          });
        } catch (err) {
          assert.fail('Error when sending request');
        }
      });
    }
  }
}


function apiRestPositiveRunTaskTestRequest() {
  const testRequests = JSON.parse(fs.readFileSync(path.join(__dirname, '/testRequests.json')));
  for (const testRequest of testRequests) {
    if ( testRequest.name === 'Run Task') {
      it('should respond with 200 OK on POST (' + testRequest.name + ')', function (done) {
        try {
          const options = {
            method: 'POST',
            url: serverUrl + '/api/v1/tasks',
            data: testRequest.body,
            headers: {
              'User-Agent': 'request'
            }
          }
          governify.httpClient.request(options).then(response => {
            assert.strictEqual(response.status, 200);
            assert.strictEqual(fs.existsSync('./tasks/' + testRequest.body.id + '.json'),true);
            done();
          }).catch(err => {
            assert.fail('Error on request');
          });
        } catch (err) {
          assert.fail('Error when sending request');
        }
      });

      
      it('should respond with 200 OK on POST Run Task on (' + testRequest.name + ')', function (done) {
        try {
          const options = {
            method: 'POST',
            url: serverUrl + '/api/v1/tasks/' + testRequest.body.id + '/run',
            headers: {
              'User-Agent': 'request'
            }
          }
          governify.httpClient.request(options).then(response => {
            assert.strictEqual(response.status, 200);
            assert.strictEqual(JSON.stringify(response.data), JSON.stringify(testRequest.body.config));
            done();
          }).catch(err => {
            console.log('there' ,response)
            assert.fail('Error on request');
          });
        } catch (err) {
          console.log('there' ,response)
          assert.fail('Error when sending request');
        }
      });
      
      
      

      it('should respond with 200 OK on DELETE Task created with (' + testRequest.name + ')', function (done) {
        try {
          const options = {
            method: 'DELETE',
            url: serverUrl + '/api/v1/tasks/' + testRequest.body.id,
            headers: {
              'User-Agent': 'request'
            }
          }
          governify.httpClient.request(options).then(response => {
            assert.strictEqual(response.status, 202);
            assert.strictEqual(fs.existsSync('./tasks/' + testRequest.body.id + '.json'),false);
            done();
          }).catch(err => {
            assert.fail('Error on request');
          });
        } catch (err) {
          assert.fail('Error when sending request');
        }
      });
    }
  }
}

function apiRestPositiveTestTaskTestRequest() {
  const testRequests = JSON.parse(fs.readFileSync(path.join(__dirname, '/testRequests.json')));
  for (const testRequest of testRequests) {
    if ( testRequest.name === 'Test Task') {
      it('should respond with 200 OK on POST Test Task on (' + testRequest.name + ')', function (done) {
        try {
          const options = {
            method: 'POST',
            url: serverUrl + '/api/v1/tasks/test',
            data: testRequest.body,
            headers: {
              'User-Agent': 'request'
            }
          }
          governify.httpClient.request(options).then(response => {
            assert.strictEqual(response.status, 200);
            assert.strictEqual(JSON.stringify(response.data), JSON.stringify(testRequest.response));
            done();
          }).catch(err => {
            assert.fail('Error on request');
          });
        } catch (err) {
          assert.fail('Error when sending request');
        }
      });
    }
  }
}



//Negative tests
function apiRestNegativePostTaskTestRequest() {
  const testRequests = JSON.parse(fs.readFileSync(path.join(__dirname, '/negativeTestRequests.json')));
  for (const testRequest of testRequests) {
    if ( testRequest.name === 'POST task') {
      it('should respond with 200 OK on POST (' + testRequest.name + ')', function (done) {
        try {
          const options = {
            method: 'POST',
            url: serverUrl + '/api/v1/tasks',
            data: testRequest.body,
            headers: {
              'User-Agent': 'request'
            }
          }
          governify.httpClient.request(options).then(response => {
            assert.strictEqual(response.status, 200);
            assert.strictEqual(fs.existsSync('./tasks/' + testRequest.body.id + '.json'),true);
            done();
          }).catch(err => {
            assert.fail('Error on request');
          });
        } catch (err) {
          assert.fail('Error when sending request');
        }
      });

      it('should respond with 400 Duplicated on POST (' + testRequest.name + ')', function (done) {
        try {
          const options = {
            method: 'POST',
            url: serverUrl + '/api/v1/tasks',
            data: testRequest.body,
            headers: {
              'User-Agent': 'request'
            }
          }
          governify.httpClient.request(options).then(response => {
          }).catch(err => {
            assert.strictEqual(err.response.status, 400);
            assert.strictEqual(err.response.data.message, 'Task already exists');
            assert.strictEqual(fs.existsSync('./tasks/' + testRequest.body.id + '.json'),true);
            done();
          });
        } catch (err) {
          assert.fail('Error when sending request');
        }
      });

      it('should respond with 200 OK on DELETE Task created with (' + testRequest.name + ')', function (done) {
        try {
          const options = {
            method: 'DELETE',
            url: serverUrl + '/api/v1/tasks/' + testRequest.body.id,
            headers: {
              'User-Agent': 'request'
            }
          }
          governify.httpClient.request(options).then(response => {
            assert.strictEqual(response.status, 202);
            assert.strictEqual(fs.existsSync('./tasks/' + testRequest.body.id + '.json'),false);
            done();
          }).catch(err => {
            assert.fail('Error on request');
          });
        } catch (err) {
          assert.fail('Error when sending request');
        }
      });
    }
  }
}

function apiRestNegativeGetTaskTestRequest() {
  const testRequests = JSON.parse(fs.readFileSync(path.join(__dirname, '/negativeTestRequests.json')));
  for (const testRequest of testRequests) {
    if ( testRequest.name === 'GET task') {
      it('should respond with 404 Not Found on GET (' + testRequest.name + ')', function (done) {
        try {
          assert.strictEqual(fs.existsSync('./tasks/' + testRequest.body.id + '.json'),false);
          governify.httpClient.get(serverUrl + '/api/v1/task/' + testRequest.body.id).then(response => {
          }).catch(err => {
            assert.strictEqual(err.response.status, 404);
            assert.strictEqual(err.response.statusText, 'Not Found');
            done();
          });
        } catch (err) {
          assert.fail('Error when sending request');
        }
      });
    }
  } 
}

function apiRestNegativeGetTaskStatusAndBadgeTestRequest() {
  const testRequests = JSON.parse(fs.readFileSync(path.join(__dirname, '/negativeTestRequests.json')));
  for (const testRequest of testRequests) {
    if ( testRequest.name === 'GET status and budget task') {

      it('should respond with 404 Not Found on GET Task badge on (' + testRequest.name + ')', function (done) {
        try {
          governify.httpClient.get(serverUrl + '/api/v1/task/' + testRequest.body.id).then(response => {
          }).catch(err => {
            assert.strictEqual(err.response.status, 404);
            assert.strictEqual(err.response.statusText, 'Not Found');
            assert.strictEqual(fs.existsSync('./tasks/' + testRequest.body.id + '.json'),false);
            done();
          });
        } catch (err) {
          assert.fail('Error when sending request');
        }
      });

      
      it('should respond with 404 Not Found on GET Task status on (' + testRequest.name + ')', function (done) {
        try {
          governify.httpClient.get(serverUrl + '/api/v1/task/' + testRequest.body.id).then(response => {
          }).catch(err => {
            assert.strictEqual(err.response.status, 404);
            assert.strictEqual(err.response.statusText, 'Not Found');
            assert.strictEqual(fs.existsSync('./tasks/' + testRequest.body.id + '.json'),false);
            done();
          });
        } catch (err) {
          assert.fail('Error when sending request');
        }
      });
    }
  }
}

function apiRestNegativePutTaskTestRequest() {
  const testRequests = JSON.parse(fs.readFileSync(path.join(__dirname, '/negativeTestRequests.json')));
  for (const testRequest of testRequests) {
    if ( testRequest.name === 'PUT task') {
      it('should respond with 404 Not Found on PUT (' + testRequest.name + ')', function (done) {
        try {
          const options = {
            method: 'PUT',
            url: serverUrl + '/api/v1/task/' + testRequest.body.id,
            data: testRequest.body,
            headers: {
              'User-Agent': 'request'
            }
          }
          governify.httpClient.request(options).then(response => {
          }).catch(err => {
            assert.strictEqual(err.response.status, 404);
            assert.strictEqual(err.response.statusText, 'Not Found');
            assert.strictEqual(fs.existsSync('./tasks/' + testRequest.body.id + '.json'),false);
            done();
          });
        } catch (err) {
          assert.fail('Error when sending request');
        }
      });
    }
  } 
}

function apiRestNegativeDeleteTaskTestRequest() {
  const testRequests = JSON.parse(fs.readFileSync(path.join(__dirname, '/negativeTestRequests.json')));
  for (const testRequest of testRequests) {
    if ( testRequest.name === 'DELETE task') {
      it('should respond with 404 Not Found on DELETE (' + testRequest.name + ')', function (done) {
        try {
          assert.strictEqual(fs.existsSync('./tasks/' + testRequest.body.id + '.json'),false);
          governify.httpClient.get(serverUrl + '/api/v1/task/' + testRequest.body.id).then(response => {
          }).catch(err => {
            assert.strictEqual(err.response.status, 404);
            assert.strictEqual(err.response.statusText, 'Not Found');
            done();
          });
        } catch (err) {
          assert.fail('Error when sending request');
        }
      });
    }
  } 
}

function apiRestNegativeStatusActionTaskTestRequest() {
  const testRequests = JSON.parse(fs.readFileSync(path.join(__dirname, '/negativeTestRequests.json')));
  for (const testRequest of testRequests) {
    if ( testRequest.name === 'Status Action') {
      it('should respond with 200 OK on POST (' + testRequest.name + ')', function (done) {
        try {
          const options = {
            method: 'POST',
            url: serverUrl + '/api/v1/tasks',
            data: testRequest.body,
            headers: {
              'User-Agent': 'request'
            }
          }
          governify.httpClient.request(options).then(response => {
            assert.strictEqual(response.status, 200);
            assert.strictEqual(fs.existsSync('./tasks/' + testRequest.body.id + '.json'),true);
            done();
          }).catch(err => {
            assert.fail('Error on request');
          });
        } catch (err) {
          assert.fail('Error when sending request');
        }
      });

      if(testRequest.type === 'notFound'){
        it('should respond with 404 Not Found on POST (' + testRequest.name + ')', function (done) {
          try {
            const options = {
              method: 'POST',
              url: serverUrl + '/api/v1/tasks/' + testRequest.id + '/status/' + testRequest.type,
              data: {},
              headers: {
                'User-Agent': 'request'
              }
            }
            assert.strictEqual(fs.existsSync('./tasks/' + testRequest.id + '.json'),false);
            governify.httpClient.request(options).then(response => {
            }).catch(err => {
              assert.strictEqual(err.response.status, 404);
              assert.strictEqual(err.response.data.message, 'Not Found');
              done();
            });
          } catch (err) {
            assert.fail('Error when sending request');
          }
        });
      } else {
        it('should respond with 400 Not Permitted on POST (' + testRequest.name + ')', function (done) {
          try {
            const options = {
              method: 'POST',
              url: serverUrl + '/api/v1/tasks/' + testRequest.id + '/status/' + testRequest.type,
              data: {},
              headers: {
                'User-Agent': 'request'
              }
            }
            assert.strictEqual(fs.existsSync('./tasks/' + testRequest.body.id + '.json'),true);
            governify.httpClient.request(options).then(response => {
            }).catch(err => {
              assert.strictEqual(err.response.status, 400);
              assert.strictEqual(err.response.data.message, testRequest.response);
              done();
            });
          } catch (err) {
            assert.fail('Error when sending request');
          }
        });
      }

      it('should respond with 200 OK on DELETE Task created with (' + testRequest.name + ')', function (done) {
        try {
          const options = {
            method: 'DELETE',
            url: serverUrl + '/api/v1/tasks/' + testRequest.body.id,
            headers: {
              'User-Agent': 'request'
            }
          }
          governify.httpClient.request(options).then(response => {
            assert.strictEqual(response.status, 202);
            assert.strictEqual(fs.existsSync('./tasks/' + testRequest.body.id + '.json'),false);
            done();
          }).catch(err => {
            assert.fail('Error on request');
          });
        } catch (err) {
          assert.fail('Error when sending request');
        }
      });
    }
  }
}

function apiRestNegativeRunTaskTestRequest() {
  const testRequests = JSON.parse(fs.readFileSync(path.join(__dirname, '/negativeTestRequests.json')));
  for (const testRequest of testRequests) {
    if (testRequest.name === 'Run Task') {
      it('should respond with 404 Not Found on POST (' + testRequest.name + ')', function (done) {
        try {
          const options = {
            method: 'POST',
            url: serverUrl + '/api/v1/tasks/' + testRequest.id + '/run',
            headers: {
              'User-Agent': 'request'
            }
          }
          assert.strictEqual(fs.existsSync('./tasks/' + testRequest.body.id + '.json'),false);
          governify.httpClient.request(options).then(response => {
          }).catch(err => {
            assert.strictEqual(err.response.status, 404);
            assert.strictEqual(err.response.data.message, 'Not Found');
            done();
          });
        } catch (err) {
          assert.fail('Error when sending request');
        }
      });
    }

    if (testRequest.name === 'Bad Script Run Task') {
      it('should respond with 200 OK on POST (' + testRequest.name + ')', function (done) {
        try {
          const options = {
            method: 'POST',
            url: serverUrl + '/api/v1/tasks',
            data: testRequest.body,
            headers: {
              'User-Agent': 'request'
            }
          }
          governify.httpClient.request(options).then(response => {
            assert.strictEqual(response.status, 200);
            assert.strictEqual(fs.existsSync('./tasks/' + testRequest.body.id + '.json'),true);
            done();
          }).catch(err => {
            assert.fail('Error on request');
          });
        } catch (err) {
          assert.fail('Error when sending request');
        }
      });

      it('should respond with 500 ERROR on POST (' + testRequest.name + ')', function (done) {
        try {
          const options = {
            method: 'POST',
            url: serverUrl + '/api/v1/tasks/' + testRequest.body.id + '/run',
            headers: {
              'User-Agent': 'request'
            }
          }
          governify.httpClient.request(options).then(response => {
          }).catch(err => {
            assert.strictEqual(err.response.status, 500);
            done();
          });
        } catch (err) {
          assert.fail('Error when sending request');
        }
      });

      it('should respond with 200 OK on DELETE Task created with (' + testRequest.name + ')', function (done) {
        try {
          const options = {
            method: 'DELETE',
            url: serverUrl + '/api/v1/tasks/' + testRequest.body.id,
            headers: {
              'User-Agent': 'request'
            }
          }
          governify.httpClient.request(options).then(response => {
            assert.strictEqual(response.status, 202);
            assert.strictEqual(fs.existsSync('./tasks/' + testRequest.body.id + '.json'),false);
            done();
          }).catch(err => {
            assert.fail('Error on request');
          });
        } catch (err) {
          assert.fail('Error when sending request');
        }
      });
    }
  }
}

function apiRestNegativeTestTaskTestRequest() {
  const testRequests = JSON.parse(fs.readFileSync(path.join(__dirname, '/negativeTestRequests.json')));
  for (const testRequest of testRequests) {
    if ( testRequest.name === 'Test Task') {
      it('should respond with 500 ERROR on POST (' + testRequest.name + ')', function (done) {
        try {
          const options = {
            method: 'POST',
            url: serverUrl + '/api/v1/tasks/test',
            data: testRequest.body,
            headers: {
              'User-Agent': 'request'
            }
          }
          governify.httpClient.request(options).then(response => {
          }).catch(err => {
            assert.strictEqual(err.response.status, 500);
            done();
          });
        } catch (err) {
          assert.fail('Error when sending request');
        }
      });
    }
  }
}

