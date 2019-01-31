const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateProjectInput(data) {
  let errors = {};

  data.name = !isEmpty(data.name) ? data.name : "";
  data.description = !isEmpty(data.description) ? data.description : "";

  if (!Validator.isLength(data.name, { min: 2, max: 30 })) {
    errors.name = "Name of the pattern must be between 2 and 30 characters";
  }

  if (Validator.isEmpty(data.name)) {
    errors.name = "Name field is required";
  }

  if (Validator.isEmpty(data.description)) {
    errors.description = "Description field is required";
  }
  /* 
  if (Validator.isEmpty(data.assignedDevelopers)) {
    errors.assignedDevelopers = "You have to assign at least one developer";
  }

  if (Validator.isEmpty(data.assignedConcerns)) {
    errors.assignedConcerns = "You have to assign at least one concern";
  } */

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
