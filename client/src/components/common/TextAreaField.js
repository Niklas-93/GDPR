import React from "react";
import PropTypes from "prop-types";
import {
  FormGroup,
  ControlLabel,
  FormControl,
  InputGroup,
  Button
} from "react-bootstrap";

const TextAreaField = ({
  label,
  name,
  placeholder,
  value,
  error,
  info,
  onChange,
  onBlur,
  onSubmit,
  className
}) => {
  var validationState;
  if (error != null) {
    validationState = "error";
  } else {
    validationState = null;
  }
  function addonChoice() {
    {
      return !label ? (
        <FormGroup controlId="formControlsTextarea">
          <InputGroup>
            <InputGroup.Addon className="addon">
              <Button onClick={onSubmit} bsSize="small">
                <i className="far fa-comment-alt" />
              </Button>
            </InputGroup.Addon>

            <FormControl
              componentClass="textarea"
              label={label}
              name={name}
              value={value}
              placeholder={placeholder}
              onChange={onChange}
            />
            {info && <small className="form-text text-muted">{info}</small>}
            {error && <div className="invalid-feedback">{error}</div>}
          </InputGroup>
        </FormGroup>
      ) : (
        <FormGroup
          controlId="formControlsTextarea"
          validationState={validationState}
        >
          <ControlLabel>{label}</ControlLabel>
          <FormControl
            componentClass="textarea"
            label={label}
            name={name}
            value={value}
            placeholder={placeholder}
            onChange={onChange}
            onBlur={onBlur}
            className={className}
          />
          {info && <small className="form-text text-muted">{info}</small>}
          {error && <div className="invalid-feedback">{error}</div>}
        </FormGroup>
      );
    }
  }

  return addonChoice();
};

TextAreaField.propTypes = {
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  info: PropTypes.string,
  error: PropTypes.string,
  onChange: PropTypes.func.isRequired
};

export default TextAreaField;
