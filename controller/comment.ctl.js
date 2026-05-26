const Comment = require('../models/comment.Schema');
const mongoose = require('mongoose');

const {
  validateDate,
  validateId
} = require('../utils/user/userData.helper');
const { asyncHandler } = require('../utils/asyncHandler');
const { ApiResponse } = require('../utils/APIResponse');
const { ApiError } = require('../utils/APIError');

module.exports.addComment = asyncHandler(async (req, res) => {
  const { comment, date, taskId } = req.body;
  if (!comment || !date || !taskId) {
    throw ApiError.badRequest(
      'Comment, Date and Task Id are required',
      {
        comment: !comment ? 'Comment is required' : undefined,
        date: !date ? 'Date is required' : undefined,
        taskId: !taskId ? 'Task Id is required' : undefined
      }
    );
  }

  const parsedDate = validateDate(date);
  


  const commentData = new Comment({
    comment,
    date: parsedDate,
    taskId
  });
  const newComment = await commentData.save();

  
  return res
    .status(201)
    .json(
      ApiResponse.created(
        newComment,
        'Comment created successfully!'
      )
    );
});

module.exports.updateComment = asyncHandler(async (req, res) => {
 const { id,  date, ...reqData } = req.body;
  
  validateId(id, 'Comment')
  const parsedDate = validateDate(date);
  

  const saveData = {
    ...reqData,
    date: parsedDate
  } 

const commentData = await Comment.findByIdAndUpdate(
      id,
      { $set: saveData },
      { new: true, runValidators: true }
    );
if (!commentData) {
    throw ApiError.notFound('Comment is not found');
}    
  return res
    .status(200)
    .json(
      ApiResponse.success(
        commentData,
        'Comment updated successfully!'
      )
    );
});


module.exports.removeComment = asyncHandler(async (req, res) => {
const { id } = req.params;
validateId(id, 'Comment')

const commentData = await Comment.findByIdAndDelete(id);
if (!commentData) {
    throw ApiError.notFound('Comment is not found');
}  
  return res
    .status(200)
    .json(
      ApiResponse.success(
        commentData,
        'Comment data deleted successfully!'
      )
    );
});

module.exports.getComments = asyncHandler(async (req, res) => {
let { page, limit, taskId} = req.query;
page = parseInt(page) || 1;
limit = parseInt(limit) || 10;

const skip = (page - 1) * limit;

let match = {}
if(taskId){
  match = { taskId }
}


const comments = await Comment.find(match).sort({ date: -1 }).skip(skip).limit(limit).lean();
  
  return res
    .status(200)
    .json(
      ApiResponse.success(
        comments,
        'Comments fetched successfully'
      )
    );
});



