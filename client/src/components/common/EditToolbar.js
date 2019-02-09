import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  ButtonToolbar,
  ButtonGroup,
  Button,
  Col,
  Glyphicon,
  Modal,
  FormGroup,
  ControlLabel,
  FormControl,
  HelpBlock,
  Checkbox
} from "react-bootstrap";
import BtnWithMouseOverPop from "../common/BtnWithMouseOverPop";
import { Link, withRouter } from "react-router-dom";
import { deletePattern, editPattern } from "../../actions/patternActions";

class EditToolbar extends Component {
  constructor(props, context) {
    super(props, context);
    this.handleShowRemoveModal = this.handleShowRemoveModal.bind(this);
    this.handleCloseRemoveModal = this.handleCloseRemoveModal.bind(this);

    this.handleShowEditModal = this.handleShowEditModal.bind(this);
    this.handleCloseEditModal = this.handleCloseEditModal.bind(this);

    this.state = {
      showRemoveModal: false
    };

    this.onChange = this.onChange.bind(this);
    //this.onSubmit = this.onSubmit.bind(this);
  }
  /*onSubmit(e) {
    e.preventDefault();

    const patternData = {
      patternName: this.state.patternName,
      patternDescription: this.state.patternDescription
    };

    this.props.editPattern(patternData);
  }*/

  onChange(e) {
    // alert(e.target.name);
    // alert(e.target.value);
    this.setState({ [e.target.name]: e.target.value });
  }
  /*onDelete(id) {
    this.props.onDelete(id);
  }*/
  onChangeAssignedTactics = id => {
    //onChangeAssignedTactics(id) {
    //this.setState({ assignedTactics[this.state.assignedTactics.indexOf(id)]: true });
    this.state.assignedTactics.splice(
      this.state.assignedTactics.indexOf(id),
      1
    );
  };
  handleCloseRemoveModal() {
    this.setState({ showRemoveModal: false });
  }

  handleShowRemoveModal() {
    this.setState({ showRemoveModal: true });
  }
  handleCloseEditModal() {
    this.setState({ showEditModal: false });
  }

  handleShowEditModal() {
    this.setState({ showEditModal: true });
  }

  editPattern = () => {
    const patternData = {
      name: this.state.name,
      summary: this.state.summary,
      id: this.props.pattern._id
    };
    console.log(
      "function editpattern called in EditToolbar:" +
        patternData.name +
        patternData.summary
    );
    this.props.editPattern(patternData);
    this.handleCloseEditModal();
  };

  deletePattern = id => {
    console.log("function deletepattern called in EditToolbar" + id);
    console.log(this.props.history);
    this.props.deletePattern(id, this.props.history);
  };

  render() {
    const { pattern } = this.props;
    return (
      <ButtonToolbar className={"glyphicon-button"} style={{ float: "right" }}>
        {/*<ButtonGroup>
          <Button onClick={this.handleShowEditModal}>
            <Glyphicon glyph="pencil" />
          </Button>
          <Button onClick={this.handleShowRemoveModal}>
            <Glyphicon glyph="remove" />
          </Button>
        </ButtonGroup>*/}
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
          {/*<Button onClick={this.handleShowRemoveModal}>
            <Glyphicon glyph="remove" />
      </Button>*/}
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
  { deletePattern }
)(withRouter(EditToolbar));
