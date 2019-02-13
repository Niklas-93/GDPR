import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import { connect } from "react-redux";
import { setAssignedTactics } from "../../actions/projectActions";
import {
  Panel,
  Row,
  Col,
  Tabs,
  Tab,
  Button,
  Collapse,
  ListGroupItem,
  Tooltip,
  OverlayTrigger
} from "react-bootstrap";
import store from "../../store";

import "./TacListItem.css";

class TacListItem extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      assignedTactics: {},
      assignedTacticsForProject: store.getState().project.project
        .assignedTactics
    };

    this.onClick = this.onClick.bind(this);
  }

  componentDidMount() {
    var arr = this.props.assignedTactics;

    // regarding on the pathname the elements are already selected or not
    if (
      arr !== undefined &&
      this.props.location.pathname !== "/create-project"
    ) {
      arr.map(el =>
        el._id === this.props.tactic._id
          ? this.setState(() => {
              return {
                bsStyle: !this.state.bsStyle ? "info" : undefined
              };
            })
          : ""
      );
    }
  }

  onClick(e) {
    if (this.props.finishedTactics.indexOf(this.props.tactic.name) === -1) {
      this.setState(() => {
        this.props.setAssignedTactics(this.props.tactic);
        return {
          //assignedTactics: this.props.tactic,
          bsStyle: !this.state.bsStyle ? "info" : undefined
        };
      });
    } else {
      alert("Deselecting finished tactics are not possible!");
    }
  }

  render() {
    const tooltip = (
      <Tooltip id="tooltip">
        <strong>{this.props.strategy}</strong>
      </Tooltip>
    );

    const { tactic, auth } = this.props;
    //console.log(tactic._id.toHexString().length);
    return (
      <Row>
        <OverlayTrigger placement="top" overlay={tooltip}>
          <Col
            xs={2}
            /*style={{ backgroundColor: "rgba" + this.props.color }}*/
          >
            <div className="strategy">
              <strong>{this.props.strategy.substring(0, 4)}</strong>
            </div>
          </Col>
        </OverlayTrigger>
        <Col xs={10}>
          <ListGroupItem
            onClick={this.onClick}
            name={tactic.name}
            bsStyle={this.state.bsStyle}
          >
            {this.props.finishedTactics.indexOf(tactic.name) === -1 ? (
              ""
            ) : (
              <i className="far fa-check-circle" />
            )}
            {"     "}
            {tactic.name}
          </ListGroupItem>
        </Col>
      </Row>
    );
  }
}

TacListItem.propTypes = {
  tactic: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  setAssignedTactics: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  assignedTactics: state.project.assignedTactics,
  finishedTactics: state.project.finishedTactics
  //nameDeveloper: state.nameDeveloper
});

export default connect(
  mapStateToProps,
  { setAssignedTactics }
)(TacListItem);
