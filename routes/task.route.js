const express = require('express');
const route = express.Router();
const ctl = require('../controller/task.ctl');


route.post('/add', ctl.addTask);
route.put('/update', ctl.updateTask);
route.get('/:id', ctl.getTask);
route.delete('/:id', ctl.removeTask);
route.get('/', ctl.getTasks);
module.exports = route;