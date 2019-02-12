import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import "./PMoverview.css";
import { Link } from "react-router-dom";
import Spinner from "../common/Spinner";
import BtnWithMouseOverPop from "../common/BtnWithMouseOverPop";
import ProjectFeed from "../overview/ProjectFeed";
import {
  getProjects,
  getProject,
  resetAssignedStrategies
} from "../../actions/projectActions";
import { getDevelopers } from "../../actions/userActions";
import {
  Popover,
  Badge,
  OverlayTrigger,
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

    projects.sort(function(a, b) {
      var nameA = a.name.toUpperCase(); // ignore upper and lowercase
      var nameB = b.name.toUpperCase(); // ignore upper and lowercase
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }

      // namen müssen gleich sein
      return 0;
    });

    projects.sort(function(a, b) {
      var nameA = (
        a.assignedTactics.length - a.finishedTactics.length
      ).toString(); //
      var nameB = (
        b.assignedTactics.length - b.finishedTactics.length
      ).toString();

      if (nameA < nameB) {
        return 1;
      }
      if (nameA > nameB) {
        return -1;
      }

      return 0;
    });

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
          <Badge>
            {this.props.auth.user.role === "Project Manager"
              ? projects.length
              : devProjects.length}{" "}
          </Badge>{" "}
          {this.props.auth.user.role === "Project Manager" ? (
            <BtnWithMouseOverPop
              icon="fas fa-plus"
              title="Add new project"
              link="/create-project"
            />
          ) : (
            ""
          )}
          <BtnWithMouseOverPop
            className="updateButton"
            icon="fas fa-sync"
            title="Update projects"
            link="#"
            onClick={() => this.props.getProjects()}
          />
        </PageHeader>
        <Grid>{projectContent}</Grid>
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
