'use strict';
var utils = require('./utils');
var filemanager = require('./filemanager');

module.exports.updateTaskAction = async function updateTaskAction (req, res, next) {
  var task = await utils.getTaskById(req.id.value);
  if (!task) {
    res.status(404).send({
      code: 404,
      message: 'Not Found'
    });
    return;
  }
  if (req.action.value !== 'start' && req.action.value !== 'stop' && req.action.value !== 'switch') {
    res.status(400).send({
      code: 400,
      message: 'Action not permitted'
    });
    return;
  } else { // Valid action provided
    if (task.running) { // Task currently running
      if (req.action.value === 'start') {
        res.status(400).send({
          code: 400,
          message: 'Task already running'
        });
        return;
      } else {
        task.running = false;
      }
    } else {
      if (req.action.value === 'stop') { // Task currently not running
        res.status(400).send({
          code: 400,
          message: 'Task is not running'
        });
        return;
      } else {
        task.running = true;
      }
    }
    filemanager.updateTask(task);
    console.log(task);
  }

  res.send(task);
};
