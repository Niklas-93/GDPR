import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../../actions/authActions";
import SearchBox from "./SearchBox";
import { withRouter } from "react-router-dom";

import { Navbar, Nav, NavDropdown, MenuItem, Image } from "react-bootstrap";
import "./NavigationBar.css";
class Navigationbar extends Component {
  constructor() {
    super();
    this.state = {
      currentPage: "",

      errors: {}
    };
  }

  componentDidMount() {
    this.setState({ currentPage: this.props.location.pathname });
  }

  onLogoutClick(e) {
    e.preventDefault();
    this.props.logoutUser();
    this.props.history.push("/login");
  }
  linkToRegister() {
    this.props.history.push("/register");
  }

  render() {
    const { isAuthenticated } = this.props.auth;
    const username = this.props.auth.user.name;

    const authLinks = (
      <MenuItem eventKey={3.4} onClick={this.onLogoutClick.bind(this)}>
        Log Out
      </MenuItem>
    );
    const guestLinkRegister = (
      <MenuItem
        eventKey={3.5}
        onClick={() => this.props.history.push("/register")}
      >
        <Link to="/register">Sign Up</Link>
      </MenuItem>
    );
    const guestLinkLogin = (
      <MenuItem
        eventKey={3.6}
        onClick={() => this.props.history.push("/login")}
      >
        <Link to="/login">Login</Link>
      </MenuItem>
    );

    return (
      <Navbar inverse collapseOnSelect fixedTop>
        <Navbar.Header>
          <Navbar.Brand>
            <Link to="/overview">GDPR</Link>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          <Navbar.Form pullLeft>
            <div className="placeholder" />
            <SearchBox />
          </Navbar.Form>

          <Image
            id="userPic"
            src="https://venturebeat.com/wp-content/uploads/2016/02/anonymous-face.shutterstock_365080829.jpg?fit=400%2C320&strip=all"
          />

          <Nav>
            <NavDropdown
              eventKey={3}
              title={isAuthenticated ? username : "Profile"}
              id="basic-nav-dropdown"
            >
              <MenuItem eventKey={3.1}>
                <Link
                  to={
                    this.props.auth.user.role === "Data Protection Officer"
                      ? "/overview"
                      : "/pmOverview"
                  }
                >
                  {this.props.auth.user.role} view
                </Link>
              </MenuItem>

              <MenuItem divider />
              {isAuthenticated ? authLinks : guestLinkRegister}
              {isAuthenticated ? "" : guestLinkLogin}
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

Navigationbar.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { logoutUser }
)(withRouter(Navigationbar));
