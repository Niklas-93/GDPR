import React, { Component } from "react";
import PropTypes from "prop-types";
import Strategy from "./Strategy";
import { connect } from "react-redux";
import { getStrategies } from "../../actions/strategyActions";
import Spinner from "../common/Spinner";
import { Badge } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./StrategyOverview.css";

class StrategyOverview extends Component {
  componentDidMount() {
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
          </span>
          <span>
            <Link to="/overview" style={{ marginLeft: "800px" }}>
              Back to Overview...
            </Link>
          </span>{" "}
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
