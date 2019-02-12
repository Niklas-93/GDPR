import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Panel, Col } from "react-bootstrap";
import {
  setFilterForPatterns,
  setStrategyAsFilter,
  deselectStrategyAsFilter
} from "../../actions/patternActions";
import TacticFilter from "./TacticFilter";
import ChooseTactic from "../patternDetail/ChooseTactic";

class StrategyItem extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      expanded: false
    };
  }

  // checks expanded status of strategy
  componentWillReceiveProps(nextProps) {
    const vizFilters = nextProps.pattern.visibilityFilters;
    if (vizFilters.length == 0) {
    } else {
      var filters = vizFilters.filter(
        visibilityFilter => visibilityFilter._id == nextProps.strategy._id
      );
      if (filters.length !== 0) {
        this.setState({
          expanded: true
        });
      }
    }
  }

  setStrategyAsFilter = strategy => {
    this.props.setStrategyAsFilter(strategy);
  };

  deselectStrategyAsFilter = strategy => {
    this.props.deselectStrategyAsFilter(strategy);
  };

  // expands and collapses strategypanel on click
  handleExpand() {
    this.setState({ expanded: !this.state.expanded });
  }

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
            <Panel.Title
              toggle
              className={"inline Abstract"}
              id="Abstract"
              onClick={() => this.handleExpand()}
            >
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
                <Panel.Title
                  toggle
                  className={"inline"}
                  onClick={() => this.handleExpand()}
                >
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
          } else {
            // if not all tactis are set as filters
            strategyHeading = (
              <span>
                <Panel.Title
                  toggle
                  className={"inline"}
                  onClick={() => this.handleExpand()}
                >
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
        } else {
          // if no tactic of actual strategy is set as filter
          strategyHeading = (
            <span>
              <Panel.Title
                toggle
                className={"inline"}
                onClick={() => this.handleExpand()}
              >
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
        <Panel.Title toggle onClick={() => this.handleExpand()}>
          <span class="h5">{strategy.name}</span>
        </Panel.Title>
      );
      cssClassesofStrategyPanel = "";
    }
    return (
      <span>
        <Col xs={isFilter ? 12 : 12}>
          <Panel
            id={strategy.name}
            className={cssClassesofStrategyPanel}
            expanded={this.state.expanded}
          >
            <Panel.Heading>{strategyHeading}</Panel.Heading>
            <Panel.Collapse className={strategy.name}>
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
});

export default connect(
  mapStateToProps,
  { setFilterForPatterns, setStrategyAsFilter, deselectStrategyAsFilter }
)(StrategyItem);
