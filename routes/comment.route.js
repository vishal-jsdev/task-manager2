const express = require('express');
const route = express.Router();
const ctl = require('../controller/comment.ctl');


route.post('/add', ctl.addComment);
route.put('/update', ctl.updateComment);
route.delete('/:id', ctl.removeComment);
route.get('/', ctl.getComments);
module.exports = route;