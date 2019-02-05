import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Panel, Col, Tabs, Tab, Button, Collapse } from "react-bootstrap";
import EditToolbarStrategy from "../common/editToolbarStrategy";
import {
  setFilterForPatterns,
  deselectTacticAsFilter
} from "../../actions/patternActions";

class TacticFilter extends Component {
  constructor(props, context) {
    super(props, context);
  }
  setFilterForPatterns = (tactic, strategy) => {
    // pass selected tactic and corresponding strategy to patternActions

    this.props.setFilterForPatterns(tactic, strategy);
  };

  deselectTacticAsFilter = (tactic, strategy) => {
    // pass deselected tactic and corresponding strategy to patternActions
    this.props.deselectTacticAsFilter(tactic, strategy);
  };

  includesVisibilityFilters = tactic => {
    if (this.props.pattern.visibilityFilters.includes(tactic)) {
      return true;
    }
  };
  render() {
    const { strategy, auth, pattern, tactic, strategyAsFilter } = this.props;
    var visibilityFilters = pattern.visibilityFilters;
    var activeFilter = false;
    let tacticItem;
    //alert(visibilityFilters);
    var strategyIsFilter = visibilityFilters.filter(
      visibilityFilter => visibilityFilter._id == strategyAsFilter._id
    );
    // console.log(strategyName);
    // console.log(strategyIsFilter);

    // if no tactic of actual strategy is set as filter
    if (strategyIsFilter.length == 0) {
      tacticItem = (
        <span>
          <div
            className="filter"
            onClick={() => this.setFilterForPatterns(tactic, strategyAsFilter)}
          >
            {tactic.name}
          </div>
          <div>{tactic.description}</div>
        </span>
      );
    }
    //if at least one tactic of actual strategy is set as filter
    else {
      var tacticIsStrategy = strategyIsFilter[0].assignedTactics.filter(
        tacticFilter => tacticFilter._id == tactic._id
      );
      // if actual tactic is not set as filter
      if (tacticIsStrategy.length == 0) {
        tacticItem = (
          <span>
            <div
              className="filter"
              onClick={() =>
                this.setFilterForPatterns(tactic, strategyAsFilter)
              }
            >
              {tactic.name}
            </div>
            <div>{tactic.description}</div>
          </span>
        );
      }
      // if actual tactic is set as filter
      else {
        tacticItem = (
          <span>
            <div
              className="activeFilter filter"
              onClick={() =>
                this.deselectTacticAsFilter(tactic, strategyAsFilter)
              }
            >
              {tactic.name}
            </div>
            <div>{tactic.description}</div>
          </span>
        );
      }
    }
    //alert(visibilityFilters);
    //console.log(tactic);
    //console.log("true");

    // alert("false");

    return <span>{tacticItem}</span>;
  }
}

TacticFilter.propTypes = {
  strategy: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  pattern: state.pattern
});

export default connect(
  mapStateToProps,
  { setFilterForPatterns, deselectTacticAsFilter }
)(TacticFilter);
