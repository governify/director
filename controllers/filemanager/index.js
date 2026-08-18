const fs = require('fs');
const fsPromises = fs.promises;
const mustache = require('mustache');
mustache.escape = function (text) { return text; };
const taskFolder = 'tasks';
const logger = require('governify-commons').getLogger().tag('file-manager');

module.exports.updateTask = async function updateTask (task) {
  try {
    // Primero escribir el nuevo archivo
    await this.addTaskFile(task);
    // Solo después de que se escriba exitosamente, eliminar cualquier archivo anterior con diferente nombre
    const tasksFileMap = await this.readFilesMap();
    for (const taskFileName in tasksFileMap) {
      if (tasksFileMap[taskFileName].id === task.id && taskFileName !== task.id + '.json') {
        const oldFilePath = taskFolder + '/' + taskFileName;
        logger.info('Removing old task file: ' + oldFilePath);
        await fsPromises.unlink(oldFilePath);
      }
    }
  } catch (error) {
    logger.error('Error updating task: ' + error);
    throw error;
  }
};

module.exports.readFiles = async function readFiles (parsed) {
  return Object.values(await this.readFilesMap(parsed));
};

module.exports.readFilesMap = async function readFilesMap (parsed) {
  const objects = {};
  const filenames = await fsPromises.readdir(taskFolder);
  for (const filename of filenames) {
    if (filename.endsWith('.json')) {
      const fileContent = await fsPromises.readFile(taskFolder + '/' + filename, 'utf-8');
      let jsonObject;
      if (parsed) {
        jsonObject = JSON.parse(mustache.render(fileContent, process.env, {}, ['$_[', ']']));
      } else {
        jsonObject = JSON.parse(fileContent);
      }
      objects[filename] = jsonObject;
    }
  }

  return objects;
};

module.exports.deleteTaskFile = async function deleteTaskFile (id) {
  const tasksFileMap = await this.readFilesMap();
  for (const taskFileName in tasksFileMap) {
    if (tasksFileMap[taskFileName].id === id) {
      const deletedFilePath = taskFolder + '/' + taskFileName;
      logger.info('Deleting task file: ' + deletedFilePath);
      try {
        await fsPromises.unlink(deletedFilePath);
        return;
      } catch (error) {
        logger.error('Error deleting task file: ' + error);
        throw error;
      }
    }
  }
  throw new Error('Task file not found for ID: ' + id);
};

module.exports.addTaskFile = async function addTaskFile (task) {
  return new Promise((resolve, reject) => {
    fs.writeFile(taskFolder + '/' + task.id + '.json', JSON.stringify(task, null, 2), function (err) {
      if (err) {
        logger.error('Error writing task file: ' + err);
        reject(err);
      } else {
        logger.info('Task file created: ' + taskFolder + '/' + task.id + '.json');
        resolve();
      }
    });
  });
};
