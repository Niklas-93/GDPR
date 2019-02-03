import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import "./PMoverview.css";
import { Link } from "react-router-dom";
import Spinner from "../common/Spinner";
import ProjectFeed from "../overview/ProjectFeed";
import {
  getProjects,
  getProject,
  resetAssignedStrategies
} from "../../actions/projectActions";
import { getDevelopers } from "../../actions/userActions";
import {
  Col,
  Thumbnail,
  Grid,
  Row,
  PageHeader,
  Panel,
  ButtonToolbar,
  Button,
  Image
} from "react-bootstrap";
import authReducer from "../../reducers/authReducer";

class PMoverview extends Component {
  componentDidMount() {
    if (this.props.auth.user.role === "Data Protection Officer") {
      this.props.history.push("/Overview");
      alert("You don't have the permission to see projects!");
    }
    this.props.getProjects();
    this.props.getDevelopers();

    if (this.props.project.project._id !== undefined) {
      this.props.getProject(this.props.project.project._id);
    }

    this.props.resetAssignedStrategies();
  }

  render() {
    const { projects, loading } = this.props.project;

    let projectContent;

    if (projects === null || loading) {
      projectContent = <Spinner />;
    } else {
      if (this.props.auth.user.role !== "Developer") {
        projectContent = <ProjectFeed projects={projects} />;
      } else {
        var devProjects = [];
        projects.map(project => {
          var projDev = [];
          for (var i = 0; i < project.assignedDevelopers.length; i++) {
            projDev.push(project.assignedDevelopers[i]._id);
          }

          if (projDev.indexOf(this.props.auth.user.id) !== -1) {
            devProjects.push(project);
          }

          projectContent = <ProjectFeed projects={devProjects} />;
        });
      }
    }

    return (
      <div>
        <PageHeader>
          Project Overview{" "}
          <Button onClick={() => this.props.getProjects()}>
            <i className="fas fa-sync" />
          </Button>{" "}
        </PageHeader>
        <Grid>
          {projectContent}
          {this.props.auth.user.role === "Project Manager" ? (
            <Link to="/create-project">
              <Button bsStyle="primary">Create New Project</Button>
            </Link>
          ) : (
            ""
          )}
        </Grid>
      </div>
    );
  }
}

PMoverview.propTypes = {
  getProjects: PropTypes.func.isRequired,
  project: PropTypes.object.isRequired,
  getDevelopers: PropTypes.func.isRequired,
  resetAssignedStrategies: PropTypes.func.isRequired,
  developer: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  project: state.project,
  developer: state.user.developer,
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { getProjects, getDevelopers, resetAssignedStrategies, getProject }
)(PMoverview);
