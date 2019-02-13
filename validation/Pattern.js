const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validatePatternInput(data) {
  let errors = {};

  data.name = !isEmpty(data.name) ? data.name : "";
  data.summary = !isEmpty(data.summary) ? data.summary : "";
  data.context = !isEmpty(data.context) ? data.context : "";
  data.problem = !isEmpty(data.problem) ? data.problem : "";
  data.solution = !isEmpty(data.solution) ? data.solution : "";

  if (Validator.isEmpty(data.name)) {
    errors.name = "Name field is required";
  }

  if (Validator.isEmpty(data.summary)) {
    errors.summary = "Summary field is required";
  }

  if (Validator.isEmpty(data.context)) {
    errors.context = "Context field is required";
  }

  if (Validator.isEmpty(data.problem)) {
    errors.problem = "Problem field is required";
  }

  if (Validator.isEmpty(data.solution)) {
    errors.solution = "Solution field is required";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
