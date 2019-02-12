import React, { Component } from "react";
import { Col } from "react-bootstrap";

class NoPatternFound extends Component {
  render() {
    const patterns = this.props.patterns;
    if (patterns.length == 0) {
      return (
        <Col xs={12}>
          <h5 className={"NoPatternMatchesFilter"}>
            No Pattern matches Filter!
          </h5>
        </Col>
      );
    } else {
      return null;
    }
  }
}

export default NoPatternFound;
