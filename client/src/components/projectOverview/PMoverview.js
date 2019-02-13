import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import "./PMoverview.css";
import Spinner from "../common/Spinner";
import BtnWithMouseOverPop from "../common/BtnWithMouseOverPop";
import ProjectFeed from "../projectOverview/ProjectFeed";
import {
  getProjects,
  getProject,
  resetProject
} from "../../actions/projectActions";
import { getDevelopers } from "../../actions/userActions";
import { Badge, Grid, PageHeader } from "react-bootstrap";

class PMoverview extends Component {
  componentDidMount() {
    // A credential check, DPO can't visit project overview
    if (this.props.auth.user.role === "Data Protection Officer") {
      this.props.history.push("/Overview");
      alert("You don't have the permission to see projects!");
    }
    this.props.getProjects();

    // this resets all temporary redux variables
    this.props.resetProject();
  }

  render() {
    const { projects, loading } = this.props.project;

    // sort the projects alphabetically
    projects.sort(function(a, b) {
      var nameA = a.name.toUpperCase(); // ignore upper and lowercase
      var nameB = b.name.toUpperCase(); // ignore upper and lowercase
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }

      return 0;
    });

    let projectContent;

    if (projects === null || loading) {
      projectContent = <Spinner />; // show spinner until projects are loaded
    } else {
      if (this.props.auth.user.role !== "Developer") {
        projectContent = <ProjectFeed projects={projects} />; // if role is not Developer show all projects
      } else {
        var devProjects = [];
        projects.map(project => {
          var projDev = [];

          //temporary array for id check
          for (var i = 0; i < project.assignedDevelopers.length; i++) {
            projDev.push(project.assignedDevelopers[i]._id);
          }

          //check wheather logged in user is part of assigned developer, if yes, push to array
          if (projDev.indexOf(this.props.auth.user.id) !== -1) {
            devProjects.push(project);
          }

          // if Developer, show only assigned projects
          projectContent = <ProjectFeed projects={devProjects} />;
        });
      }
    }

    return (
      <div>
        <PageHeader>
          Project Overview{" "}
          <Badge>
            {/* Badge shows according to role the counted projects */}
            {this.props.auth.user.role === "Project Manager"
              ? projects.length
              : devProjects
              ? devProjects.length
              : ""}{" "}
          </Badge>{" "}
          {/* Only the Project Manager can create projects */}
          {this.props.auth.user.role === "Project Manager" ? (
            <BtnWithMouseOverPop
              icon="fas fa-plus"
              title="Add new project"
              link="/create-project"
            />
          ) : (
            ""
          )}
          {/* everyone can update the projects */}
          <BtnWithMouseOverPop
            className="updateButton"
            icon="fas fa-sync"
            title="Update projects"
            link="#"
            onClick={() => this.props.getProjects()}
          />
        </PageHeader>

        {/* Here will be shown the defined projectContent from above */}
        <Grid>{projectContent}</Grid>
      </div>
    );
  }
}

PMoverview.propTypes = {
  getProjects: PropTypes.func.isRequired,
  project: PropTypes.object.isRequired,
  getDevelopers: PropTypes.func.isRequired,
  resetProject: PropTypes.func.isRequired,
  developer: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  project: state.project,
  developer: state.user.developer,
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { getProjects, getDevelopers, resetProject, getProject }
)(PMoverview);
