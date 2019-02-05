import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Panel, Col, Tabs, Tab, Button, Collapse } from "react-bootstrap";
import EditToolbarStrategy from "../common/editToolbarStrategy";
import {
  setFilterForPatterns,
  setStrategyAsFilter,
  deselectStrategyAsFilter
} from "../../actions/patternActions";
import TacticFilter from "./TacticFilter";
import ChooseTactic from "./ChooseTactic";

class StrategyItem extends Component {
  constructor(props, context) {
    super(props, context);
  }
  setStrategyAsFilter = strategy => {
    //e.preventDefault();
    this.props.setStrategyAsFilter(strategy);
    /*  var strategyPanelStyle = document.getElementById(strategy.name).style;
    strategyPanelStyle.borderColor = "#337ab7";
    strategyPanelStyle.borderWidth = "3px";*/
  };

  deselectStrategyAsFilter = strategy => {
    this.props.deselectStrategyAsFilter(strategy);
    /* var strategyPanelStyle = document.getElementById(strategy.name).style;
    strategyPanelStyle.borderColor = "#ddd";
    strategyPanelStyle.borderWidth = "1px";*/
  };

  render() {
    const { strategy, auth, pattern, isFilter } = this.props;
    const visibilityFilters = pattern.visibilityFilters;
    let strategyHeading;
    let cssClassesofStrategyPanel;
    // check if strategy is in sidebar as potential filter or not
    if (isFilter) {
      // if strategy is in sidebar
      var strategyIsSelected = false;
      // check if any strategies are set as filters
      if (visibilityFilters.length == 0) {
        strategyHeading = (
          <span>
            <Panel.Title toggle className={"inline"}>
              <span class="h5">{strategy.name}</span>
            </Panel.Title>
            <Panel.Title className={"inline"}>
              <span
                className={"dotForStrategyFilter"}
                onClick={() => this.setStrategyAsFilter(strategy)}
              />
            </Panel.Title>
          </span>
        );
        cssClassesofStrategyPanel = "passiveStrategyPanel";
      }
      // if any strategies are set as filters
      else {
        console.log("visibilityFilters");
        console.log(visibilityFilters);
        console.log("strategy");
        console.log(strategy);
        var filters = visibilityFilters.filter(
          visibilityFilter => visibilityFilter._id == strategy._id
        );

        if (filters.length !== 0) {
          // if strategy is set as filter

          if (
            filters[0].assignedTactics.length == strategy.assignedTactics.length
          ) {
            //if all tactics are set as filters
            strategyHeading = (
              <span>
                <Panel.Title toggle className={"inline"}>
                  <span class="h5">{strategy.name}</span>
                </Panel.Title>
                <Panel.Title className={"inline"}>
                  <span
                    className={"dotForActiveStrategyFilter"}
                    onClick={() => this.deselectStrategyAsFilter(strategy)}
                  />
                </Panel.Title>
              </span>
            );
            cssClassesofStrategyPanel = "activeStrategyPanel";
          }
          // if not all tactis are set as filters
          else {
            strategyHeading = (
              <span>
                <Panel.Title toggle className={"inline"}>
                  <span class="h5">{strategy.name}</span>
                </Panel.Title>
                <Panel.Title className={"inline"}>
                  <span
                    className={"dotForStrategyFilter"}
                    onClick={() => this.setStrategyAsFilter(strategy)}
                  />
                </Panel.Title>
              </span>
            );
            cssClassesofStrategyPanel = "passiveStrategyPanel";
          }
        }
        // if no tactic of actual strategy is set as filter
        else {
          strategyHeading = (
            <span>
              <Panel.Title toggle className={"inline"}>
                <span class="h5">{strategy.name}</span>
              </Panel.Title>
              <Panel.Title className={"inline"}>
                <span
                  className={"dotForStrategyFilter"}
                  onClick={() => this.setStrategyAsFilter(strategy)}
                />
              </Panel.Title>
            </span>
          );
          cssClassesofStrategyPanel = "passiveStrategyPanel";
        }
      }
    } else {
      // if strategy is not in sidebar
      strategyHeading = (
        <Panel.Title toggle>
          <span class="h5">{strategy.name}</span>
        </Panel.Title>
      );
      cssClassesofStrategyPanel = "";
    }
    return (
      <span>
        <Col xs={isFilter ? 12 : 12}>
          <Panel id={strategy.name} className={cssClassesofStrategyPanel}>
            <Panel.Heading>
              {strategyHeading}
              {/*<Panel.Title toggle>
                <span class="h5">{strategy.name}</span>
                <span
                  onClick={() =>
                    this.setStrategyAsFilter(strategy.assignedTactics)
                  }
                >
                  filter
                </span>
                </Panel.Title>*/}
            </Panel.Heading>
            <Panel.Collapse>
              <Panel.Body>
                {isFilter ? (
                  <span>
                    {strategy.assignedTactics.map(tactic => (
                      <TacticFilter
                        tactic={tactic}
                        strategyAsFilter={strategy}
                      />
                    ))}
                  </span>
                ) : (
                  <span>
                    {strategy.assignedTactics.map(tactic => (
                      <ChooseTactic tactic={tactic} />
                    ))}
                  </span>
                )}
              </Panel.Body>
            </Panel.Collapse>
          </Panel>
        </Col>
      </span>
    );
  }
}

StrategyItem.propTypes = {
  strategy: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  pattern: state.pattern
  // strategy: state.strategy
});

export default connect(
  mapStateToProps,
  { setFilterForPatterns, setStrategyAsFilter, deselectStrategyAsFilter }
)(StrategyItem);
