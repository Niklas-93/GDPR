import React, { Component } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import Spinner from "../common/Spinner";
import { Col, Modal } from "react-bootstrap";
import {
  setAssignedTactics,
  setAssignedStrategies,
  clearChosenTactics,
  createPattern
} from "../../actions/patternActions";
import TextAreaField from "../common/TextAreaField";
import TextField from "../common/TextField";
import { getStrategies } from "../../actions/strategyActions";
import { Button, Panel, Tab, Tabs } from "react-bootstrap";
import StrategyFeed from "../patternOverview/StrategyFeed";

class CreatePattern extends Component {
  constructor() {
    super();
    // set all pattern fields initially to empty strings
    this.state = {
      summary: "",
      name: "",
      context: "",
      problem: "",
      forcestactics: "",
      solution: "",
      structure: "",
      implementation: "",
      consequences: "",
      constraints: "",
      benefits: "",
      liabilities: "",
      examples: "",
      relatedPatterns: "",
      sources: "",
      knownUses: "",
      assignedTactics: [],
      assignedStrategies: [],
      errors: {},
      activeKey: 1,
      showWarningModal: false
    };
    // bind functions
    this.onChange = this.onChange.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
  }

  componentDidMount() {
    // get strategies for Selection
    this.props.getStrategies();
    // clear tactics if component is called for more than one time / more than one new pattern
    this.props.clearChosenTactics();
  }

  // if server sends errors
  componentWillReceiveProps(nextProps) {
    if (Object.keys(nextProps.errors) != 0) {
      this.setState({ errors: nextProps.errors });
      if (nextProps.errors.patternAlreadyExists) {
        this.setState({ showWarningModal: true });
      } else if (nextProps.errors.assignedTactics) {
        this.setState({ activeKey: 2 });
      } else {
        this.setState({ activeKey: 1 });
      }
    }
  }

  //handles change of input fields
  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  // create a new pattern
  createPattern = () => {
    const newPattern = {
      name: this.state.name,
      summary: this.state.summary,
      context: this.state.context,
      problem: this.state.problem,
      solution: this.state.solution,
      consequences: this.state.consequences,
      constraints: this.state.constraints,
      benefits: this.state.benefits,
      liabilities: this.state.liabilities,
      examples: this.state.examples,
      knownUses: this.state.knownUses,
      relatedPatterns: this.state.relatedPatterns,
      sources: this.state.sources,
      assignedTactics: this.props.pattern.chosenTactics
    };
    this.props.createPattern(newPattern, this.props.history);
  };

  // checks if fields are empty, sets errors
  setErrorIfEmpty = textField => {
    if (this.state[textField] == "") {
      this.setState({
        errors: {
          ...this.state.errors,
          [textField]: textField + " is required!"
        }
      });
    } else {
      this.setState({
        errors: {
          ...this.state.errors,
          [textField]: undefined
        }
      });
    }
  };

  // executed when trying to go to next tab
  handleSelect = activeKey => {
    // check if fields are empty, set corresponding errors
    setTimeout(() => {
      this.setErrorIfEmpty("name");
      this.setErrorIfEmpty("summary");
      this.setErrorIfEmpty("context");
      this.setErrorIfEmpty("problem");
      this.setErrorIfEmpty("solution");
    }, 10);

    // if all fields are set, go to next tab
    if (
      this.state.name != "" &&
      this.state.summary != "" &&
      this.state.context != "" &&
      this.state.problem != "" &&
      this.state.solution != ""
    ) {
      this.setState({ activeKey });
    }
    // this.setState({ activeKey });
  };

  render() {
    //get strategies from server, display spinner while waiting
    const { strategies, loading3 } = this.props.strategy;
    let strategyContent;
    if (strategies === null || loading3) {
      strategyContent = <Spinner />;
    } else {
      strategyContent = (
        <StrategyFeed strategies={strategies} isFilter={false} />
      );
    }

    const { errors } = this.state;
    // set initial state of seeing other tabs (strategies/additionals) to false
    var seeStrategies = false;
    var seeAdditionals = false;
    // check if required fields are set, if yes, show strategy tab
    if (
      this.state.name != "" &&
      this.state.summary != "" &&
      this.state.context != "" &&
      this.state.problem != "" &&
      this.state.solution != ""
    ) {
      seeStrategies = true;
    }
    // check if at least one tactic is set, if yes, show additionals tab
    if (this.props.pattern.chosenTactics.length != 0) {
      seeAdditionals = true;
    }
    return (
      <form>
        <Panel>
          <Tabs
            defaultActiveKey={1}
            activeKey={this.state.activeKey}
            onSelect={this.handleSelect}
            id="Select-View"
          >
            <Tab eventKey={1} title="1. Basic Information">
              <TextField
                label="Name of pattern*"
                name="name"
                value={this.state.name}
                placeholder="Enter the name of the pattern"
                onChange={this.onChange}
                error={errors.name}
                onBlur={this.onChange}
                className={"patternName"}
              />
              <TextAreaField
                label="Summary*"
                name="summary"
                value={this.state.summary}
                placeholder="Enter Summary"
                onChange={this.onChange}
                error={errors.summary}
                onBlur={this.onChange}
                className={"patternTextarea"}
              />
              <TextAreaField
                label="Context*"
                name="context"
                value={this.state.context}
                placeholder="Enter Context"
                onChange={this.onChange}
                error={errors.context}
                onBlur={this.onChange}
                className={"patternTextarea"}
              />
              <TextAreaField
                label="Problem*"
                name="problem"
                value={this.state.problem}
                placeholder="Enter Problem"
                onChange={this.onChange}
                error={errors.problem}
                onBlur={this.onChange}
                className={"patternTextarea"}
              />
              <TextAreaField
                label="Solution*"
                name="solution"
                value={this.state.solution}
                placeholder="Enter Solution"
                onChange={this.onChange}
                error={errors.solution}
                onBlur={this.onChange}
                className={"patternTextarea"}
              />{" "}
              <Col xs={12}>
                <span style={{ color: "#a9a9a9" }}>* fields are required</span>
              </Col>
              <Button
                className={"col-xs-6 dismiss-button"}
                onClick={() => this.props.history.push("/overview")}
              >
                Cancel
              </Button>
              <Button
                bsStyle="primary"
                className={"col-xs-6"}
                onClick={() => this.handleSelect(2)}
              >
                Set assigned Strategies
              </Button>
            </Tab>
            {seeStrategies ? (
              <Tab eventKey={2} title="2. Assigned Strategies">
                {" "}
                <br />
                <br />
                {strategyContent} <br />
                <br />
                {seeAdditionals ? (
                  <span>
                    <Button
                      className={"col-xs-6 dismiss-button"}
                      onClick={() => this.props.history.push("/overview")}
                    >
                      Cancel
                    </Button>
                    <Button
                      className={"col-xs-6"}
                      bsStyle="primary"
                      onClick={() => this.handleSelect(3)}
                    >
                      Set additional Information
                    </Button>
                  </span>
                ) : (
                  <span>
                    <div style={{ fontWeight: "bold", color: "red" }}>
                      At least one tactic must be chosen!
                    </div>
                    <Button
                      className={"col-xs-6 dismiss-button"}
                      onClick={() => this.props.history.push("/overview")}
                    >
                      Cancel
                    </Button>
                    <Button
                      className={"col-xs-6"}
                      bsStyle="primary"
                      onClick={() => this.handleSelect(3)}
                      disabled
                    >
                      Set additional Information
                    </Button>
                  </span>
                )}
              </Tab>
            ) : (
              <Tab eventKey={2} title="2. Assigned Strategies" disabled />
            )}
            {seeAdditionals ? (
              <Tab eventKey={3} title="3. Additional Information">
                <TextAreaField
                  label="Consequences"
                  name="consequences"
                  value={this.state.consequences}
                  placeholder="Enter Consequences"
                  onChange={this.onChange}
                  className={"patternTextarea"}
                />
                <TextAreaField
                  label="Constraints"
                  name="constraints"
                  value={this.state.constraints}
                  placeholder="Enter Constraints"
                  onChange={this.onChange}
                  className={"patternTextarea"}
                />
                <TextAreaField
                  label="Benefits"
                  name="benefits"
                  value={this.state.benefits}
                  placeholder="Enter Benefits"
                  onChange={this.onChange}
                  className={"patternTextarea"}
                />
                <TextAreaField
                  label="Liabilities"
                  name="liabilities"
                  value={this.state.liabilities}
                  placeholder="Enter Liabilities"
                  onChange={this.onChange}
                  className={"patternTextarea"}
                />

                <TextAreaField
                  label="Examples"
                  name="examples"
                  value={this.state.examples}
                  placeholder="Enter Examples"
                  onChange={this.onChange}
                  className={"patternTextarea"}
                  error={errors.examples}
                />
                <TextAreaField
                  label="Known Uses"
                  name="knownUses"
                  value={this.state.knownUses}
                  placeholder="Enter known Uses"
                  onChange={this.onChange}
                  className={"patternTextarea"}
                />
                <TextAreaField
                  label="Related Patterns"
                  name="relatedPatterns"
                  value={this.state.relatedPatterns}
                  placeholder="Enter related Patterns"
                  onChange={this.onChange}
                  className={"patternTextarea"}
                />
                <TextAreaField
                  label="Sources"
                  name="sources"
                  value={this.state.sources}
                  placeholder="Enter Sources"
                  onChange={this.onChange}
                  className={"patternTextarea"}
                />
                <Button
                  className={"col-xs-6 dismiss-button"}
                  onClick={() => this.props.history.push("/overview")}
                >
                  Cancel
                </Button>
                <Button
                  bsStyle="primary"
                  className={"col-xs-6"}
                  onClick={this.createPattern}
                >
                  Create Pattern
                </Button>
              </Tab>
            ) : (
              <Tab eventKey={3} title="3. Additional Information" disabled />
            )}
          </Tabs>
        </Panel>
        <div className="static-modal">
          <Modal show={this.state.showWarningModal}>
            <Modal.Header>
              <Modal.Title>Error</Modal.Title>
            </Modal.Header>
            <Modal.Body>{this.state.errors.patternAlreadyExists}</Modal.Body>
            <Modal.Footer>
              <Col xs={12}>
                <Button
                  bsStyle="danger"
                  className={"col-xs-12"}
                  onClick={() =>
                    this.setState({ showWarningModal: false, activeKey: 1 })
                  }
                >
                  Confirm <i className={"glyphicon glyphicon-ok"} />
                </Button>
              </Col>
            </Modal.Footer>
          </Modal>
        </div>
      </form>
    );
  }
}

//Definition of required props, improves Debugging
CreatePattern.propTypes = {
  createPattern: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  setAssignedTactics: PropTypes.func.isRequired,
  setAssignedStrategies: PropTypes.func.isRequired,
  getStrategies: PropTypes.func.isRequired
};

//Definition of needed props in Component
const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors,
  assignedTactics: state.pattern.assignedTactics,
  assignedStrategies: state.pattern.assignedStrategies,
  strategies: state.strategy.strategies,
  pattern: state.pattern,
  strategy: state.strategy
});

//Definition of used functions/states in Component, that interact with Store
export default connect(
  mapStateToProps,
  {
    createPattern,
    getStrategies,
    setAssignedStrategies,
    setAssignedTactics,
    clearChosenTactics
  }
)(withRouter(CreatePattern));
