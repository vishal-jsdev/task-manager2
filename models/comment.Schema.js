const mongoose = require('mongoose');
const commentSchema = new mongoose.Schema(
  {
    comment: {
      type: String,
    },
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task',
      default: null,
    },
    date: {
        type: Date,
    },
    
  },
  {
    timestamps: true,
  }
);
commentSchema.index({taskId:1})

const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;