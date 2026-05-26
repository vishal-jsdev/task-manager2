const Project = require('../models/project.Schema');
const mongoose = require('mongoose');

const {
  validateDate,
  validateId
} = require('../utils/user/userData.helper');
const { asyncHandler } = require('../utils/asyncHandler');
const { ApiResponse } = require('../utils/APIResponse');
const { ApiError } = require('../utils/APIError');

module.exports.addProject = asyncHandler(async (req, res) => {
  const { name, description, startDate, endDate, createdBy } = req.body;
  if (!name || !description || !startDate || !endDate) {
    throw ApiError.badRequest(
      'Name, Description, startDate and endDate are required',
       {
        name: !name ? 'Name is required' : undefined,
        description: !description ? 'Description is required' : undefined,
        startDate: !startDate ? 'Start Date is required' : undefined,
        endDate: !endDate ? 'End Date is required' : undefined
      }
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
        newProject,
        'Project created successfully!'
      )
    );
});

module.exports.updateProject = asyncHandler(async (req, res) => {
  const { id, startDate, endDate, ...reqData } = req.body;
  
  validateId(id, 'Project')

  const parsedStartDate = validateDate(startDate);
  const parsedEndDate = validateDate(endDate);
  const saveData = {
    ...reqData,
    startDate: parsedStartDate,
    endDate:parsedEndDate
  } 

const projectData = await Project.findByIdAndUpdate(
      id,
      { $set: saveData },
      { new: true, runValidators: true }
    );

if (!projectData) {
    throw ApiError.notFound('Project is not found');
}
  
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
  validateId(id, 'Project')

  const projectData = await Project.findById(id);
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
validateId(id, 'Project')

const projectData = await Project.findByIdAndDelete(id);
 
if (!projectData) {
    throw ApiError.notFound('Project is not found');
}
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
const projects = await Project.find(match).sort({ date: -1 }).skip(skip).limit(limit).lean();
  
  return res
    .status(200)
    .json(
      ApiResponse.success(
        projects,
        'Projects fetched successfully'
      )
    );
});



