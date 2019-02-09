import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import BtnWithMouseOverPop from "../common/BtnWithMouseOverPop";
import {
  Button,
  Glyphicon,
  FormGroup,
  ControlLabel,
  FormControl,
  Panel,
  Col
} from "react-bootstrap";
import { editStrategy } from "../../actions/strategyActions";

class StrategyEditForm extends Component {
  constructor(props, context) {
    super(props, context);
    // set initial state
    this.state = {
      name: this.props.strategy.name,
      description: this.props.strategy.description,
      assignedTactics: this.props.strategy.assignedTactics
    };
    // bind functions
    this.onChange = this.onChange.bind(this);
    this.onChangeAssignmentArray = this.onChangeAssignmentArray.bind(this);
  }

  // handles change of input fields (name, description)
  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  // if assigned tactic is changed
  onChangeAssignmentArray(e) {
    var tacticArray = this.state.assignedTactics;
    tacticArray[e.target.name].name = e.target.value;
    this.setState({
      assignedTactics: tacticArray
    });
  }

  // on confirmation, change Strategy and assigned Tactics
  editStrategy = () => {
    // set data to be forwarded to server
    const strategyData = {
      name: this.state.name,
      description: this.state.description,
      assignedTactics: this.state.assignedTactics,
      id: this.props.strategy._id
    };
    this.props.editStrategy(strategyData);
    this.props.disableEditing();
  };

  // disable edit mode
  disableEditing = () => {
    this.props.disableEditing();
  };

  // removes tactic from assigned tactics array - not permanent
  removeTacticFromArray = index => {
    var tacticArray = this.state.assignedTactics;
    tacticArray.splice(index, 1);
    this.setState({
      assignedTactics: tacticArray
    });
  };

  // appends new tactic to array of assigned tactics
  newTacticField = () => {
    var emptyTacticObject = { name: "", description: "" };
    var tacticArray = this.state.assignedTactics;
    tacticArray.push(emptyTacticObject);
    this.setState({
      assignedTactics: tacticArray
    });
  };

  render() {
    return (
      <Col xs={3}>
        <Panel className={"minHeightStrategy"}>
          <form>
            <Panel.Heading>
              <Panel.Title>
                <FormGroup>
                  <FormControl
                    type="text"
                    name="name"
                    value={this.state.name}
                    placeholder="Strategy Name"
                    onChange={this.onChange}
                  />
                  <FormControl.Feedback />
                </FormGroup>
              </Panel.Title>
            </Panel.Heading>
            <Panel.Body>
              <FormGroup>
                <ControlLabel>Strategy Description</ControlLabel>
                <FormControl
                  componentClass="textarea"
                  type="text"
                  name="description"
                  value={this.state.description}
                  placeholder="Strategy Description"
                  onChange={this.onChange}
                />
                <FormControl.Feedback />
              </FormGroup>
              <FormGroup>
                <Col xs={9}>
                  <ControlLabel>Assigned Tactics</ControlLabel>
                </Col>
                <Col xs={3}>
                  <BtnWithMouseOverPop
                    icon="fa fa-plus"
                    title="Add new Tactic"
                    link="#"
                    onClick={() => this.newTacticField()}
                  />
                </Col>
                <br />
                <br />
                <br />
                {this.state.assignedTactics.map((tactic, index) => (
                  <div>
                    <Col xs={9}>
                      <FormControl
                        type="text"
                        name={index}
                        value={tactic.name}
                        placeholder="Tactic Name"
                        onChange={this.onChangeAssignmentArray}
                      />
                    </Col>
                    <Col xs={3}>
                      <BtnWithMouseOverPop
                        icon="glyphicon glyphicon-remove"
                        title="Delete Tactic"
                        link="#"
                        onClick={() => this.removeTacticFromArray(index)}
                      />
                    </Col>
                  </div>
                ))}
              </FormGroup>
            </Panel.Body>
            <Panel.Footer>
              <Button
                onClick={() => this.editStrategy(this.props.strategy._id)}
              >
                Confirm Changes
              </Button>
              <Button onClick={() => this.disableEditing()}>
                Dismiss Changes
              </Button>
            </Panel.Footer>
          </form>
        </Panel>
      </Col>
    );
  }
}

// Defines required props
StrategyEditForm.propTypes = {
  deleteStrategy: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { editStrategy }
)(StrategyEditForm);
