import React, { Component } from "react";
import PropTypes from "prop-types";
import ProjectItem from "./ProjectItem";
import { Panel, Col, Tabs, Row, Tab, Button, Collapse } from "react-bootstrap";

class ProjectFeed extends Component {
  render() {
    const { projects } = this.props;

    return (
      <Col xs={11}>
        {projects.map(project => (
          <ProjectItem key={project._id} project={project} />
        ))}
      </Col>
    );
  }
}

ProjectFeed.propTypes = {
  projects: PropTypes.array.isRequired
};

export default ProjectFeed;
