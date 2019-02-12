import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter, Link } from "react-router-dom";
import { setComment } from "../../actions/projectActions";
import { Button, OverlayTrigger, Popover } from "react-bootstrap";

class BtnWithMouseOverPop extends Component {
  constructor() {
    super();
    this.state = {};
  }
  render() {
    return (
      <span className={this.props.className}>
        <OverlayTrigger
          trigger={["hover", "focus"]}
          placement="top"
          overlay={
            <Popover id="popover-trigger-hover-focus">
              {this.props.title}
            </Popover>
          }
        >
          <Link to={this.props.link ? this.props.link : "#"}>
            <Button
              onClick={this.props.onClick}
              className={this.props.className}
            >
              <i className={this.props.icon} />
            </Button>
          </Link>
        </OverlayTrigger>
      </span>
    );
  }
}

export default connect(null)(withRouter(BtnWithMouseOverPop));
