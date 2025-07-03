const mustache = require('mustache');
mustache.escape = function (text) { return text; };
const filemanager = require('../filemanager');
const logger = require('governify-commons').getLogger().tag('utils');

module.exports.getTaskById = async function getTaskById (id) {
  const tasks = await filemanager.readFiles(false);
  const task = tasks.filter(ex => {
    return ex.id === id;
  });
  return task[0];
};

module.exports.getTasksByData = async function getTasksByData (data, isTaskComparison = false) {
  const tasks = await filemanager.readFiles(false);
  
  if (isTaskComparison) {
    // When comparing full task objects (for duplicate checking)
    const tasksFiltered = tasks.filter(task => {
      // Compare all relevant properties excluding id and timestamps
      const excludeProps = ['id', 'createdAt', 'updatedAt'];
      for (const prop in data) {
        if (!excludeProps.includes(prop)) {
          if (task[prop] === undefined || String(task[prop]) !== String(data[prop])) {
            return false;
          }
        }
      }
      return true;
    });
    return tasksFiltered;
  } else {
    // When filtering by query parameters (for search/filter)
    const tasksFiltered = tasks.filter(task => {
      for (const prop in data) {
        if (task[prop] === undefined || String(task[prop]) !== String(data[prop])) {
          logger.info(`Property mismatch: ${prop} - Task value: ${task[prop]}, Query value: ${data[prop]}`);
          return false;
        }
      }
      return true;
    });
    return tasksFiltered;
  }
};
