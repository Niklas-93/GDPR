import React, { Component } from "react";
import { connect } from "react-redux";
import Spinner from "../common/Spinner";
import { Sankey, Hint } from "react-vis";
import { withRouter } from "react-router-dom";
import "./SankeyDiagram.css";

class SankeyDiagram extends React.Component {
  // Define hovered Links and Nodes
  state = {
    activeNode: null,
    activeLink: null
  };

  // Set Tooltip (Hint) if strategy/tactic is hovered
  _renderHint() {
    const { activeNode } = this.state;

    if (activeNode === null || activeNode.isPattern == true) {
      return null;
    }

    // calculate x, y position of hint
    var x;
    var y;
    if (activeNode.index < 9) {
      x = activeNode.x1 - 50;
      y = activeNode.y1 - 300;
    } else {
      x = activeNode.x1 - 31;
      y = activeNode.y1 - 100;
    }
    const hintValue = {};
    const label = `${activeNode.description}`;
    hintValue["Description"] = label;

    return (
      <Hint
        x={x}
        y={y}
        value={hintValue}
        style={{
          background: "#337ab7",
          color: "white",
          padding: "10px 10px 10px 10px",
          borderRadius: "10px"
        }}
      />
    );
  }

  render() {
    let SankeyDiagramContent;
    const { loading } = this.props.pattern;
    const patterns = this.props.patterns;
    if (patterns === null || loading) {
      //if patterns are loading, show spinner
      SankeyDiagramContent = <Spinner />;
    } else {
      // if patterns are loaded
      var strategies = this.props.strategy.strategies;
      if (this.props.pattern.visibilityFilters.length !== 0) {
        strategies = this.props.pattern.visibilityFilters;
      }

      if (strategies === null || loading) {
        //if strategies are loading, show spinner
        SankeyDiagramContent = <Spinner />;
      } else {
        // if strategies are loaded

        //Define initial nodes and links
        var nodes = [];
        var links = [];

        var strategyCounter = 1;
        var tacticCounter = 9;
        nodes[0] = { name: "", opacity: 0.0 };
        // insert all filtered patterns in nodes
        patterns.forEach(pattern => {
          nodes[tacticCounter] = {
            name: pattern.name,
            color: "#337ab7",
            id: pattern._id,
            key: pattern._id,
            isPattern: true
          };
          tacticCounter++;
        });
        // watch for each strategy if assigned tactics match inserted patterns
        strategies.forEach(strategy => {
          nodes[strategyCounter] = {
            name: strategy.name,
            color: "#337ab7",
            description: strategy.description
          };

          strategy.assignedTactics.forEach(tactic => {
            links.push({
              source: strategyCounter,
              target: tacticCounter,
              value: 10,
              color: "#ddd",
              key: strategy._id,
              active: true
            });

            nodes[tacticCounter] = {
              name: tactic.name,
              color: "#337ab7",
              description: tactic.description
            };
            // variable for links to Patterns
            var linksToPatterns = [];

            // check assigned patterns for tactic
            patterns.forEach(pattern => {
              pattern.assignedStrategiesWithAllTactics.forEach(
                strategyInPattern => {
                  if (strategyInPattern.name == strategy.name) {
                    strategyInPattern.assignedTactics.forEach(
                      tacticInPattern => {
                        if (tacticInPattern.name == tactic.name) {
                          for (let index = 9; index < nodes.length; index++) {
                            if (nodes[index].name == pattern.name) {
                              linksToPatterns.push({
                                source: tacticCounter,
                                target: index,
                                color: "#ddd",
                                active: true
                              });
                              index = nodes.length;
                            }
                          }
                        }
                      }
                    );
                  }
                }
              );
            });
            if (linksToPatterns.length !== 0) {
              // if tactic has assigned patterns
              linksToPatterns.forEach(link => {
                link.value = 10 / linksToPatterns.length;
                links.push(link);
              });
            } else {
              tacticCounter++;
              // if tactic has no link to any pattern --> insert fake link to hidden fake pattern
              nodes[tacticCounter] = {
                name: "",
                opacity: 0.0,
                isPattern: true
              };
              links.push({
                source: tacticCounter - 1,
                target: tacticCounter,
                value: 10,
                opacity: 0.1,
                color: "white",
                active: false
              });
            }

            tacticCounter++;
          });

          strategyCounter++;
        });
        // Define minHeight of Sankey
        var minHeight = strategies.length * 500;
        if (strategies.length > 5) {
          minHeight = strategies.length * 500;
        }
        const { activeLink } = this.state;

        // set high opacity for hovered links
        links = links.map((d, i) => ({
          ...d,
          opacity:
            activeLink && i === activeLink.index && activeLink.active
              ? 0.9
              : 0.3
        }));
        let hintContent;
        hintContent = this._renderHint();
        SankeyDiagramContent = (
          <Sankey
            layout={200}
            style={{ zIndex: 0 }}
            nodes={nodes}
            links={links}
            width={1000}
            height={minHeight}
            nodeWidth={20}
            onValueClick={(datapoint, event) => {
              // onClick on pattern (id exists), forward to detailpage
              if (datapoint.id) {
                this.props.history.push("/patterndetail/" + datapoint.id);
              }
            }}
            // Set ToolTip for Nodes (strategies and Tactics)
            onValueMouseOver={node => this.setState({ activeNode: node })}
            onValueMouseOut={node => this.setState({ activeNode: null })}
            //Set hover effect for links
            onLinkMouseOver={node => this.setState({ activeLink: node })}
            onLinkMouseOut={() => this.setState({ activeLink: null })}
          >
            {hintContent}
          </Sankey>
        );
      }
    }

    return (
      <div style={{ zIndex: "5", position: "relative" }}>
        {SankeyDiagramContent}
      </div>
    );
  }
}
const mapStateToProps = state => ({
  auth: state.auth,
  pattern: state.pattern,
  strategy: state.strategy
});

export default connect(
  mapStateToProps,
  {}
)(withRouter(SankeyDiagram));
