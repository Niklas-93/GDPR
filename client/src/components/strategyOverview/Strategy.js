import React, { Component } from "react";
import { connect } from "react-redux";
import BtnWithMouseOverPop from "../common/BtnWithMouseOverPop";
import { ButtonToolbar, ButtonGroup, Panel, Col } from "react-bootstrap";
import { getStrategies } from "../../actions/strategyActions";
import StrategyEditForm from "./StrategyEditForm";
import TacticListItem from "./TacticListItem";

class Strategy extends Component {
  constructor(props, context) {
    super(props, context);
    // set initial state: no editing, no modal
    this.state = {
      editing: false,
      showRemoveModal: false,
      name: this.props.strategy.name,
      description: this.props.strategy.description
    };
  }

  //enables editmode
  enableEditing = () => {
    this.setState({
      editing: true
    });
  };

  //disables editmode
  disableEditing = () => {
    this.props.getStrategies();
    this.setState({
      editing: false
    });
  };

  /* strategies are not allowed to be deleted --> no modal for confirmation needed

  handleShowRemoveModal() {
    this.setState({ showRemoveModal: true });
  }
  handleCloseRemoveModal() {
    this.setState({ showRemoveModal: false });
  }
*/

  render() {
    const strategy = this.props.strategy;
    return (
      <div>
        {this.state.editing ? (
          <StrategyEditForm
            strategy={this.props.strategy}
            enableEditing={() => this.enableEditing()}
            disableEditing={() => this.disableEditing()}
          />
        ) : (
          <Col xs={6}>
            <Panel className={"minHeightStrategyPanel"}>
              <Panel.Heading>
                <Panel.Title
                  componentClass={"h3"}
                  className={"minHeightStrategyPanel-Heading"}
                >
                  <Col xs={6}>{strategy.name}</Col>
                  <Col xs={6}>
                    <ButtonToolbar
                      className={""}
                      componentClass={"span"}
                      style={{ float: "right" }}
                    >
                      <ButtonGroup>
                        <BtnWithMouseOverPop
                          icon="glyphicon glyphicon-pencil"
                          title="Edit Strategy"
                          link="#"
                          onClick={() => this.enableEditing()}
                        />
                      </ButtonGroup>
                      {/*
                       Strategies are not allowed to be deleted
                        <Button onClick={this.handleShowRemoveModal}>
                          <Glyphicon glyph="remove" />
                        </Button>
                      </ButtonGroup>
                      <div className="static-modal">
                        <Modal
                          show={this.state.showRemoveModal}
                          onHide={this.handleCloseRemoveModal}
                        >
                          <Modal.Header closeButton>
                            <Modal.Title>
                              Do you want to delete {this.props.strategy.name} ?
                            </Modal.Title>
                          </Modal.Header>

                          <Modal.Footer>
                            <Button
                              className={"btn-lg btn-info"}
                              onClick={() =>
                                this.deleteStrategy(this.props.strategy._id)
                              }
                            >
                              Confirm
                            </Button>

                            <Button onClick={this.handleCloseRemoveModal}>
                              Cancel
                            </Button>
                          </Modal.Footer>
                        </Modal>
                            </div>*/}
                    </ButtonToolbar>
                  </Col>
                </Panel.Title>
              </Panel.Heading>
              <Panel.Body>
                <div>{strategy.description}</div>
                <div>
                  <h4>Assigned Tactics</h4>
                  <ul>
                    {" "}
                    {strategy.assignedTactics.map(tactic => (
                      <TacticListItem key={tactic._id} tactic={tactic} />
                    ))}
                  </ul>
                </div>
              </Panel.Body>
            </Panel>
          </Col>
        )}
      </div>
    );
  }
}

const mapStateToProps = state => ({});

export default connect(
  mapStateToProps,
  { getStrategies }
)(Strategy);
