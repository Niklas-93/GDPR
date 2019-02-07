import React, { Component } from "react";
import PropTypes from "prop-types";
import { ListGroup, ListGroupItem, Row, Col } from "react-bootstrap";
import TacListItem from "./TacListItem";
import store from "../../store";

class TacListGroupField extends Component {
  constructor() {
    super();
    this.state = {
      tactics: undefined,

      errors: {}
    };

    this.updateTactics = this.updateTactics.bind(this);
  }

  componentWillUpdate() {
    setTimeout(() => {
      this.updateTactics(null);
    }, 500);
  }

  componentDidMount() {
    //this.updateTactics();
  }

  updateTactics(tactics) {
    this.setState({ state: this.state });
  }

  render() {
    var tactics = this.props.tactics;
    //console.log(tactics);
    //return <div />;

    function concatTactics() {
      var tempArray = [];

      if (tactics) {
        tactics.map(strategy =>
          strategy.assignedTactics.map(
            tactic => (tempArray = tempArray.concat([{ tactic, strategy }]))
          )
        );
      }

      return tempArray;
    }

    //this.updateTactics(this.props.tactics);

    return (
      <div>
        {concatTactics().map((
          tactic //console.log(tactic.assignedTactics),
        ) => (
          <TacListItem
            key={tactic.tactic._id}
            tactic={tactic.tactic}
            location={this.props.location}
            strategy={tactic.strategy.name}
          />
        ))}
      </div>
    );
  }
}

export default TacListGroupField;
