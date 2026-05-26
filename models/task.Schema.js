const mongoose = require('mongoose');
const taskSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    subject: {
      type: String,
    },
    dueDate: {
        type: Date,
    },
    status: {
      type: String,
    },
    priority: {
      type: String,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      default: null,
    }
  },
  {
    timestamps: true,
  }
);

const Task = mongoose.model('Task', taskSchema);
module.exports = Task;