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

    this.state = {
      open: false
    };
  }
  extendMore = () => {
    this.setState({ open: !this.state.open });
  };

  render() {
    var tactics = this.props.project.assignedStrategiesWithAllTactics;

    function aggrTac() {
      var arr = [];

      tactics.map(strategies =>
        strategies.assignedTactics.map(tactic => (arr = arr.concat(tactic)))
      );

      return arr;
    }

    const { project, auth } = this.props;
    const open = this.state.open;
    let more;
    let descriptionFirstPart = project.description.split(" ", 10).join(" ");
    let descriptionSecondPart = project.description.substring(
      descriptionFirstPart.length
    );
    if (open) {
      more = <p>Less...</p>;
    } else {
      more = <p>More...</p>;
    }

    const panelHeight = classnames("", { PanelHeight: open == false });

    // className={classnames('form-control form-control-lg', {
    //  'is-invalid': error
    //})}

    var finished =
      project.assignedTactics.length === project.finishedTactics.length;

    return (
      <Col xs={4}>
        <Panel
          className={panelHeight}
          bsStyle={finished ? "success" : undefined}
        >
          <Panel.Heading>
            <Link to={`/project/${project._id}`}>
              <h4 className={!finished ? "heading" : ""}>{project.name}</h4>
            </Link>
          </Panel.Heading>
          <Panel.Body className="shownText">
            <h4>Description</h4>
            {descriptionFirstPart}

            <Collapse in={this.state.open}>
              <div>{descriptionSecondPart}</div>
            </Collapse>
            <div className="extendMore" onClick={this.extendMore}>
              {more}
            </div>
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
