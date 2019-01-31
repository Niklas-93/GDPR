const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const TacticSchema = new Schema({
  name: {
    type: String
    //required
  },
  description: {
    type: String
    //required
  }
});

module.exports = Tactic = mongoose.model("tactics", TacticSchema);
