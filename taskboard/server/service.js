const { existsSync, readFileSync, writeFileSync } = require('fs');
const path = require('path'); 

module.exports = function(tasksFilePath) {
  const fullPath = path.join(__dirname, tasksFilePath);

  function getTasksByStatus(status) {
    const tasks = JSON.parse(readFileSync(fullPath, 'utf8'));

    if (status === '') {
        return tasks;
    }
    return tasks[status] || [];
}


  function changeTaskStatus(task, currentStatus, newStatus) {
    if (!existsSync(fullPath)) {
      throw new Error('Tasks file does not exist');
    }
    const tasks = JSON.parse(readFileSync(fullPath, 'utf8'));
    if (!tasks[currentStatus] || !tasks[currentStatus].includes(task)) {
      return false;
    }

    tasks[currentStatus] = tasks[currentStatus].filter(t => t !== task);

    if (!tasks[newStatus]) {
      tasks[newStatus] = [];
    }
    tasks[newStatus].push(task);

    writeFileSync(fullPath, JSON.stringify(tasks, null, 2), 'utf8');
    return true;
  }

  return {
    getTasksByStatus,
    changeTaskStatus
  };
};
