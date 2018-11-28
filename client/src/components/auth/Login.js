import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import classnames from "classnames";
import { loginUser } from "../../actions/authActions";
import { Panel, Col, Tabs, Tab, Button, Collapse } from "react-bootstrap";

class Login extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      errors: {}
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    if (this.props.auth.isAuthenticated) {
      this.props.history.push("/overview");
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.auth.isAuthenticated) {
      this.props.history.push("/overview");
    }

    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
  }

  onSubmit(e) {
    e.preventDefault();

    const userData = {
      name: this.state.name,
      password: this.state.password
    };

    this.props.loginUser(userData);
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  render() {
    const { errors } = this.state;

    return (
      <Col xs={8} xsOffset={2}>
        <Panel>
          <Panel.Heading>
            <h4>Sign in to your Account</h4>
          </Panel.Heading>
          <Panel.Body>
            <div className="login">
              <div className="container">
                <div className="row">
                  <div className="col-md-6 m-auto">
                    <form onSubmit={this.onSubmit}>
                      <div className="form-group">
                        <input
                          type="text"
                          className={classnames(
                            "form-control form-control-lg",
                            {
                              "is-invalid": errors.name
                            }
                          )}
                          placeholder="Name"
                          name="name"
                          value={this.state.name}
                          onChange={this.onChange}
                        />
                        {errors.name && (
                          <div className="invalid-feedback">{errors.name}</div>
                        )}
                      </div>
                      <div className="form-group">
                        <input
                          type="password"
                          className={classnames(
                            "form-control form-control-lg",
                            {
                              "is-invalid": errors.password
                            }
                          )}
                          placeholder="Password"
                          name="password"
                          value={this.state.password}
                          onChange={this.onChange}
                        />
                        {errors.password && (
                          <div className="invalid-feedback">
                            {errors.password}
                          </div>
                        )}
                      </div>
                      <input
                        type="submit"
                        value="Login"
                        className="btn btn-block mt-4 btn-dark"
                      />
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </Panel.Body>
        </Panel>
      </Col>
    );
  }
}

Login.propTypes = {
  loginUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { loginUser }
)(Login);
