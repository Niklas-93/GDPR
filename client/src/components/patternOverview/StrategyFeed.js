import React, { Component } from "react";
import PropTypes from "prop-types";
import StrategyItem from "./StrategyItem";
import { Col } from "react-bootstrap";
class StrategyFeed extends Component {
  render() {
    const { strategies } = this.props;
    return strategies.map((strategy, index) => (
      <span>
        <Col>
          <StrategyItem
            key={strategy._id}
            strategy={strategy}
            isFilter={this.props.isFilter}
          />
        </Col>
      </span>
    ));
  }
}

StrategyFeed.propTypes = {
  strategies: PropTypes.array.isRequired
};

export default StrategyFeed;
