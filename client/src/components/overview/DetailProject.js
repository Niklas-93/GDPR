import axios from "axios";
import React, { Component } from "react";
import { Panel, Row, Col, Button, ProgressBar } from "react-bootstrap";
import { withRouter, Link } from "react-router-dom";
import { connect } from "react-redux";
import {
  getProject,
  setFinishedTactic,
  switchAttrForEditProject,
  deleteProject,
  removeAssignedProjects
} from "../../actions/projectActions";
import { getDevelopers } from "../../actions/userActions";
import ModalProject from "../common/ModalProject";
import PropTypes from "prop-types";
import store from "../../store";

import BtnWithMouseOverPop from "../common/BtnWithMouseOverPop";
import Spinner from "../common/Spinner";
import CommentBox from "../common/CommentBox";

import "./DetailProject.css";

class DetailProject extends Component {
  constructor() {
    super();
    this.state = {
      project: {},
      assignedDevelopers: [],
      finishedTactic: "",
      default: true,
      finishedTactics: [],
      progress: "",
      done: [],

      errors: {}
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.onClickDelete = this.onClickDelete.bind(this);
    this.handleChecked = this.handleChecked.bind(this);
    this.createDoneArray = this.createDoneArray.bind(this);
    this.updateProject = this.updateProject.bind(this);
  }

  componentDidMount() {
    this.props.getDevelopers();
    this.props.getProject(this.props.match.params.id);

    this.createDoneArray();
    this.setState({ default: false });
  }

  //for realtime chat activate
  componentWillUpdate() {
    /*setTimeout(() => {
      this.props.getProject(this.props.match.params.id);
      this.props.switchAttrForEditProject();
    }, 5000);*/
  }

  updateProject() {
    this.props.getProject(this.props.match.params.id);
  }

  onClickDelete(id) {
    this.props.deleteProject(id);
    this.props.removeAssignedProjects(this.props.project);
  }

  createDoneArray() {
    var doneArr = [];

    if (this.props.project.assignedStrategiesWithAllTactics) {
      var tactics = this.props.project.assignedStrategiesWithAllTactics;
    }
    var tacticsArr = [];

    if (tactics != undefined) {
      tactics.map(strategies =>
        strategies.assignedTactics.map(
          tactic => (tacticsArr = tacticsArr.concat(tactic))
        )
      );
    }

    var finishedTacticsArray = this.props.finishedTactics;

    if (tactics != undefined && finishedTacticsArray != undefined) {
      for (var i = 0; i < tacticsArr.length; i++) {
        if (finishedTacticsArray.indexOf(tacticsArr[i].name) === -1) {
          doneArr.push({ name: tacticsArr[i].name, done: false });
        } else {
          doneArr.push({ name: tacticsArr[i].name, done: true });
        }
      }
    }

    return doneArr;
  }

  handleInputChange(e) {
    //e.preventDefault();

    const finishedTacticData = {
      id: this.props.match.params.id,
      finishedTactic: e.target.name,
      finishedTactics: store.getState().project.finishedTactics
    };

    this.props.setFinishedTactic(finishedTacticData);
  }

  handleChecked(tac, i) {
    //console.log(tac);
    var finTac = this.props.project.finishedTactics;

    if (this.state.default) {
      if (finTac.indexOf(tac.name) === -1) {
        return false;
      } else {
        return true;
      }
    } else {
      return this.createDoneArray()[i].done;
    }
  }

  render() {
    let projectContent;

    if (this.props.project.assignedStrategiesWithAllTactics) {
      var tactics = this.props.project.assignedStrategiesWithAllTactics;
      tactics.sort(function(a, b) {
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
    }

    function aggrTac() {
      var arr = [];

      if (tactics != undefined) {
        tactics.map(strategies =>
          strategies.assignedTactics.map(tactic => (arr = arr.concat(tactic)))
        );
      }

      return arr;
    }

    var finishedTacticsArray = this.props.finishedTactics;

    function doneTacticArray() {
      var tempArr = [];

      for (var i = 0; i < aggrTac().length; i++) {
        tempArr.push(aggrTac()[i].name);
      }

      if (finishedTacticsArray) {
        for (var i = 0; i < finishedTacticsArray.length; i++) {
          var index = tempArr.indexOf(finishedTacticsArray[i]);

          if (index !== -1) {
            tempArr.splice(index, 1);
          }
        }
      }

      return tempArr;
    }

    var progress = 0;
    var finTac = this.props.finishedTactics;
    var allTac = this.props.project.assignedTactics;

    if (this.props.finishedTactics && this.props.project.assignedTactics) {
      progress = (finTac.length * 100) / allTac.length;
    }

    var counter = -1;

    function getMaxAssignedTacticsForHeight() {
      var max = 0;
      if (tactics) {
        for (var i = 0; i < tactics.length; i++) {
          if (tactics[i].assignedTactics.length > max) {
            max = tactics[i].assignedTactics.length;
          }
        }
      }
      if (max < 4) {
        max = 3.5;
      }
      return max;
    }

    if (this.props.project === null || this.props.loading) {
      projectContent = <Spinner />;
    } else {
      projectContent = (
        <div>
          <Panel>
            <Panel.Heading>
              <Panel.Title componentClass="h1">
                {this.props.project.name}
              </Panel.Title>
            </Panel.Heading>
            <Panel.Body>
              <Row>
                <Col md={12}>
                  <Panel>
                    <Panel.Heading>
                      <Panel.Title componentClass="h4">Description</Panel.Title>
                    </Panel.Heading>
                    <Panel.Body className="shownText">
                      {this.props.project.description}
                    </Panel.Body>
                  </Panel>
                </Col>
                <Col md={3}>
                  <Panel>
                    <Panel.Heading>
                      <Panel.Title componentClass="h4">
                        Assigned Developer
                      </Panel.Title>
                    </Panel.Heading>
                    <Panel.Body>
                      {this.props.project.assignedDevelopers
                        ? this.props.project.assignedDevelopers.map(dev => (
                            <div key={dev._id}>{dev.name}</div>
                          ))
                        : ""}
                    </Panel.Body>
                  </Panel>
                </Col>
                <Col md={9}>
                  <Panel>
                    <Panel.Heading>
                      <Panel.Title componentClass="h4">
                        Assigned Strategies and tactics{" "}
                        <BtnWithMouseOverPop
                          onClick={() => this.updateProject()}
                          icon="fas fa-sync"
                          title="update tactics"
                        />
                      </Panel.Title>
                    </Panel.Heading>
                    <Panel.Body>
                      <form>
                        {tactics
                          ? tactics.map(str => (
                              <Col key={str._id} md={3}>
                                <Panel
                                  className="strategyPanel panelBodyTactics"
                                  style={{
                                    height:
                                      getMaxAssignedTacticsForHeight() * 40 +
                                      "px"
                                  }}
                                >
                                  <Panel.Heading>
                                    <Panel.Title componentClass="h4">
                                      {str.name}
                                    </Panel.Title>
                                  </Panel.Heading>

                                  <Panel.Body>
                                    <ul className="ulTac">
                                      <Row>
                                        {str.assignedTactics.map(tac => (
                                          <li id="liTac" key={tac._id}>
                                            <Col md={9}>
                                              <span className="dotForTactic" />
                                              {"  "}

                                              {tac.name}
                                            </Col>
                                            <Col md={3}>
                                              <input
                                                name={tac.name}
                                                type="checkbox"
                                                checked={this.handleChecked(
                                                  tac,
                                                  (counter = counter + 1)
                                                )}
                                                onChange={
                                                  this.handleInputChange
                                                }
                                              />
                                            </Col>
                                          </li>
                                        ))}
                                      </Row>
                                    </ul>
                                  </Panel.Body>
                                </Panel>
                              </Col>
                            ))
                          : ""}
                      </form>
                    </Panel.Body>
                  </Panel>
                </Col>
              </Row>
            </Panel.Body>

            <Link to="/PMoverview">
              <Button bsStyle="primary" className="projectButton">
                Back to Overview
              </Button>
            </Link>

            {this.props.auth.user.role === "Project Manager" ? (
              <span>
                <Link to={`/project/edit-project/${this.props.project._id}`}>
                  <Button bsStyle="primary" className="projectButton">
                    Edit Project
                  </Button>
                </Link>
                <ModalProject
                  onClick={this.onClickDelete}
                  project={this.props.project}
                />{" "}
              </span>
            ) : (
              ""
            )}
          </Panel>

          <Panel>
            <Panel.Heading>
              <Panel.Title componentClass="h4">
                {progress === 0
                  ? "Project haven't started yet"
                  : progress < 100
                  ? "Project is ongoing"
                  : "Project is completed"}
              </Panel.Title>
            </Panel.Heading>
            <Panel.Body>
              <ProgressBar
                striped
                bsStyle={
                  progress < 75
                    ? "danger"
                    : progress < 100
                    ? "warning"
                    : "success"
                }
                label={`${progress.toFixed(0)}%`}
                now={progress}
              />
              <Row>
                <Col md={6} className="doneTasks">
                  <Panel>
                    <Panel.Heading>
                      <Panel.Title componentClass="h4">Done</Panel.Title>
                    </Panel.Heading>
                    <Panel.Body>
                      <ul className="ulTac">
                        {this.props.finishedTactics
                          ? this.props.finishedTactics.map(tac => (
                              <Col md={6} key={tac}>
                                <li key={tac}>
                                  <span className="dotForTactic" /> {tac}
                                </li>
                              </Col>
                            ))
                          : ""}
                      </ul>
                    </Panel.Body>
                  </Panel>
                </Col>

                <Col md={6} className="openTasks">
                  <Panel>
                    <Panel.Heading>
                      <Panel.Title componentClass="h4">Open</Panel.Title>
                    </Panel.Heading>
                    <Panel.Body>
                      <ul className="ulTac">
                        {doneTacticArray().map(tac => (
                          <Col md={6} key={tac}>
                            <li key={tac}>
                              <span className="dotForTactic" /> {tac}
                            </li>
                          </Col>
                        ))}
                      </ul>
                    </Panel.Body>
                  </Panel>
                </Col>
              </Row>
            </Panel.Body>
          </Panel>
          <CommentBox
            project={this.props.project}
            getProject={() => {
              this.updateProject();
            }}
          />
        </div>
      );
    }

    return (
      <div>
        {this.props.project === ""
          ? alert(
              "This project has been deleted, please contact your local project manager"
            )
          : ""}
        {this.props.project === ""
          ? this.props.history.push("/PMoverview")
          : ""}

        {projectContent}
      </div>
    );
  }
}

DetailProject.propTypes = {
  getProject: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  getDevelopers: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  setFinishedTactic: PropTypes.func.isRequired,
  deleteProject: PropTypes.func.isRequired,
  removeAssignedProjects: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors,
  project: state.project.project,
  finishedTactics: state.project.finishedTactics,
  loading: state.project.loading
});

export default connect(
  mapStateToProps,
  {
    getProject,
    getDevelopers,
    setFinishedTactic,
    switchAttrForEditProject,
    deleteProject,
    removeAssignedProjects
  }
)(withRouter(DetailProject));
