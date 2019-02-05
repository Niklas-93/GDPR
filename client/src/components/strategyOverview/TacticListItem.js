import React, { Component } from "react";

class TacticListItem extends Component {
  render() {
    const { tactic } = this.props;

    return <li>{tactic.name}</li>;
  }
}

export default TacticListItem;
