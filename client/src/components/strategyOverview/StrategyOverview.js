import React, { Component } from "react";
import PropTypes from "prop-types";
import Strategy from "./Strategy";
import { connect } from "react-redux";
import { getStrategies } from "../../actions/strategyActions";

class StrategyOverview extends Component {
  componentDidMount() {
    this.props.getStrategies();
  }
  render() {
    const { strategies } = this.props.strategy;

    return strategies.map(strategy => (
      <Strategy key={strategy._id} strategy={strategy} />
    ));
  }
}

// Defines strategies as required props
StrategyOverview.propTypes = {
  strategies: PropTypes.array.isRequired
};

const mapStateToProps = state => ({
  strategy: state.strategy
});

export default connect(
  mapStateToProps,
  { getStrategies }
)(StrategyOverview);
