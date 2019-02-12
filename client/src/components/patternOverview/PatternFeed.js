import React, { Component } from "react";
import PropTypes from "prop-types";
import PatternItem from "./PatternItem";

import { Col } from "react-bootstrap";

class PatternFeed extends Component {
  render() {
    const { patterns } = this.props;
    var patternFeedSize;
    if (this.props.patternSize === 4) {
      patternFeedSize = 9;
    } else {
      patternFeedSize = 12;
    }
    return (
      <Col xs={patternFeedSize}>
        {patterns.map((pattern, index) => (
          <PatternItem
            key={pattern._id}
            pattern={pattern}
            patternSize={this.props.patternSize}
          />
        ))}
      </Col>
    );
  }
}

PatternFeed.propTypes = {
  patterns: PropTypes.array.isRequired
};

export default PatternFeed;
