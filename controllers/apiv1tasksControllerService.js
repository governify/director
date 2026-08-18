'use strict';
const filemanager = require('./filemanager');
const utils = require('./utils');
const { v4: uuidv4 } = require('uuid');
const logger = require('governify-commons').getLogger().tag('controller-tasks');

module.exports.getTasks = async function getTasks (req, res, next) {
  logger.info(req.query);
  const tasks = await utils.getTasksByData(req.query, false);
  logger.info('Returning tasks list');
  res.send(tasks);
};

module.exports.addTask = async function addTask (req, res, next) {
  logger.info('Adding task: \n', JSON.stringify(req.task.value));
  const tasks = await utils.getTasksByData(req.task.value, true);
  if (tasks.length > 0) {
    res.status(400).send({
      code: 400,
      message: 'Task already exists'
    });
    return;
  }
  const newTask = req.task.value;
  if (!newTask.id) {
    newTask.id = uuidv4();
  }
  filemanager.addTaskFile(newTask);
  res.status(200).send(newTask);
};
