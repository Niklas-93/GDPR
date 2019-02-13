import React, { Component } from "react";
import PropTypes from "prop-types";
import { withRouter, Link } from "react-router-dom";
import { connect } from "react-redux";

import Spinner from "../common/Spinner";
import {
  editProject,
  setAssignedDevelopers,
  setAssignedTactics,
  setAssignedStrategies,
  resetProject,
  getProject,
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

class EditProject extends Component {
  constructor() {
    super();
    this.state = {
      // get all data from the store from the current project which will be edited
      description: store.getState().project.project.description,
      name: store.getState().project.project.name,
      assignedStrategies: [],
      assignedTactics: [],
      finished: false,
      assignedDevelopers: [],
      finishedTactic: store.getState().project.project.finishedTactic,
      developers: [],

      errors: {}
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    this.props.getProject(this.props.match.params.id);
    this.props.getDevelopers();
    this.props.getStrategies();
    this.props.resetErrors();
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  // here the data will be send and updated in the database
  onSubmit(e) {
    e.preventDefault();

    const editedProject = {
      id: this.props.match.params.id,
      name: this.state.name,
      description: this.state.description,
      assignedTactics: store.getState().project.assignedTactics,
      assignedStrategies: store.getState().project.assignedStrategies,
      assignedDevelopers: store.getState().project.assignedDevelopers,
      finished: this.state.finished,
      allDevelopers: store.getState().user.developers,
      finishedTactic: this.state.finishedTactic
    };

    this.props.editProject(editedProject, this.props.history);
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
        // the select strategy field will be created
        <StrListGroupField
          strategies={this.props.strategies}
          location={this.props.location}
        />
      );
    }

    return (
      <form onSubmit={this.onSubmit}>
        <span>
          <TextField
            label="Name of project"
            name="name"
            value={this.state.name}
            placeholder={store.getState().project.project.name}
            onChange={this.onChange}
            error={this.props.errors.name}
          />

          <TextAreaField
            label="Description"
            name="description"
            value={this.state.description}
            placeholder={store.getState().project.project.description}
            onChange={this.onChange}
            error={this.props.errors.description}
          />

          <Row className="show-grid">
            <Col md={3}>
              <h4>Choose your strategies</h4>
              {strategyContent}
              {this.props.errors.assignedStrategy
                ? this.props.errors.assignedStrategy
                : ""}
            </Col>
            <Col md={3}>
              {" "}
              <h4>and the according tactics</h4>
              {tacticContent}
              {this.props.errors.assignedTactic &&
              !this.props.errors.assignedStrategy
                ? this.props.errors.assignedTactic
                : ""}
            </Col>

            <Col md={6}>
              <h4>Choose your developer</h4>
              {developerContent}
              {this.props.errors.assignedDevelopers
                ? this.props.errors.assignedDevelopers
                : ""}
            </Col>
          </Row>
        </span>

        <Button
          bsStyle="primary"
          className="projectButton"
          onClick={this.onSubmit}
        >
          Save changes
        </Button>

        <Link
          to={`/project/${this.props.location.pathname.substr(
            this.props.location.pathname.length - 24
          )}`}
        >
          <Button bsStyle="info" className="projectButton">
            Stop editing and discard changes{" "}
          </Button>
        </Link>
      </form>
    );
  }
}

EditProject.propTypes = {
  editProject: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  getDevelopers: PropTypes.func.isRequired,
  getTactics: PropTypes.func.isRequired,
  getStrategies: PropTypes.func.isRequired,
  setAssignedDevelopers: PropTypes.func.isRequired,
  setAssignedTactics: PropTypes.func.isRequired,
  setAssignedStrategies: PropTypes.func.isRequired,
  resetProject: PropTypes.func.isRequired
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
    editProject,
    getDevelopers,
    getTactics,
    getStrategies,
    setAssignedDevelopers,
    setAssignedTactics,
    setAssignedStrategies,
    resetProject,
    getProject,
    resetErrors
  }
)(withRouter(EditProject));
