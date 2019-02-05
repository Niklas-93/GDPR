import React, { Component } from "react";
import PropTypes from "prop-types";
import StrategyItem from "./StrategyItem";
import { Col } from "react-bootstrap";
class StrategyFeed extends Component {
  indexIsEven = index => {
    if (index % 2 == 0) {
      //alert("halllooo");
      return true;
    }
  };
  render() {
    const { strategies } = this.props;
    console.log("Strategyfeed");
    console.log(strategies);
    return strategies.map((strategy, index) => (
      <span>
        {this.indexIsEven(index) && !this.props.isFilter ? (
          <Col>
            <StrategyItem
              key={strategy._id}
              strategy={strategy}
              isFilter={this.props.isFilter}
            />
          </Col>
        ) : (
          <StrategyItem
            key={strategy._id}
            strategy={strategy}
            isFilter={this.props.isFilter}
          />
        )}
      </span>
    ));
  }
}

StrategyFeed.propTypes = {
  strategies: PropTypes.array.isRequired
};

export default StrategyFeed;
