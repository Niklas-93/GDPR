import React, { Component } from "react";
import PropTypes from "prop-types";
import Strategy from "./Strategy";
import { connect } from "react-redux";
import { getStrategies } from "../../actions/strategyActions";
import Spinner from "../common/Spinner";
import BtnWithMouseOverPop from "../common/BtnWithMouseOverPop";
import { Badge } from "react-bootstrap";

class StrategyOverview extends Component {
  componentDidMount() {
    this.props.getStrategies();
  }

  // refresh Overview after clicking on refresh button
  refreshOverview() {
    this.props.getStrategies();
  }

  render() {
    const { strategies, loading } = this.props.strategy;
    if (strategies === null || loading) {
      // while strategies are loading, display spinner
      return <Spinner />;
    } else {
      // if strategies are loaded, display them
      return (
        <div>
          <span className={"h4"}>
            Strategies <Badge>{strategies.length} </Badge>
          </span>{" "}
          <BtnWithMouseOverPop
            icon="fas fa-sync"
            title="Update Overview"
            link="#"
            onClick={() => this.refreshOverview()}
          />
          <br />
          <br />
          <br />
          {strategies.map(strategy => (
            <Strategy key={strategy._id} strategy={strategy} />
          ))}
        </div>
      );
    }
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
