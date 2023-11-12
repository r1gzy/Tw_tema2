const express = require('express');
const { join, resolve } = require('path');
const PORT = process.env.PORT || 8080;
const taskService = require('./service')('tasks.json');

const app = express();

app.use(express.static(join(__dirname, '..', 'client')));

app.get('/tasks', (request, response) => {
    const tasks = taskService.getTasksByStatus(''); 

    if (Object.keys(tasks).length === 0) {
        response.status(204).send();
    } else {
        response.json(tasks);
    }
});


app.put('/tasks', (request, response) => {
    const { task, oldStatus, newStatus } = request.query;

    if (!task || !oldStatus || !newStatus) {
        return response.status(400).send('Missing task or status parameters');
    }

    try {
        const wasChanged = taskService.changeTaskStatus(task, oldStatus, newStatus);
        if (wasChanged) {
            response.send(`Task status changed from ${oldStatus} to ${newStatus}`);
        } else {
            response.status(404).send('Task not found or could not be updated');
        }
    } catch (error) {
        response.status(500).send(error.message);
    }
});

app.listen(PORT, () => console.log(`Server is running on port ${PORT}.`));
