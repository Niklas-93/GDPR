import React, { Component } from "react";
import PropTypes from "prop-types";
import { withRouter, Link } from "react-router-dom";
import classnames from "classnames";
import { connect } from "react-redux";

import Spinner from "../common/Spinner";
import {
  createProject,
  setAssignedDevelopers,
  setAssignedTactics,
  setAssignedStrategies,
  resetProject,
  addAssignedProjects,
  resetErrors
} from "../../actions/projectActions";
import TextAreaField from "../common/TextAreaField";
import TextField from "../common/TextField";
import DevListGroupField from "../common/DevListGroupField";
import TacListGroupField from "../common/TacListGroupField";
import StrListGroupField from "../common/StrListGroupField";
import { Button, Row, Col } from "react-bootstrap";
import { getDevelopers } from "../../actions/userActions";
import { getTactics } from "../../actions/tacticActions";
import { getStrategies } from "../../actions/strategyActions";
import store from "../../store";

import "./CreateProject.css";

class CreateProject extends Component {
  constructor() {
    super();
    this.state = {
      description: "",
      name: "",
      assignedStrategies: [],
      assignedTactics: [],
      finished: false,
      assignedDevelopers: [],
      developers: [],
      comment: [],

      errors: {}
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    this.props.getDevelopers();
    this.props.getStrategies();
    this.props.resetProject();
    this.props.resetErrors();
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  // onSubmit send the data to the database and set also the project to the developers
  onSubmit(e) {
    e.preventDefault();

    const newProject = {
      name: this.state.name,
      description: this.state.description,
      assignedTactics: store.getState().project.assignedTactics,
      assignedStrategies: store.getState().project.assignedStrategies,
      assignedDevelopers: store.getState().project.assignedDevelopers,
      finished: this.state.finished
    };
    // send project data to database
    this.props.createProject(newProject, this.props.history);

    /*  timeout is because of time of creating the project, after creating the project
        the function will get the latest project from the database and send this to
        the backend, where the assigend projects from the developers will be updated */
    setTimeout(() => {
      this.props.addAssignedProjects(
        store.getState().project.projects[
          store.getState().project.projects.length - 1
        ]
      );
    }, 2000);
  }

  render() {
    const { loading, developers } = this.props;
    const { loading2, tactics } = this.props;
    const { loading3, strategies } = this.props;

    let developerContent;
    let tacticContent;
    let strategyContent;

    if (developers === null || loading) {
      developerContent = <Spinner />;
    } else {
      developerContent = (
        // the select developer field will be created
        <DevListGroupField
          developers={this.props.developers}
          location={this.props.location}
        />
      );
    }

    if (tactics === null || loading2) {
      tacticContent = <Spinner />;
    } else {
      tacticContent = (
        // the select tactic field will be created
        <TacListGroupField
          tactics={this.props.assignedStrategies}
          location={this.props.location}
        />
      );
    }

    if (strategies === null || loading3) {
      strategyContent = <Spinner />;
    } else {
      strategyContent = (
        // the select tactic field will be created
        <StrListGroupField
          strategies={this.props.strategies}
          location={this.props.location}
        />
      );
    }

    return (
      <form onSubmit={this.onSubmit}>
        <TextField
          label="Name of project"
          name="name"
          value={this.state.name}
          placeholder="Enter the name of the project"
          onChange={this.onChange}
          error={this.props.errors.name}
        />

        <TextAreaField
          label="Description"
          name="description"
          value={this.state.description}
          placeholder="Enter description"
          onChange={this.onChange}
          error={this.props.errors.description}
        />

        <Row className="show-grid">
          <Col md={3}>
            <h4>Choose your strategies</h4>
            {strategyContent}
            {/* If there are errors which comes from the backend, show them */}
            {this.props.errors.assignedStrategy
              ? this.props.errors.assignedStrategy
              : ""}
          </Col>
          <Col md={3}>
            {" "}
            <h4>and the according tactics</h4>
            {tacticContent}
            {/* If there are errors which comes from the backend, show them */}
            {this.props.errors.assignedTactic &&
            !this.props.errors.assignedStrategy
              ? this.props.errors.assignedTactic
              : ""}
          </Col>

          <Col md={6}>
            <h4>Choose your developer</h4>
            {developerContent}
            {/* If there are errors which comes from the backend, show them */}
            {this.props.errors.assignedDevelopers
              ? this.props.errors.assignedDevelopers
              : ""}
          </Col>
        </Row>

        <Button
          className="projectButton"
          bsStyle="primary"
          onClick={this.onSubmit}
        >
          Create Project
        </Button>
        <Link to="/PMoverview">
          <Button
            className="projectButton"
            bsStyle="info"
            onClick={this.props.resetProject}
          >
            Abort
          </Button>
        </Link>
      </form>
    );
  }
}

CreateProject.propTypes = {
  createProject: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  getDevelopers: PropTypes.func.isRequired,
  getTactics: PropTypes.func.isRequired,
  getStrategies: PropTypes.func.isRequired,
  setAssignedDevelopers: PropTypes.func.isRequired,
  setAssignedTactics: PropTypes.func.isRequired,
  setAssignedStrategies: PropTypes.func.isRequired,
  resetProject: PropTypes.func.isRequired,
  addAssignedProjects: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors,
  developers: state.user.developers,
  tactics: state.tactic.tactics,
  strategies: state.strategy.strategies,
  assignedDevelopers: state.project.assignedDevelopers,
  assignedTactics: state.project.assignedTactics,
  assignedStrategies: state.project.assignedStrategies
});

export default connect(
  mapStateToProps,
  {
    createProject,
    getDevelopers,
    getTactics,
    getStrategies,
    setAssignedDevelopers,
    setAssignedTactics,
    setAssignedStrategies,
    resetProject,
    addAssignedProjects,
    resetErrors
  }
)(withRouter(CreateProject));
