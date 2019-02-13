import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  ButtonToolbar,
  ButtonGroup,
  Button,
  Col,
  Modal
} from "react-bootstrap";
import BtnWithMouseOverPop from "../common/BtnWithMouseOverPop";
import { withRouter } from "react-router-dom";
import { deletePattern } from "../../actions/patternActions";
<<<<<<< HEAD:client/src/components/common/EditToolbar.js
=======
import { getStrategies } from "../../actions/strategyActions";
>>>>>>> niklas-dev:client/src/components/patternDetail/EditToolbar.js

class EditToolbar extends Component {
  constructor(props, context) {
    super(props, context);
    this.handleShowRemoveModal = this.handleShowRemoveModal.bind(this);
    this.handleCloseRemoveModal = this.handleCloseRemoveModal.bind(this);

    //initially, do not display modal
    this.state = {
      showRemoveModal: false
    };
  }

  // Close Modal
  handleCloseRemoveModal() {
    this.setState({ showRemoveModal: false });
  }
  //show Modal
  handleShowRemoveModal() {
    this.setState({ showRemoveModal: true });
  }
  //delete Pattern on confirmation of modal
  deletePattern = id => {
    this.props.deletePattern(id, this.props.history);
    this.props.getStrategies();
  };

  render() {
    return (
      <ButtonToolbar className={"glyphicon-button"} style={{ float: "right" }}>
        <ButtonGroup>
          <BtnWithMouseOverPop
            icon="glyphicon glyphicon-pencil"
            title="Edit Pattern"
            link="#"
            onClick={() => this.props.enableEditing()}
          />
          {"   "}
          <BtnWithMouseOverPop
            icon="glyphicon glyphicon-remove"
            title="Delete Pattern"
            link="#"
            onClick={() => this.handleShowRemoveModal()}
          />
        </ButtonGroup>
        <div className="static-modal">
          <Modal
            show={this.state.showRemoveModal}
            onHide={this.handleCloseRemoveModal}
          >
            <Modal.Header closeButton>
              <Modal.Title>
                Do you want to delete {this.props.name} ?
              </Modal.Title>
            </Modal.Header>

            <Modal.Footer>
              <Col xs={6}>
                <Button
                  className={"col-xs-12"}
                  bsStyle="danger"
                  onClick={() => this.deletePattern(this.props._id)}
                >
                  Confirm <i className={"glyphicon glyphicon-trash"} />
                </Button>
              </Col>
              <Col xs={6}>
                <Button
                  className={"dismiss-button col-xs-12"}
                  onClick={this.handleCloseRemoveModal}
                >
                  Cancel <i className={"glyphicon glyphicon-remove"} />
                </Button>
              </Col>
            </Modal.Footer>
          </Modal>
        </div>
      </ButtonToolbar>
    );
  }
}

EditToolbar.propTypes = {
  deletePattern: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { deletePattern, getStrategies }
)(withRouter(EditToolbar));
