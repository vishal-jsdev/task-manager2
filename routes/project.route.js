const express = require('express');
const route = express.Router();
const ctl = require('../controller/project.ctl');


route.post('/add', ctl.addProject);
route.put('/update', ctl.updateProject);
route.get('/:id', ctl.getProject);
route.delete('/:id', ctl.removeProject);
route.get('/', ctl.getProjects);
module.exports = route;