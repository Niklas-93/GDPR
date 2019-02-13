import React, { Component } from "react";
import PropTypes from "prop-types";
import { withRouter, Link } from "react-router-dom";
import classnames from "classnames";
import { connect } from "react-redux";
import { registerUser } from "../../actions/authActions";
import { Panel, Col, Row, Button, ButtonToolbar } from "react-bootstrap";

class Register extends Component {
  constructor() {
    super();
    this.state = {
      name: "",
      email: "",
      username: "",
      //initially: set dpo as role in selection
      role: "Data Protection Officer",
      password: "",
      password2: "",
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
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  // if user clicks on register
  onSubmit(e) {
    e.preventDefault();

    const newUser = {
      name: this.state.name,
      username: this.state.username,
      email: this.state.email,
      role: this.state.role,
      password: this.state.password,
      password2: this.state.password2
    };

    this.props.registerUser(newUser, this.props.history);
  }

  // if user cancels registration, forward to login
  cancelRegister() {
    this.setState({
      name: "",
      email: "",
      username: "",
      role: "Data Protection Officer",
      password: "",
      password2: "",
      errors: {}
    });
    this.props.history.push("/login");
  }
  render() {
    const { errors } = this.state;

    return (
      <div className={"landing"}>
        <Col xs={8} xsOffset={2}>
          <Panel style={{ marginBottom: "150px", marginTop: "150px" }}>
            <Panel.Heading>
              <span className={"h4"}>Create your GDPR Recommender account</span>

              <Link to="login" style={{ float: "right" }}>
                Login...
              </Link>
            </Panel.Heading>
            <Panel.Body>
              <div className="register">
                <div className="container">
                  <div className="row">
                    <div className="col-md-6 m-auto">
                      <form noValidate onSubmit={this.onSubmit}>
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
                            <div
                              className="invalid-feedback"
                              style={{ color: "red" }}
                            >
                              {errors.name}
                            </div>
                          )}
                        </div>
                        <div className="form-group">
                          <input
                            type="email"
                            className={classnames(
                              "form-control form-control-lg",
                              {
                                "is-invalid": errors.email
                              }
                            )}
                            placeholder="Email Address"
                            name="email"
                            value={this.state.email}
                            onChange={this.onChange}
                          />
                          {errors.email && (
                            <div
                              className="invalid-feedback"
                              style={{ color: "red" }}
                            >
                              {errors.email}
                            </div>
                          )}
                        </div>
                        <div className="form-group">
                          <input
                            type="text"
                            className={classnames(
                              "form-control form-control-lg",
                              {
                                "is-invalid": errors.username
                              }
                            )}
                            placeholder="User Name"
                            name="username"
                            value={this.state.username}
                            onChange={this.onChange}
                          />
                          {errors.username && (
                            <div
                              className="invalid-feedback"
                              style={{ color: "red" }}
                            >
                              {errors.username}
                            </div>
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
                            <div
                              className="invalid-feedback"
                              style={{ color: "red" }}
                            >
                              {errors.password}
                            </div>
                          )}
                        </div>
                        <div className="form-group">
                          <input
                            type="password"
                            className={classnames(
                              "form-control form-control-lg",
                              {
                                "is-invalid": errors.password2
                              }
                            )}
                            placeholder="Confirm Password"
                            name="password2"
                            value={this.state.password2}
                            onChange={this.onChange}
                          />
                          {errors.password2 && (
                            <div
                              className="invalid-feedback"
                              style={{ color: "red" }}
                            >
                              {errors.password2}
                            </div>
                          )}
                        </div>
                        <div class="form-group">
                          <label for="exampleFormControlSelect">
                            Choose Role
                          </label>
                          <select
                            class="form-control"
                            id="exampleFormControlSelect"
                            onChange={this.onChange}
                            name="role"
                          >
                            <option value="Data Protection Officer">
                              Data Protection Officer
                            </option>
                            <option value="Project Manager">
                              Project Manager
                            </option>
                            <option value="Developer">Developer</option>
                          </select>
                        </div>
                        <div className="rowC">
                          <Row>
                            <Col xs={12} xsOffset={0}>
                              <ButtonToolbar>
                                <Button
                                  className={"dismissbutton col-xs-5"}
                                  onClick={() => this.cancelRegister()}
                                >
                                  Cancel
                                </Button>
                                <Button
                                  onClick={this.onSubmit}
                                  //href="/Overview"
                                  bsStyle="primary"
                                  className={"col-xs-5"}
                                >
                                  Register
                                </Button>
                              </ButtonToolbar>
                            </Col>
                          </Row>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </Panel.Body>
          </Panel>
        </Col>
      </div>
    );
  }
}

Register.propTypes = {
  registerUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { registerUser }
)(withRouter(Register));
