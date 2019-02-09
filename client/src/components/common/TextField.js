import React from "react";
import PropTypes from "prop-types";
import { FormGroup, ControlLabel, FormControl } from "react-bootstrap";

const TextField = ({
  label,
  name,
  type,
  placeholder,
  value,
  onChange,
  disabled,
  info,
  error,
  onBlur,
  className
}) => {
  var validationState;
  if (error != null) {
    validationState = "error";
  } else {
    validationState = null;
  }
  return (
    <FormGroup controlId="formBasicText" validationState={validationState}>
      <ControlLabel>{label}</ControlLabel>
      <FormControl
        label={label}
        type={type}
        name={name}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        disabled={disabled}
        onBlur={onBlur}
        className={className}
      />
      {info && <small className="form-text text-muted">{info}</small>}
      {error && <div className="invalid-feedback">{error}</div>}
    </FormGroup>
  );
};

TextField.propTypes = {
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
};

TextField.defaultProps = {
  type: "text"
};

export default TextField;
