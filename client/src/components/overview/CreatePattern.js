import React, { Component } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import classnames from "classnames";
import { connect } from "react-redux";

import Spinner from "../common/Spinner";
//import { createPattern } from "../../actions/patternActions";
import {
  setAssignedTactics,
  setAssignedStrategies,
  clearChosenTactics,
  createPattern
} from "../../actions/patternActions";
import TextAreaField from "../common/TextAreaField";
import TextField from "../common/TextField";
import StrListGroupField from "../common/StrListGroupField";
import TacListGroupField from "../common/TacListGroupField";
import { getStrategies } from "../../actions/strategyActions";
import { Button, Row, Col, Panel, Tab, Tabs } from "react-bootstrap";
import store from "../../store";
import StrategyFeed from "./StrategyFeed";

class CreatePattern extends Component {
  constructor() {
    super();
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
      activeKey: 1
    };

    this.onChange = this.onChange.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
  }

  componentDidMount() {
    // get strategies for Selection
    this.props.getStrategies();
    // clear tactics if component is called for more than one time / more than one new pattern
    this.props.clearChosenTactics();
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

  // executed when trying to go to next tab
  handleSelect = activeKey => {
    // check if fields are empty, set corresponding errors

    // this.setErrorIfEmpty("problem");

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
    // get Patterns from server, display spinner while waiting
    const { loading, tactics } = this.props;

    let tacticContent;

    if (tactics === null || loading) {
      tacticContent = <Spinner />;
    } else {
      tacticContent = <TacListGroupField tactics={this.props.strategies} />;
    }
    //get strategies from serverm display spinner while waiting
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
    return (
      <form>
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
                value={this.state.name} // must be changede to name
                placeholder="Enter the name of the pattern"
                onChange={this.onChange}
                error={errors.name}
                onBlur={this.onChange}
              />
              <TextAreaField
                label="Summary"
                name="summary"
                value={this.state.summary} // must be changed to summary
                placeholder="Enter Summary"
                onChange={this.onChange}
                error={errors.summary}
                onBlur={this.onChange}
              />
              <TextAreaField
                label="Context"
                name="context"
                value={this.state.context}
                placeholder="Enter Context"
                onChange={this.onChange}
                error={errors.context}
                onBlur={this.onChange}
              />
              <TextAreaField
                label="Problem"
                name="problem"
                value={this.state.problem}
                placeholder="Enter Problem"
                onChange={this.onChange}
                error={errors.problem}
                onBlur={this.onChange}
              />
              <TextAreaField
                label="Solution"
                name="solution"
                value={this.state.solution}
                placeholder="Enter Solution"
                onChange={this.onChange}
                error={errors.solution}
                onBlur={this.onChange}
              />{" "}
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
                  value={this.state.consequences}
                  placeholder="Enter Consequences"
                  onChange={this.onChange}
                />
                <TextAreaField
                  label="Constraints"
                  name="constraints"
                  value={this.state.constraints}
                  placeholder="Enter Constraints"
                  onChange={this.onChange}
                />
                <TextAreaField
                  label="Benefits"
                  name="benefits"
                  value={this.state.benefits}
                  placeholder="Enter Benefits"
                  onChange={this.onChange}
                />
                <TextAreaField
                  label="Liabilities"
                  name="liabilities"
                  value={this.state.liabilities}
                  placeholder="Enter Liabilities"
                  onChange={this.onChange}
                />

                <TextAreaField
                  label="Examples"
                  name="examples"
                  value={this.state.examples}
                  placeholder="Enter Examples"
                  onChange={this.onChange}
                />
                <TextAreaField
                  label="Known Uses"
                  name="knownUses"
                  value={this.state.knownUses}
                  placeholder="Enter known Uses"
                  onChange={this.onChange}
                />
                <TextAreaField
                  label="Related Patterns"
                  name="relatedPatterns"
                  value={this.state.relatedPatterns}
                  placeholder="Enter related Patterns"
                  onChange={this.onChange}
                />
                <TextAreaField
                  label="Sources"
                  name="sources"
                  value={this.state.sources}
                  placeholder="Enter Sources"
                  onChange={this.onChange}
                />
                <Button
                  bsStyle="primary"
                  className={"col-xs-12"}
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
  getTactics: PropTypes.func.isRequired,
  getStrategies: PropTypes.func.isRequired
};
//Definition of needed props in Component
const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors,
  assignedTactics: state.pattern.assignedTactics,
  assignedStrategies: state.pattern.assignedStrategies,
  tactics: state.tactic.tactics,
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
