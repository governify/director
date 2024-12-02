'use strict';
const logger = require('governify-commons').getLogger().tag('controller-tasks');
const fileManager = require('./filemanager/index.js');

module.exports.getTags = async function getTags(req, res, next) {
  try {
    const tasks = await fileManager.readTasks();
    const tags = {};

    tasks.forEach(task => {
      if (task.tags) {
        task.tags.forEach(tag => {
          if (!tags[tag]) {
            tags[tag] = [];
          }
          tags[tag].push(task);
        });
      }
    });

    res.json(tags);
  } catch (error) {
    logger.error(error);
    res.status(500).end();
  }
};

module.exports.modifyTags = async function modifyTags(params, res, next) {
  try {
    const { tags, taskIds, operation } = params;
    const tasks = await fileManager.readTasks();

    taskIds.forEach(taskId => {
      const task = tasks.find(t => t.id === taskId.value);
      if (task) {
        if (operation.value === 'tag') {
          task.tags = [...new Set([...(task.tags || []), ...tags.value])];
        } else if (operation.value === 'untag') {
          task.tags = (task.tags || []).filter(tag => !tags.value.includes(tag));
        }
      }
    });

    await fileManager.writeTasks(tasks);
    res.status(200).end();
  } catch (error) {
    logger.error(error);
    res.status(500).end();
  }
};

