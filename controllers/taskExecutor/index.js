const filemanager = require('../filemanager');
// const { v4: uuidv4 } = require('uuid');
const requireFromString = require('require-from-string');
const governify = require('governify-commons');
const logger = governify.getLogger().tag('task-executor');

const programmedTasks = {};

module.exports.runTask = runTask;
module.exports.runScript = runScript;

module.exports.startExecutor = async function () {
  setInterval(programNextTasks, 3000);
};

module.exports.getProgrammedTasks = function () {
  return programmedTasks;
};

async function programNextTasks () {
  const currentTime = new Date().getTime();
  const maxTimeProgram = currentTime + 10000;

  const files = await filemanager.readFiles();

  // Programmed Task Object cleanup
  const taskListId = files.map(x => x.id);
  const programmedListId = Object.keys(programmedTasks);
  const toDelete = programmedListId.filter(id => { return !taskListId.includes(id); });
  const toCreate = taskListId.filter(id => { return !programmedListId.includes(id); });
  toDelete.forEach(id => delete programmedTasks[id]);
  toCreate.forEach(id => { programmedTasks[id] = {}; });

  // Iteration for all task files
  files.filter(task => { return task.running; }).forEach(task => {
    const initTime = new Date(task.init).getTime();
    const endTime = new Date(task.end).getTime();

    if (currentTime > endTime) {
      filemanager.deleteTaskFile(task.id);
    } else {
      let realInitTime = initTime;
      // Remove old period if time init is past for optimization
      if (initTime < currentTime) {
        realInitTime = currentTime - (currentTime - initTime) % task.interval;
      }
      const nextTaskDates = [];
      let currentTimeCalculation = realInitTime;
      while (maxTimeProgram > currentTimeCalculation && endTime > currentTimeCalculation) {
        if (currentTimeCalculation > currentTime && !programmedTasks[task.id][currentTimeCalculation]) {
          nextTaskDates.push(currentTimeCalculation);
        }
        currentTimeCalculation += task.interval;
      }

      nextTaskDates.forEach(time => {
        const scheduledFunction = async function () {
          if (task) {
            delete programmedTasks[task.id]?.[time];
            logger.info(`Executing task: ${task.id} at ${new Date(time).toISOString()}`);
            try {
              await runTask(task);
              logger.info(`Task ${task.id} completed successfully`);
            } catch (error) {
              logger.error(`Error executing task ${task.id}: ${error.message}`);
            }
          } else {
            logger.info('Task canceled because it was deleted.');
          }
        };

        setTimeout(scheduledFunction, time - currentTime);
        programmedTasks[task.id][time] = { timer: 'id' };
      });
    }
  });
}

// Run a specific tasktask
async function runTask (task) {
  try {
    logger.debug(`Fetching script from: ${task.script}`);
    const scriptFile = await governify.httpClient({
      url: task.script,
      method: 'GET',
      headers: { 'User-Agent': 'request' },
      transformResponse: function (response) {
        // do not convert the response to JSON or object
        return response;
      }
    });
    return await runScript(scriptFile.data, task.config, task.id);
  } catch (err) {
    logger.error(`Error obtaining script from ${task.script}: ${err.message}`);
    throw new Error(`Error obtaining script from ${task.script}: ${err.message}`);
  }
}

// Run raw JS file with a specific configuration.
async function runScript (scriptText, config, scriptInfo) {
  let scriptResponse;
  try {
    logger.debug(`Running script for task: ${scriptInfo}`);
    const module = requireFromString(scriptText);

    if (typeof module.main !== 'function') {
      throw new Error('Script does not export a main function');
    }

    scriptResponse = await module.main(config);
    logger.debug(`Script executed successfully for task: ${scriptInfo}`);
  } catch (error) {
    const errorMessage = `Error running script for task ${scriptInfo}: ${error.message}`;
    logger.error(`${errorMessage}\nScript config: ${JSON.stringify(config, null, 2)}`);
    throw new Error(errorMessage);
  }
  return scriptResponse;
}