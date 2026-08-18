'use strict';
const filemanager = require('./filemanager/');
const utils = require('./utils');

module.exports.findTaskByid = async function findTaskByid (req, res, next) {
  const task = await utils.getTaskById(req.id.value);
  if (!task) {
    res.status(404).send({
      code: 404,
      message: 'Not Found'
    });
    return;
  }
  res.send(task);
};

module.exports.deleteTask = async function deleteTask (req, res, next) {
  const task = await utils.getTaskById(req.id.value);
  if (!task) {
    res.status(404).send({
      code: 404,
      message: 'Not Found'
    });
    return;
  }
  await filemanager.deleteTaskFile(req.id.value).catch(err => {
    res.status(500).send({
      code: 500,
      message: 'Error when deleting task' + err
    });
  });

  res.status(202).send({
    code: 202,
    message: 'Deleted'
  });
};

module.exports.updateTask = async function updateTask (req, res, next) {
  try {
    const taskId = req.id.value;
    const newTask = req.task.value;

    // Verify that the task exists
    const existingTask = await utils.getTaskById(taskId);
    if (!existingTask) {
      res.status(404).send({
        code: 404,
        message: 'Task not found'
      });
      return;
    }

    // Validate that the task ID matches the URL parameter
    if (newTask.id !== taskId) {
      res.status(400).send({
        code: 400,
        message: 'Task ID in body must match the ID in URL'
      });
      return;
    }

    // Validate that the new task has required properties
    if (!newTask.id) {
      res.status(400).send({
        code: 400,
        message: 'Task must have an ID'
      });
      return;
    }

    // Use the filemanager updateTask method that handles the operation atomically
    await filemanager.updateTask(newTask);

    res.status(200).send({
      code: 200,
      message: 'Task updated successfully',
      task: newTask
    });
  } catch (error) {
    res.status(500).send({
      code: 500,
      message: 'Internal server error while updating task: ' + error.message
    });
  }
};
