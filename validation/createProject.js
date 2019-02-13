const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateProjectInput(data) {
  let errors = {};

  if (!Validator.isLength(data.name, { min: 2, max: 30 })) {
    errors.name = "Name of the project must be between 2 and 30 characters";
  }

  if (Validator.isEmpty(data.name)) {
    errors.name = "Name field is required";
  }

  if (Validator.isEmpty(data.description)) {
    errors.description = "Description field is required";
  }

  if (data.assignedDevelopers.length === 0) {
    errors.assignedDevelopers = "You have to assign at least one developer";
  }

  if (data.assignedStrategies.length === 0) {
    errors.assignedStrategy = "You have to assign at least one strategy";
  }

  if (data.assignedTactics.length === 0) {
    errors.assignedTactic = "You have to assign at least one tactic";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
