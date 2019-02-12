import React, { Component } from "react";
import PropTypes from "prop-types";
import PatternItem from "./PatternItem";

import { Col } from "react-bootstrap";

class PatternFeed extends Component {
  render() {
    const { patterns } = this.props;
    var patternFeedSize;
    if (this.props.patternSize === 4) {
      // sidebar is expanded --> reduce size of patternfeed
      patternFeedSize = 9;
    } else {
      // sidebar is reduced --> expand size of patternfeed
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
