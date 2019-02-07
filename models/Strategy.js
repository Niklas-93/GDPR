const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const StrategySchema = new Schema({
  name: {
    type: String
    //required: true
  },
  description: {
    type: String
    // required: true
  },

  assignedTactics: [
    {
      /* id: {
        type: [mongoose.Schema.Types.ObjectId]
      },*/
      name: {
        type: String
      },
      description: {
        type: String
      }
    }
  ]
});

module.exports = Strategy = mongoose.model("strategies", StrategySchema);
