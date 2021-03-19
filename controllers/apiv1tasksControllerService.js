'use strict';
const filemanager = require('./filemanager');
const utils = require('./utils');
const { v4: uuidv4 } = require('uuid');

module.exports.getTasks = async function getTasks (req, res, next) {
  console.log(req.query);
  const tasks = await utils.getTasksByData(req.query);
  console.log('Returning tasks list');
  res.send(tasks);
};

module.exports.addTask = async function addTask (req, res, next) {
  console.log(req.task.value);
  const tasks = await utils.getTasksByData(req.task.value);
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
