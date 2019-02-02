import React, { Component } from "react";
import {
  Popover,
  Tooltip,
  Button,
  Modal,
  OverlayTrigger
} from "react-bootstrap";
import { withRouter, Link } from "react-router-dom";

class ModalProject extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);

    this.state = {
      show: false
    };
  }

  handleClose() {
    this.setState({ show: false });
  }

  handleShow() {
    this.setState({ show: true });
  }

  render() {
    const popover = (
      <Popover id="modal-popover" title="popover">
        very popover. such engagement
      </Popover>
    );
    const tooltip = <Tooltip id="modal-tooltip">wow.</Tooltip>;

    return (
      <span>
        <Button
          bsStyle="primary"
          style={{ margin: "1em" }}
          onClick={this.handleShow}
        >
          Delete Project
        </Button>

        <Modal show={this.state.show} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Deletion</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h4>
              Do you really want to delete the Project{" "}
              <strong>{this.props.project.name}</strong>
            </h4>
            <div>
              <Link to="/PMoverview">
                <Button
                  onClick={() => this.props.onClick(this.props.project._id)}
                  bsStyle="danger"
                  bsSize="large"
                  block
                >
                  Delete <strong>{this.props.project.name}</strong>
                </Button>
              </Link>
              <Button onClick={this.handleClose} bsSize="large" block>
                Abort
              </Button>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.handleClose}>Close</Button>
          </Modal.Footer>
        </Modal>
      </span>
    );
  }
}

export default ModalProject;
