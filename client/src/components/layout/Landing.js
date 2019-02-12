import React, { Component } from "react";
import { Link } from "react-router-dom";
import { PropTypes } from "prop-types";
import { connect } from "react-redux";

import {
  PageHeader,
  ButtonToolbar,
  Button,
  Col,
  Panel,
  Row
} from "react-bootstrap";

import "./Landing.css";
class Landing extends Component {
  componentDidMount() {
    if (this.props.auth.isAuthenticated) {
      this.props.history.push("/overview");
    }
  }

  render() {
    return (
      <div className="landing">
        <Col xs={8} xsOffset={2}>
          <Panel style={{ marginTop: "70px" }}>
            <Panel.Heading id="LandingHeading">
              <Panel.Title>GDPR Recommender</Panel.Title>
            </Panel.Heading>
            <Panel.Body>
              <span>
                Privacy patterns are design solutions to common privacy problems
                — a way to translate "privacy-by-design" into practical advice
                for software engineering. We believe design patterns can help
                document common practices and standardize terminology. We are
                building a living, community space where all can contribute
                their own patterns.
              </span>
              <br />
              <br />
              <br />

              <Col xsOffset={4}>
                <ButtonToolbar>
                  <Link to="/login" className="btn btn-lg btn-primary">
                    Login
                  </Link>
                  <Link to="/register" className="btn btn-lg">
                    Sign Up
                  </Link>
                </ButtonToolbar>
              </Col>
            </Panel.Body>
          </Panel>
        </Col>
      </div>
    );
  }
}

Landing.propTypes = {
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps)(Landing);
