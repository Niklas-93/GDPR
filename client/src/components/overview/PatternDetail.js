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
  handleEditing
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
  Panel
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
      actualID: ""
    };

    this.onChange = this.onChange.bind(this);
    this.onChangePattern = this.onChangePattern.bind(this);
    this.onAddElementToArray = this.onAddElementToArray.bind(this);
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

  onAddElementToArray(e) {
    //alert(e);
    //console.log(e);
    // alert(e.target.name);
    //alert(e.target.value);
    //this.setState({ [pattern(e.target.name)]: e.target.value });
    if (typeof e.target.value == "undefined") {
      return false;
    }

    this.setState({
      pattern: {
        ...this.state.pattern,
        [e.target.value]: ""
      }
    });
    //alert(e.target.value);
  }
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

  /*onSubmit(e) {
    e.preventDefault();

    const newPattern = {
      name: this.state.name,
      sources: this.state.sources,
      summary: this.state.summary,
      context: this.state.context,
      problem: this.state.problem,
      forcesConcerns: this.state.forcesConcerns,
      solution: this.state.solution,
      structure: this.state.structure,
      implementation: this.state.implementation,
      consequences: this.state.consequences,
      benefits: this.state.benefits,
      examples: this.state.examples,
      relatedPatterns: this.state.relatedPatterns,
      sources: this.state.sources,
      knownUses: this.state.knownUser
    };

    this.props.createPattern(newPattern, this.props.history);
  }*/

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
      //console.log(pattern.pattern.assignedTactics);
      //alert(loading);
      //alert(pattern);
      //var pats = [pattern];
      //console.log(pattern2.pattern);
      //alert(Object.keys(pattern));
      //pattern = Object.assign(pattern);
      /*this.setState({
        pattern: {
          pattern
        }
      });*/

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
      /* let allOptionalPatternElements;
      allOptionalPatternElements = {
        alsoKnownAs: "",
        sources: ""
      };*/
      var missingPatternElements = [];
      /*Object.keys(pattern).forEach(patternElement => {
        if (isEmpty(patternElement)) {
          missingPatternElements.push(patternElement);
        }
      });*/
      if (typeof this.state.pattern.consequences == "undefined") {
        missingPatternElements.push("consequences");
      }
      let addConsequences;
      //alert(this.state.pattern.sources);
      if (typeof this.state.pattern.consequences !== "undefined") {
        addConsequences = (
          <div>
            <TextAreaField
              label="Consequences"
              name="consequences"
              value={this.state.pattern.consequences}
              placeholder="Enter Consequences"
              onChange={this.onChangePattern}
            />
            <span
              className={"removeElementFromPattern"}
              onClick={() => this.removeElement("consequences")}
            >
              Remove Consequences...
            </span>
          </div>
        );
      } else {
        addConsequences = <span />;
      }
      if (typeof this.state.pattern.knownUses == "undefined") {
        //alert("knownuses");
        missingPatternElements.push("knownUses");
      }

      let addKnownUses;
      //alert(this.state.pattern.sources);
      if (typeof this.state.pattern.knownUses !== "undefined") {
        addKnownUses = (
          <div>
            <TextAreaField
              label="known Uses"
              name="knownUses"
              value={this.state.pattern.knownUses}
              placeholder="Enter known Uses"
              onChange={this.onChangePattern}
            />
            <span
              className={"removeElementFromPattern"}
              onClick={() => this.removeElement("knownUses")}
            >
              Remove known Uses...
            </span>
          </div>
        );
      } else {
        addKnownUses = <span />;
      }
      if (typeof this.state.pattern.sources == "undefined") {
        missingPatternElements.push("sources");
      }
      let addSources;
      //alert(this.state.pattern.sources);
      if (typeof this.state.pattern.sources !== "undefined") {
        addSources = (
          <div>
            <TextAreaField
              label="Sources"
              name="sources"
              value={this.state.pattern.sources}
              placeholder="Enter Sources"
              onChange={this.onChangePattern}
            />
            <span
              className={"removeElementFromPattern"}
              onClick={() => this.removeElement("sources")}
            >
              Remove Sources...
            </span>
          </div>
        );
      } else {
        addSources = <span />;
      }

      console.log("missingpatternelements");
      console.log(missingPatternElements);
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
              <Col xs={6} xsOffset={6}>
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
                  onClick={this.handleEditing}
                >
                  Dismiss Changes
                </Button>
              </Col>
              <TextField
                label="Name of pattern"
                name="name"
                value={this.state.pattern.name}
                placeholder="Enter the name of the pattern"
                onChange={this.onChangePattern}
              />
              {strategyContent}
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

              <TextAreaField
                label="Examples"
                name="examples"
                value={this.state.pattern.examples}
                placeholder="Enter Examples"
                onChange={this.onChangePattern}
              />
              <div class="form-group">
                <label for="exampleFormControlSelect">
                  Add Element to Pattern
                </label>
                <select
                  class="form-control"
                  id="exampleFormControlSelect"
                  onChange={this.onAddElementToArray}
                  name="missingPatternElements"
                >
                  <option value={undefined}>Please select...</option>
                  {missingPatternElements.map(missingElement => (
                    <option value={missingElement}>{missingElement}</option>
                  ))}
                </select>
                {addConsequences}
                {addKnownUses}
                {addSources}
              </div>
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
    getStrategies
  }
)(PatternDetail);
