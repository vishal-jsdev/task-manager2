const Project = require('../models/project.Schema');
const mongoose = require('mongoose');

const {
  validateDate
} = require('../utils/user/userData.helper');
const { asyncHandler } = require('../utils/asyncHandler');
const { ApiResponse } = require('../utils/APIResponse');
const { ApiError } = require('../utils/APIError');

module.exports.addProject = asyncHandler(async (req, res) => {
  const { name, description, startDate, endDate, createdBy } = req.body;
  if (!name || !description || !startDate || !endDate) {
    throw ApiError.badRequest(
      'Name, Description, startDate and endDate are required'
    );
  }

  const parsedStartDate = validateDate(startDate);
  const parsedEndDate = validateDate(endDate);


  const project = new Project({
    name,
    description,
    startDate: parsedStartDate,
    endDate:parsedEndDate,
    createdBy
  });
  const newProject = await project.save();

  
  return res
    .status(201)
    .json(
      ApiResponse.created(
        { id: newProject._id, name: newProject.name, description: newProject.description, startDate: newProject.startDate, endDate: newProject.endDate, createdBy: newProject.createdBy },
        'Project created successfully!'
      )
    );
});

module.exports.updateProject = asyncHandler(async (req, res) => {
  const { id, name, description, startDate, endDate } = req.body;
  if (!id || !name || !description || !startDate || !endDate) {
    throw ApiError.badRequest(
      'ID, Name, Description, startDate and endDate are required'
    );
  }

  const parsedStartDate = validateDate(startDate);
  const parsedEndDate = validateDate(endDate);
  let saveData = {
    name,
    description,
    startDate: parsedStartDate,
    endDate:parsedEndDate
  } 

let projectData = await Project.findByIdAndUpdate(
      id,
      { $set: saveData },
      { new: true, runValidators: true }
    );
  
  return res
    .status(200)
    .json(
      ApiResponse.success(
        projectData,
        'Project updated successfully!'
      )
    );
});

module.exports.getProject = asyncHandler(async (req, res) => {
  const { id } = req.params;


  let projectData = await Project.findById(id);
  if (!projectData) {
    throw ApiError.notFound('Project is not found');
  }

  return res
    .status(200)
    .json(
      ApiResponse.success(
        projectData,
        'Project got successfully!'
      )
    );
});

module.exports.removeProject = asyncHandler(async (req, res) => {
const { id } = req.params;


let projectData = await Project.findByIdAndDelete(id);
  
  return res
    .status(200)
    .json(
      ApiResponse.success(
        projectData,
        'Project data deleted successfully!'
      )
    );
});

module.exports.getProjects = asyncHandler(async (req, res) => {
let { page, limit, ownerId } = req.query;
page = parseInt(page) || 1;
limit = parseInt(limit) || 10;

const skip = (page - 1) * limit;

let match = {}
if(ownerId){
  match = { createdBy : ownerId}
}
let projects = await Project.find(match).sort({ date: -1 }).skip(skip).limit(limit).lean();
  
  return res
    .status(200)
    .json(
      ApiResponse.success(
        projects,
        'Projects got successfully!'
      )
    );
});



