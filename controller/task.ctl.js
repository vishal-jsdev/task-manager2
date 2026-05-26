const Task = require('../models/task.Schema');
const mongoose = require('mongoose');

const {
  validateDate,
  validateId
} = require('../utils/user/userData.helper');
const { asyncHandler } = require('../utils/asyncHandler');
const { ApiResponse } = require('../utils/APIResponse');
const { ApiError } = require('../utils/APIError');

module.exports.addTask = asyncHandler(async (req, res) => {
  const { name, subject, dueDate, status, priority, assignedTo, projectId } = req.body;
  if (!name || !subject || !dueDate || !status || !priority || !assignedTo || !projectId) {
    throw ApiError.badRequest(
      'Name, Subject, Due Date, Status, Priority, Assigned To and Project Id are required',
      {
        name: !name ? 'Name is required' : undefined,
        subject: !subject ? 'Subject is required' : undefined,
        dueDate: !dueDate ? 'Due Date is required' : undefined,
        status: !status ? 'Status is required' : undefined,
        priority: !priority ? 'Priority is required' : undefined,
        assignedTo: !assignedTo ? 'Assigned To is required' : undefined,
        projectId: !projectId ? 'Project Id is required' : undefined,
      }
    );
  }

  const parsedDueDate = validateDate(dueDate);
  


  const task = new Task({
    name,
    subject,
    dueDate: parsedDueDate,
    status,
    priority,
    assignedTo,
    projectId
  });
  const newTask = await task.save();

  
  return res
    .status(201)
    .json(
      ApiResponse.created(
        newTask,
        'Task created successfully!'
      )
    );
});

module.exports.updateTask = asyncHandler(async (req, res) => {
 const { id, dueDate, ...reqData } = req.body;
  validateId(id, 'Task');

  const parsedDueDate = validateDate(dueDate);
  const saveData = {
    ...reqData,
    dueDate: parsedDueDate
  } 

const taskData = await Task.findByIdAndUpdate(
      id,
      { $set: saveData },
      { new: true, runValidators: true }
    );
if (!taskData) {
    throw ApiError.notFound('Task is not found');
}

  
  return res
    .status(200)
    .json(
      ApiResponse.success(
        taskData,
        'Task updated successfully!'
      )
    );
});

module.exports.getTask = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateId(id, 'Task')

  const taskData = await Task.findById(id);
  if (!taskData) {
    throw ApiError.notFound('Task is not found');
  }

  return res
    .status(200)
    .json(
      ApiResponse.success(
        taskData,
        'Task got successfully!'
      )
    );
});

module.exports.removeTask = asyncHandler(async (req, res) => {
const { id } = req.params;
validateId(id, 'Task')

const taskData = await Task.findByIdAndDelete(id);
if (!taskData) {
    throw ApiError.notFound('Task is not found');
}  
  return res
    .status(200)
    .json(
      ApiResponse.success(
        taskData,
        'Task data deleted successfully!'
      )
    );
});

module.exports.getTasks = asyncHandler(async (req, res) => {
let { page, limit, status, priority, assignedTo } = req.query;
page = parseInt(page) || 1;
limit = parseInt(limit) || 10;

const skip = (page - 1) * limit;

let match = {}
if(status){
  match = { status }
}
if(priority){
  match = {...match, priority}
}
if( assignedTo){
  match = {...match, assignedTo}
}

const tasks = await Task.find(match).sort({ date: -1 }).skip(skip).limit(limit).lean();
  
  return res
    .status(200)
    .json(
      ApiResponse.success(
        tasks,
        'Tasks fetched successfully'
      )
    );
});



