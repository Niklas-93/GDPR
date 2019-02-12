import React, { Component } from "react";
import { connect } from "react-redux";
import isEmpty from "../../validation/is-empty";
import {
  getPattern,
  editPattern,
  createPattern,
  handleEditing,
  setEditingToFalse
} from "../../actions/patternActions";
import TextAreaField from "../common/TextAreaField";
import TextField from "../common/TextField";
import EditToolbar from "../common/EditToolbar";
import Spinner from "../common/Spinner";
import PatternDetail_StrategiesWithTactics from "./PatternDetail_StrategiesWithTactics";
import { Button, Col, Panel, Tabs, Tab } from "react-bootstrap";
import StrategyFeed from "../patternOverview/StrategyFeed";
import { getStrategies } from "../../actions/strategyActions";

class PatternDetail extends Component {
  constructor(props) {
    super(props);
    // set initial data
    this.state = {
      pattern: {},
      errors: {},
      editing: false,
      assignedStrategiesWithAllTactics: [],
      actualID: "",
      activeKey: 1
    };
    // bind functions
    this.handleSelect = this.handleSelect.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onChangePattern = this.onChangePattern.bind(this);
  }
  componentDidMount() {
    // get initial props
    this.props.getPattern(this.props.match.params._id);
    this.props.getStrategies();
    this.props.setEditingToFalse();
  }

  // if server sends errors
  componentWillReceiveProps(nextProps) {
    console.log("nextprops");
    console.log(nextProps);
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

  onChangePattern(e) {
    // handles changes of the input fields while editing
    this.setState({
      pattern: {
        ...this.state.pattern,
        [e.target.name]: e.target.value
      }
    });
  }
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
      this.state.pattern.name != "" &&
      this.state.pattern.summary != "" &&
      this.state.pattern.context != "" &&
      this.state.pattern.problem != "" &&
      this.state.pattern.solution != ""
    ) {
      this.setState({ activeKey });
    }
  };

  // checks if fields are empty, sets errors
  setErrorIfEmpty = textField => {
    if (this.state.pattern[textField] == "") {
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
  // Delete element from pattern
  removeElement = element => {
    this.setState({
      pattern: {
        ...this.state.pattern,
        [element]: undefined
      }
    });
  };

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }
  // on confirmation of changes of pattern
  editPattern = () => {
    const editedPattern = this.state.pattern;
    editedPattern.assignedTactics = this.props.pattern.chosenTactics;
    this.props.editPattern(editedPattern);
    this.handleEditing();
  };

  // handle the edit mode of the pattern => active/passive
  handleEditing = () => {
    this.setState({
      pattern: this.props.pattern.pattern,
      activeKey: 1
    });
    this.props.handleEditing();
  };

  //checks if property of pattern is empty
  isEmpty(patternProperty) {
    if ((patternProperty = "")) {
      return true;
    } else {
      return false;
    }
  }

  render() {
    // get basic props
    const { errors } = this.state;
    const { isDataProtectionOfficer } = this.props.auth;
    const { pattern, loading, editPattern } = this.props.pattern;
    let patternContent;

    //check if pattern-props are loaded, otherwise show spinner
    if (pattern === null || loading || Object.keys(pattern).length === 0) {
      patternContent = <Spinner />;
    } else {
      const detailPattern = pattern.pattern;
      const { strategies, loading3 } = this.props.strategy;
      let strategyContent;

      //check if strategy-props are loaded, otherwise show spinner
      if (strategies === null || loading3) {
        strategyContent = <Spinner />;
      } else {
        strategyContent = (
          <StrategyFeed strategies={strategies} isFilter={false} />
        );
      }
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
      // Define patternContent dependent on Role (Guest/DPO) and editMode
      patternContent = (
        <div style={{ marginBottom: "70px" }}>
          {!editPattern ? (
            <Panel>
              <Panel.Heading className="minHeightPatternPanelHeadingDetail">
                <Panel.Title>
                  <Col xs={6}>
                    <span className={"h3"}>{pattern.name}</span>
                  </Col>
                  <Col xs={6}>
                    {isDataProtectionOfficer ? (
                      <EditToolbar
                        name={pattern.name}
                        _id={this.props.match.params._id}
                        enableEditing={() => this.handleEditing()}
                      />
                    ) : (
                      <Col xs={6} />
                    )}
                  </Col>
                </Panel.Title>
              </Panel.Heading>
              <Panel.Body>
                <Col xs={12}>
                  {
                    <PatternDetail_StrategiesWithTactics
                      assignedStrategiesWithAllTactics={
                        pattern.assignedStrategiesWithAllTactics
                      }
                    />
                  }
                  {isEmpty(pattern.alsoKnownAs) ? (
                    <span />
                  ) : (
                    <span>
                      <h4>Also Known As</h4>
                      <div>{pattern.alsoKnownAs}</div>
                    </span>
                  )}
                  <h4>Summary</h4>
                  <div>{pattern.summary}</div>
                  <h4>Context</h4>
                  <div>{pattern.context}</div>
                  <h4>Problem</h4>
                  <div>{pattern.problem}</div>
                  <h4>Solution</h4>
                  <div>{pattern.solution}</div>
                  {isEmpty(pattern.consequences) ? (
                    <span />
                  ) : (
                    <span>
                      <h4>Consequences</h4>
                      <div>{pattern.consequences}</div>
                    </span>
                  )}
                  {isEmpty(pattern.constraints) ? (
                    <span />
                  ) : (
                    <span>
                      <h4>Constraints</h4>
                      <div>{pattern.constraints}</div>
                    </span>
                  )}
                  {isEmpty(pattern.benefits) ? (
                    <span />
                  ) : (
                    <span>
                      <h4>Benefits</h4>
                      <div>{pattern.benefits}</div>
                    </span>
                  )}
                  {isEmpty(pattern.liabilities) ? (
                    <span />
                  ) : (
                    <span>
                      <h4>Liabilities</h4>
                      <div>{pattern.liabilities}</div>
                    </span>
                  )}
                  {isEmpty(pattern.examples) ? (
                    <span />
                  ) : (
                    <span>
                      <h4>Examples</h4>
                      <div>{pattern.examples}</div>
                    </span>
                  )}
                  {isEmpty(pattern.knownUses) ? (
                    <span />
                  ) : (
                    <span>
                      <h4>Known Uses</h4>
                      <div>{pattern.knownUses}</div>
                    </span>
                  )}
                  {isEmpty(pattern.relatedPatterns) ? (
                    <span />
                  ) : (
                    <span>
                      <h4>related Patterns</h4>
                      <div>{pattern.relatedPatterns}</div>
                    </span>
                  )}
                  {isEmpty(pattern.sources) ? (
                    <span />
                  ) : (
                    <span>
                      <h4>Sources</h4>
                      <div>{pattern.sources}</div>
                    </span>
                  )}
                  <br />
                  <br />
                  <Button
                    className={"col-xs-12 dismiss-button"}
                    onClick={() => this.props.history.push("/overview")}
                  >
                    Go back to Overview...
                  </Button>
                </Col>
              </Panel.Body>
            </Panel>
          ) : (
            <div>
              <Panel>
                <Tabs
                  defaultActiveKey={1}
                  activeKey={this.state.activeKey}
                  onSelect={this.handleSelect}
                  id="Select-View"
                  //onSelect={() => this.handleSelect()}
                >
                  <Tab eventKey={1} title="1. Basic Information">
                    <TextField
                      label="Name of pattern*"
                      name="name"
                      value={this.state.pattern.name}
                      placeholder="Enter the name of the pattern"
                      onChange={this.onChangePattern}
                      error={errors.name}
                      className={"patternName"}
                    />

                    <TextAreaField
                      label="Summary*"
                      name="summary"
                      value={this.state.pattern.summary}
                      placeholder="Enter Summary"
                      onChange={this.onChangePattern}
                      error={errors.summary}
                      className={"patternTextarea"}
                    />
                    <TextAreaField
                      label="Context*"
                      name="context"
                      value={this.state.pattern.context}
                      placeholder="Enter Context"
                      onChange={this.onChangePattern}
                      error={errors.context}
                      className={"patternTextarea"}
                    />
                    <TextAreaField
                      label="Problem*"
                      name="problem"
                      value={this.state.pattern.problem}
                      placeholder="Enter Problem"
                      onChange={this.onChangePattern}
                      error={errors.problem}
                      className={"patternTextarea"}
                    />
                    <TextAreaField
                      label="Solution*"
                      name="solution"
                      value={this.state.pattern.solution}
                      placeholder="Enter Solution"
                      onChange={this.onChangePattern}
                      error={errors.solution}
                      className={"patternTextarea"}
                    />
                    <Col xs={12}>
                      <span style={{ color: "#a9a9a9" }}>
                        * fields are required
                      </span>
                    </Col>
                    <Button
                      className={"col-xs-6 dismiss-button"}
                      onClick={this.handleEditing}
                    >
                      Dismiss Changes
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
                            onClick={this.handleEditing}
                          >
                            Dismiss Changes
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
                            onClick={this.handleEditing}
                          >
                            Dismiss Changes
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
                        value={this.state.pattern.consequences}
                        placeholder="Enter Consequences"
                        onChange={this.onChangePattern}
                        className={"patternTextarea"}
                      />
                      <TextAreaField
                        label="Constraints"
                        name="constraints"
                        value={this.state.pattern.constraints}
                        placeholder="Enter Constraints"
                        onChange={this.onChangePattern}
                        className={"patternTextarea"}
                      />
                      <TextAreaField
                        label="Benefits"
                        name="benefits"
                        value={this.state.pattern.benefits}
                        placeholder="Enter Benefits"
                        onChange={this.onChangePattern}
                        className={"patternTextarea"}
                      />
                      <TextAreaField
                        label="Liabilities"
                        name="liabilities"
                        value={this.state.pattern.liabilities}
                        placeholder="Enter Liabiliities"
                        onChange={this.onChangePattern}
                        className={"patternTextarea"}
                      />

                      <TextAreaField
                        label="Examples"
                        name="examples"
                        value={this.state.pattern.examples}
                        placeholder="Enter Examples"
                        onChange={this.onChangePattern}
                        className={"patternTextarea"}
                      />
                      <TextAreaField
                        label="Known Uses"
                        name="knownUses"
                        value={this.state.pattern.knownUses}
                        placeholder="Enter known Uses"
                        onChange={this.onChangePattern}
                        className={"patternTextarea"}
                      />
                      <TextAreaField
                        label="Related Patterns"
                        name="relatedPatterns"
                        value={this.state.pattern.relatedPatterns}
                        placeholder="Enter related Patterns"
                        onChange={this.onChangePattern}
                        className={"patternTextarea"}
                      />
                      <TextAreaField
                        label="Sources"
                        name="sources"
                        value={this.state.pattern.sources}
                        placeholder="Enter Sources"
                        onChange={this.onChangePattern}
                        className={"patternTextarea"}
                      />
                      <Button
                        className={"col-xs-6 dismiss-button"}
                        onClick={this.handleEditing}
                      >
                        Dismiss Changes
                      </Button>
                      <Button
                        bsStyle="primary"
                        className={"col-xs-6"}
                        onClick={this.editPattern}
                      >
                        Save Changes
                      </Button>
                    </Tab>
                  ) : (
                    <Tab
                      eventKey={3}
                      title="3. Additional Information"
                      disabled
                    />
                  )}
                </Tabs>
              </Panel>
            </div>
          )}
        </div>
      );
    }
    return <Col xs={12}>{patternContent}</Col>;
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors,
  pattern: state.pattern,
  editPattern: state.editPattern,
  strategy: state.strategy
});

export default connect(
  mapStateToProps,
  {
    createPattern,
    getPattern,
    editPattern,
    handleEditing,
    getStrategies,
    setEditingToFalse
  }
)(PatternDetail);
