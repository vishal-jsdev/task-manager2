const User = require('../models/user.Schema');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const {
  validateDate
} = require('../utils/user/userData.helper');
const { asyncHandler } = require('../utils/asyncHandler');
const { ApiResponse } = require('../utils/APIResponse');
const { ApiError } = require('../utils/APIError');

module.exports.addUser = asyncHandler(async (req, res) => {
  const { firstName, lastName , email , password, date } = req.body;
  if (!firstName || !lastName || !email || !password || !date) {
    throw ApiError.badRequest(
      'First Name, Last Name, Email, Password and Date are required'
    );
  }

  const parsedDate = validateDate(date);

if (password.length < 6) {
    throw ApiError.validationError(
      'Password must be at least 6 characters long',
      {
        password: 'Password must be at least 6 characters long',
      }
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    date: parsedDate
  });
  const newUser = await user.save();

  
  return res
    .status(201)
    .json(
      ApiResponse.created(
        { id: newUser._id, firstName: newUser.firstName, lastName: newUser.lastName, email: newUser.email, password: newUser.password, date: newUser.date },
        'User created successfully!'
      )
    );
});

module.exports.updateUser = asyncHandler(async (req, res) => {
  const { id, firstName, lastName , email , password, date } = req.body;
  if (!id || !firstName || !lastName || !email || !password || !date) {
    throw ApiError.badRequest(
      'ID, First Name, Last Name, Email, Password and Date are required'
    );
  }

  const parsedDate = validateDate(date);
  const hashedPassword = await bcrypt.hash(password, 10);
  let saveData = {
    firstName,
    lastName,
    email,
    password: hashedPassword,
    date: parsedDate
  } 

let userData = await User.findByIdAndUpdate(
      id,
      { $set: saveData },
      { new: true, runValidators: true }
    );
  
  return res
    .status(200)
    .json(
      ApiResponse.success(
        userData,
        'User updated successfully!'
      )
    );
});

module.exports.getUser = asyncHandler(async (req, res) => {
  const { id } = req.params;


  let userData = await User.findById(id);
  if (!userData) {
    throw ApiError.notFound('User is not found');
  }

  return res
    .status(200)
    .json(
      ApiResponse.success(
        userData,
        'User got successfully!'
      )
    );
});

module.exports.removeUser = asyncHandler(async (req, res) => {
const { id } = req.params;


let userData = await User.findByIdAndDelete(id);
  
  return res
    .status(200)
    .json(
      ApiResponse.success(
        userData,
        'User data deleted successfully!'
      )
    );
});

module.exports.getUsers = asyncHandler(async (req, res) => {
let { page, limit } = req.query;
page = parseInt(page) || 1;
limit = parseInt(limit) || 10;

const skip = (page - 1) * limit;
let users = await User.find().sort({ date: -1 }).skip(skip).limit(limit).lean();
  
  return res
    .status(200)
    .json(
      ApiResponse.success(
        users,
        'Users got successfully!'
      )
    );
});



