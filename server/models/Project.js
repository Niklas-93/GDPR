const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const ProjectSchema = new Schema({
  name: {
    type: String,
    required: true
  },

  finished: {
    type: Boolean,
    default: false
  },
  progress: {
    type: Number,
    default: 0
  },
  description: {
    type: String,
    required: true
  },

  assignedTactics: [
    {
      type: Schema.Types.ObjectId,
      ref: "tactics" //[mongoose.Schema.Types.ObjectId]
    }
  ],

  assignedStrategies: [
    {
      type: Schema.Types.ObjectId,
      ref: "strategies" //[mongoose.Schema.Types.ObjectId]
    }
  ],
  assignedStrategiesTest: [
    {
      type: Schema.Types.ObjectId,
      ref: "strategies", //[mongoose.Schema.Types.ObjectId]
      assignedTactics: [
        {
          type: Schema.Types.ObjectId
          //ref: "strategies.assignedTactics" //[mongoose.Schema.Types.ObjectId]
        }
      ]
    }
  ],

  assignedDevelopers: [
    {
      type: Schema.Types.ObjectId,
      ref: "users"
    }
  ],

  creator: {
    type: Schema.Types.ObjectId,
    ref: "users"
  },

  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Project = mongoose.model("projects", ProjectSchema);
