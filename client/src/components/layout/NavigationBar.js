import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../../actions/authActions";
import SearchBox from "./SearchBox";
import {
  Navbar,
  Nav,
  NavItem,
  NavDropdown,
  MenuItem,
  FormGroup,
  FormControl,
  Button,
  Thumbnail,
  Image
} from "react-bootstrap";
import "./NavigationBar.css";
class Navigationbar extends Component {
  onLogoutClick(e) {
    e.preventDefault();
    this.props.logoutUser();
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
      <MenuItem eventKey={3.5}>
        <Link to="/register">Sign Up</Link>
      </MenuItem>
    );
    const guestLinkLogin = (
      <MenuItem eventKey={3.6}>
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
            <SearchBox /> {/*<Button type="submit">Search!</Button>*/}
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
              <MenuItem eventKey={3.1} componentClass="span">
                <Link
                  to={
                    this.props.auth.user.role === "Project Manager"
                      ? "/pmOverview"
                      : "/Overview"
                  }
                >
                  View
                </Link>
              </MenuItem>
              <MenuItem eventKey={3.2}>Edit</MenuItem>
              <MenuItem divider />
              <MenuItem eventKey={3.3}>Change Role</MenuItem>
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
)(Navigationbar);
