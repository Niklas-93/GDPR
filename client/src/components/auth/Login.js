import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import classnames from "classnames";
import { loginUser } from "../../actions/authActions";
import { Panel, Col, Tabs, Tab, Button, Collapse } from "react-bootstrap";
import { Link } from "react-router-dom";

class Login extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      username: "",
      password: "",
      errors: {}
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    if (this.props.auth.isAuthenticated) {
      if (this.props.auth.user.role == "Data Protection Officer") {
        this.props.history.push("/overview");
      } else if (this.props.auth.user.role == "Project Manager") {
        this.props.history.push("/PMoverview");
      } else {
        this.props.history.push("/overview");
      }
      //this.props.history.push("/overview");
    }
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.auth.isAuthenticated &&
      nextProps.auth.user.role != undefined
    ) {
      if (nextProps.auth.user.role == "Data Protection Officer") {
        this.props.history.push("/overview");
      } else if (nextProps.auth.user.role == "Project Manager") {
        this.props.history.push("/PMoverview");
      } else {
        this.props.history.push("/overview");
      }
    }

    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
  }

  onSubmit(e) {
    e.preventDefault();

    const userData = {
      username: this.state.username,
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
      <div className={"landing"}>
        <div>
          <Col xs={8} xsOffset={2}>
            <Panel style={{ marginBottom: "75px", marginTop: "75px" }}>
              <Panel.Heading>
                <span className={"h4"}>Sign in to your Account</span>
                <Link to="register" style={{ float: "right" }}>
                  Register...
                </Link>

                {/*<span
                  onClick={() => this.props.history.push("/register")}
                  style={{ float: "right" }}
                  className={"link"}
                >Register...</span> */}
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
        </div>
      </div>
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
