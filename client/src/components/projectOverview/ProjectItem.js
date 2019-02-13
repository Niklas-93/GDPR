import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { Panel, Col, Tabs, Row, Tab, Button, Collapse } from "react-bootstrap";
import classnames from "classnames";

import { getProject } from "../../actions/projectActions";

import "./ProjectItem.css";

class ProjectItem extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {};
  }

  render() {
    const { project, auth } = this.props;

    let descriptionFirstPart = project.description.split(" ", 30).join(" ");

    var finished =
      project.assignedTactics.length === project.finishedTactics.length;

    return (
      <Col xs={4}>
        <Panel
          className="PanelHeight"
          bsStyle={finished ? "success" : undefined}
        >
          <Panel.Heading>
            <Link to={`/project/${project._id}`}>
              <h4 className={!finished ? "heading" : ""}>{project.name}</h4>
            </Link>
          </Panel.Heading>
          <Panel.Body className="shownText">
            {descriptionFirstPart}
            <span> ...</span>
          </Panel.Body>
        </Panel>
      </Col>
    );
  }
}

ProjectItem.propTypes = {
  project: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  getProject: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { getProject }
)(ProjectItem);
