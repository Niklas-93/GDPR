import React, { Component } from "react";
import { connect } from "react-redux";
import { setChosenTactics } from "../../actions/patternActions";

class ChooseTactic extends Component {
  constructor(props, context) {
    super(props, context);
  }

  // pass chosen tactic to store - stays only there until submission
  setChosenTactics = tactic => {
    this.props.setChosenTactics(tactic);
  };

  render() {
    const assignedTactics = this.props.pattern.chosenTactics;
    const tactic = this.props.tactic;
    let tacticContent;

    // display selected tactics with blue background, others normal
    if (assignedTactics.includes(tactic._id)) {
      tacticContent = (
        <span>
          <div
            className="activeFilter filter"
            onClick={() => this.setChosenTactics(tactic._id)}
          >
            {tactic.name}
          </div>
        </span>
      );
    } else {
      tacticContent = (
        <span>
          <div
            className="filter"
            onClick={() => this.setChosenTactics(tactic._id)}
          >
            {tactic.name}
          </div>
        </span>
      );
    }
    return <span>{tacticContent}</span>;
  }
}

const mapStateToProps = state => ({
  strategy: state.strategy,
  pattern: state.pattern
});

export default connect(
  mapStateToProps,
  { setChosenTactics }
)(ChooseTactic);
