const express = require('express');
const route = express.Router();
const ctl = require('../controller/user.ctl');


route.post('/add', ctl.addUser);
route.put('/update', ctl.updateUser);
route.get('/:id', ctl.getUser);
route.delete('/:id', ctl.removeUser);
route.get('/', ctl.getUsers);
module.exports = route;