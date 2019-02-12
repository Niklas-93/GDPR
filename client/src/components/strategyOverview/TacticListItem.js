import React, { Component } from "react";

class TacticListItem extends Component {
  render() {
    const { tactic } = this.props;

    return (
      <span>
        <li>
          {tactic.name}
          <ul>
            <li>{tactic.description}</li>
          </ul>
        </li>
      </span>
    );
  }
}

export default TacticListItem;
