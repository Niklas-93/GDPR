const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validatePatternInput(data) {
  let errors = {};

  data.name = !isEmpty(data.name) ? data.name : "";
  data.context = !isEmpty(data.context) ? data.context : "";
  data.problem = !isEmpty(data.problem) ? data.problem : "";
  data.solution = !isEmpty(data.solution) ? data.solution : "";
  data.consequences = !isEmpty(data.consequences) ? data.consequences : "";
  data.examples = !isEmpty(data.examples) ? data.examples : "";

  if (!Validator.isLength(data.name, { min: 2, max: 30 })) {
    errors.name = "Name of the pattern must be between 2 and 30 characters";
  }

  if (Validator.isEmpty(data.name)) {
    errors.name = "Name field is required";
  }

  if (Validator.isEmpty(data.context)) {
    errors.context = "Description field is required";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
