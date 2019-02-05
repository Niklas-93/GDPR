import React, { Component } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import classnames from "classnames";
import { connect } from "react-redux";
import isEmpty from "../../validation/is-empty";

//import { createPattern } from "../../actions/patternActions";
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
import PatternDetail_StrategiesWithTactics from "../overview/PatternDetail_StrategiesWithTactics";
import {
  Button,
  FormGroup,
  Checkbox,
  Col,
  FormControl,
  Input,
  Panel,
  Tabs,
  Tab
} from "react-bootstrap";
import StrategyFeed from "./StrategyFeed";
import { getStrategies } from "../../actions/strategyActions";

/*GET_PATTERN ohne Funktion*/

class PatternDetail extends Component {
  constructor(props) {
    super(props);
    //this.props.getPattern(this.props.match.params._id),
    this.state = {
      pattern: {},
      /*name: "",
      context: "",
      summary: "",
      problem: "",
      forcesConcerns: "",
      solution: "",
      structure: "",
      implementation: "",
      consequences: "",
      liabilities: "",
      examples: "",
      relatedPatterns: "",
       sources: "",
      knownUses: "",
      assignedTactics: [],*/
      errors: {},
      editing: false,
      assignedStrategiesWithAllTactics: [],
      actualID: "",
      activeKey: 1
    };
    this.handleSelect = this.handleSelect.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onChangePattern = this.onChangePattern.bind(this);

    // this.onSubmit = this.onSubmit.bind(this);
    //this.props.getPattern(this.props.match.params._id);
  }
  componentWillReceiveProps = nextProps => {
    /*  console.log("nextProps");
    console.log(nextProps);
    if (
      nextProps.match.params._id != this.props.pattern.pattern._id &&
      typeof this.props.pattern.pattern._id == "string"
    ) {
      //  alert("hallo");
      this.props.getPattern(nextProps.match.params._id);
      this.props.getStrategies();
    }
    //  this.props.getPattern(this.props.match.params._id);
    // this.props.getStrategies();*/
  };
  componentDidMount() {
    //console.log(this.props.location.state);
    //alert(this.props.match.params._id);
    // alert(this.props.getPattern(this.props.match.params._id));
    //alert(this.props.pattern.loading);
    this.props.getPattern(this.props.match.params._id);
    this.props.getStrategies();
    this.props.setEditingToFalse();
    //alert(this.props.pattern.pattern[0].name);
    //this.setState({ pattern: this.props.pattern });
  }

  onChangePattern(e) {
    //alert(e);
    //console.log(e);
    // alert(e.target.name);
    //alert(e.target.value);
    //this.setState({ [pattern(e.target.name)]: e.target.value });
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

  // checks if fields are empty, sets errors
  setErrorIfEmpty = textField => {
    if (this.state[textField] == "") {
      this.setState(
        {
          errors: {
            ...this.state.errors,
            [textField]: textField + " is required!"
          }
        }
        // alert(this.state.errors[textField])
      );
    } else {
      this.setState({
        errors: {
          ...this.state.errors,
          [textField]: undefined
        }
      });
    }
    console.log(textField);
    console.log(this.state.errors[textField]);
  };

  removeElement = element => {
    //alert(element);
    this.setState({
      pattern: {
        ...this.state.pattern,
        [element]: undefined
      }
    });
  };
  onChange(e) {
    alert(e.target.name);
    alert(e.target.value);
    this.setState({ [e.target.name]: e.target.value });
  }

  editPattern = () => {
    const editedPattern = this.state.pattern;
    editedPattern.assignedTactics = this.props.pattern.chosenTactics;
    console.log("editedPattern");
    console.log(editedPattern);
    this.props.editPattern(editedPattern);
    this.handleEditing();
  };

  handleEditing = () => {
    this.setState({
      pattern: this.props.pattern.pattern
    });
    this.props.handleEditing();
  };

  isEmpty(patternProperty) {
    if ((patternProperty = "")) {
      return true;
    } else {
      return false;
    }
  }

  onChangeAssignedTactics = id => {
    let insertAssignedTactics = this.state.assignedTactics;
    //onChangeAssignedTactics(id) {
    //this.setState({ assignedTactics[this.state.assignedTactics.indexOf(id)]: true });
    // alert("hallo");
    if (this.state.assignedTactics.includes(id)) {
      insertAssignedTactics = this.state.assignedTactics.splice(
        this.state.assignedTactics.indexOf(id),
        1
      );
      this.setState({
        assignedTactics: insertAssignedTactics
      });
      alert("included" + this.state.assignedTactics.length);
    } else {
      insertAssignedTactics = this.state.assignedTactics.push(id);
      this.setState({
        assignedTactics: insertAssignedTactics
      });
      alert("not included" + this.state.assignedTactics.length);
    }
  };
  onDropdownSelected(e) {
    console.log("THE VAL", e.target.value);
    //here you will see the current selected value of the select input
  }
  render() {
    const { errors } = this.state;
    const { isAuthenticated } = this.props.auth;
    //const { editPattern } = this.props.patterneditPattern;
    // const { pattern, loading } = this.props.pattern;
    const { pattern, loading, editPattern } = this.props.pattern;
    //const pattern2 = pattern.pattern;

    //const pattern1 = pattern.pattern;
    //const { loading } = this.props.pattern.loading;
    //console.log(typeof pattern.pattern);
    let patternContent;
    //alert(loading);
    //alert(pattern);
    //alert(editPattern);
    if (pattern === null || loading || Object.keys(pattern).length === 0) {
      // alert("falsch");
      console.log("falsch");
      console.log(pattern);
      console.log(loading);
      console.log(typeof pattern);
      patternContent = <Spinner />;
    } else {
      //alert("richtig");
      console.log("richtig");
      console.log(pattern);
      console.log(loading);
      console.log(typeof pattern);

      const detailPattern = pattern.pattern;
      //patternContent = <h1>{detailPattern.name}</h1>;
      const { strategies, loading3 } = this.props.strategy;
      let strategyContent;

      if (strategies === null || loading3) {
        strategyContent = <Spinner />;
      } else {
        strategyContent = (
          <StrategyFeed strategies={strategies} isFilter={false} />
        );
      }

      var seeStrategies = false;
      var seeAdditionals = false;
      if (
        this.state.name != "" &&
        this.state.summary != "" &&
        this.state.context != "" &&
        this.state.problem != "" &&
        this.state.solution != ""
      ) {
        seeStrategies = true;
      }
      if (this.props.pattern.chosenTactics.length != 0) {
        seeAdditionals = true;
      }
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
                    {isAuthenticated ? (
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
                      <h4>relatedPatterns</h4>
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
                      label="Name of pattern"
                      name="name"
                      value={this.state.pattern.name}
                      placeholder="Enter the name of the pattern"
                      onChange={this.onChangePattern}
                    />

                    <TextAreaField
                      label="Summary"
                      name="summary"
                      value={this.state.pattern.summary}
                      placeholder="Enter Summary"
                      onChange={this.onChangePattern}
                    />
                    <TextAreaField
                      label="Context"
                      name="context"
                      value={this.state.pattern.context}
                      placeholder="Enter Context"
                      onChange={this.onChangePattern}
                    />
                    <TextAreaField
                      label="Problem"
                      name="problem"
                      value={this.state.pattern.problem}
                      placeholder="Enter Problem"
                      onChange={this.onChangePattern}
                    />
                    <TextAreaField
                      label="Solution"
                      name="solution"
                      value={this.state.pattern.solution}
                      placeholder="Enter Solution"
                      onChange={this.onChangePattern}
                    />
                    <Button
                      bsStyle="primary"
                      className={"col-xs-12"}
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
                        <Button
                          className={"col-xs-12"}
                          bsStyle="primary"
                          onClick={() => this.handleSelect(3)}
                        >
                          Set additional Information
                        </Button>
                      ) : (
                        <span>
                          <div style={{ fontWeight: "bold", color: "red" }}>
                            At least one tactic must be chosen!
                          </div>
                          <Button
                            className={"col-xs-12"}
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
                      />
                      <TextAreaField
                        label="Constraints"
                        name="constraints"
                        value={this.state.pattern.constraints}
                        placeholder="Enter Constraints"
                        onChange={this.onChangePattern}
                      />
                      <TextAreaField
                        label="Benefits"
                        name="benefits"
                        value={this.state.pattern.benefits}
                        placeholder="Enter Benefits"
                        onChange={this.onChangePattern}
                      />
                      <TextAreaField
                        label="Liabilities"
                        name="liabilities"
                        value={this.state.pattern.liabilities}
                        placeholder="Enter Liabiliities"
                        onChange={this.onChangePattern}
                      />

                      <TextAreaField
                        label="Examples"
                        name="examples"
                        value={this.state.pattern.examples}
                        placeholder="Enter Examples"
                        onChange={this.onChangePattern}
                      />
                      <TextAreaField
                        label="Known Uses"
                        name="knownUses"
                        value={this.state.pattern.knownUses}
                        placeholder="Enter known Uses"
                        onChange={this.onChangePattern}
                      />
                      <TextAreaField
                        label="Related Patterns"
                        name="relatedPatterns"
                        value={this.state.pattern.relatedPatterns}
                        placeholder="Enter related Patterns"
                        onChange={this.onChangePattern}
                      />
                      <TextAreaField
                        label="Sources"
                        name="sources"
                        value={this.state.pattern.sources}
                        placeholder="Enter Sources"
                        onChange={this.onChangePattern}
                      />
                      <Button
                        bsStyle="primary"
                        className={"col-xs-6"}
                        onClick={this.editPattern}
                      >
                        Save Changes
                      </Button>
                      <Button
                        bsStyle="primary"
                        className={"col-xs-6"}
                        onClick={this.handleEditing}
                      >
                        Dismiss Changes
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
    return (
      <Col xs={12}>
        {patternContent}
        {/*pats.map((pattern, index) => (
          <h1>{pattern._id}</h1>
        ))*/}
        {/*{this.state.editing && isAuthenticated ? (
          <form onSubmit={this.onSubmit}>
            <TextField
              label="Name of pattern"
              name="Editname"
              value={this.state.Editname} // must be changede to name
              placeholder="Enter the name of the pattern"
              onChange={this.onChange}
            />

            <TextAreaField
              label="Description"
              name="Editsummary"
              value={this.state.Editsummary} // must be changed to summary
              placeholder="Enter Summary"
              onChange={this.onChange}
            />
            <TextAreaField
              label="Context"
              name="Editcontext"
              value={this.state.Editcontext}
              placeholder="Enter Context"
              onChange={this.onChange}
            />

            <TextAreaField
              label="Problem"
              name="Editproblem"
              value={this.state.Editproblem}
              placeholder="Enter Problem"
              onChange={this.onChange}
            />
            <TextAreaField
              label="Forces and Concerns"
              name="EditforcesConcerns"
              value={this.state.EditforcesConcerns}
              placeholder="Enter Forces and Concerns"
              onChange={this.onChange}
            />
            <TextAreaField
              label="Solution"
              name="Editsolution"
              value={this.state.Editsolution}
              placeholder="Enter Solution"
              onChange={this.onChange}
            />
            <TextAreaField
              label="Structure"
              name="Editstructure"
              value={this.state.Editstructure}
              placeholder="Enter Structure"
              onChange={this.onChange}
            />
            <TextAreaField
              label="Implementation"
              name="Editimplementation"
              value={this.state.Editimplementation}
              placeholder="Enter Implementation"
              onChange={this.onChange}
            />
            <TextAreaField
              label="Consequences"
              name="Editconsequences"
              value={this.state.Editconsequences}
              placeholder="Enter Consequences"
              onChange={this.onChange}
            />

            <TextAreaField
              label="Examples"
              name="Editexamples"
              value={this.state.Editexamples}
              placeholder="Enter Examples"
              onChange={this.onChange}
            />

            <TextAreaField
              label="known Uses"
              name="EditknownUses"
              value={this.state.EditknownUses}
              placeholder="Enter known Uses"
              onChange={this.onChange}
            />

            <TextAreaField
              label="related Patterns"
              name="EditrelatedPatterns"
              value={this.state.EditrelatedPatterns}
              placeholder="Enter related Patterns"
              onChange={this.onChange}
            />

            <TextAreaField
              label="Sources"
              name="Editsources"
              value={this.state.Editsources}
              placeholder="Enter Sources"
              onChange={this.onChange}
            />
            {/*<FormGroup>
              {this.state.assignedTactics.map(tactic => (
                <Checkbox
                  name="assignedTactics"
                  checked
                  onChange={() => this.onChangeAssignedTactics(tactic._id)}
                  value={tactic._id}
                >
                  {tactic.name}
                </Checkbox>
              ))}
              </FormGroup>*/}
        {/*

            <Button
              bsStyle="primary"
              style={{ marginBottom: "70px" }}
              onClick={this.editPattern}
            >
              Save Changes
            </Button>
            <Button
              bsStyle="primary"
              style={{ marginBottom: "70px" }}
              onClick={this.dismissChanges}
            >
              Dismiss Changes
            </Button>
          </form>
        ) : (
          <div style={{ marginBottom: "70px" }}>
            {isAuthenticated ? (
              <Col xs={12}>
                <Col xs={6}>
                  <h3>{this.state.name}</h3>
                </Col>
                <Col xs={6}>
                  <EditToolbar
                    name={this.state.name}
                    _id={this.props.match.params._id}
                    enableEditing={() => this.enableEditing()}
                  />
                </Col>
              </Col>
            ) : (
              <h3>{this.state.name}</h3>
            )}
            <PatternDetail_StrategiesWithTactics
              assignedStrategiesWithAllTactics={
                this.state.assignedStrategiesWithAllTactics
              }
            />
            <Col xs={12}>
              <Col xs={12}>
                <h1>halllo</h1>
                <h1>{patternContent}</h1>
                <h1>hlo</h1>
                <h5>Summary</h5>
                <div>{this.state.summary}</div>
                <h5>Context</h5>
                <div>{this.state.context}</div>
                <h5>Problem</h5>
                <div>{this.state.problem}</div>
                {!isEmpty(this.state.forcesConcerns) ? (
                  <span>
                    <h5>Forces and Concerns</h5>
                    <div>{this.state.forcesConcerns}</div>
                  </span>
                ) : (
                  ""
                )}
                <h5>Solution</h5>
                <div>{this.state.solution}</div>
                {!isEmpty(this.state.structure) ? (
                  <span>
                    <h5>Structure</h5>
                    <div>{this.state.structure}</div>
                  </span>
                ) : (
                  ""
                )}
                {!isEmpty(this.state.implementation) ? (
                  <span>
                    <h5>Implementation</h5>
                    <div>{this.state.implementation}</div>
                  </span>
                ) : (
                  ""
                )}
                {!isEmpty(this.state.consequences) ? (
                  <span>
                    <h5>Consequences</h5>
                    <div>{this.state.consequences}</div>
                  </span>
                ) : (
                  ""
                )}
                <h5>Examples</h5>
                <div>{this.state.examples}</div>
                {!isEmpty(this.state.knownUses) ? (
                  <span>
                    <h5>Known Uses</h5>
                    <div>{this.state.knownUses}</div>
                  </span>
                ) : (
                  ""
                )}
                {!isEmpty(this.state.relatedPatterns) ? (
                  <span>
                    <h5>related Patterns</h5>
                    <div>{this.state.relatedPatterns}</div>
                  </span>
                ) : (
                  ""
                )}

                {!isEmpty(this.state.sources) ? (
                  <span>
                    <h5>Sources</h5>
                    <div>{this.state.sources}</div>
                  </span>
                ) : (
                  ""
                )}
              </Col>
            </Col>
          </div>
        )}*/}
      </Col>
    );
  }
}

PatternDetail.propTypes = {
  createPattern: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

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
