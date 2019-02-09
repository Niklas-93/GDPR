import React, { Component } from "react";
import { connect } from "react-redux";
import Spinner from "../common/Spinner";
import { Sankey, Hint } from "react-vis";
import { withRouter } from "react-router-dom";

class SankeyDiagram extends React.Component {
  // Define hovered Links and Nodes
  state = {
    activeNode: null,
    activeLink: null
  };

  _renderHint() {
    const { activeNode } = this.state;
    console.log("activeNode");
    console.log(activeNode);
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
    //  hintValue[label] = activeNode.value;
    hintValue["Description"] = label;
    console.log(hintValue);
    console.log(x);
    console.log(y);
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
    if (patterns === null || loading || patterns.length === 0) {
      //alert("waiting1");
      SankeyDiagramContent = <Spinner />;
    } else {
      var strategies = this.props.strategy.strategies;
      if (this.props.pattern.visibilityFilters.length !== 0) {
        //  loading = this.props.strategy;
        strategies = this.props.pattern.visibilityFilters;
      }

      if (strategies === null || loading || strategies.length === 0) {
        // alert("waiting2");
        SankeyDiagramContent = <Spinner />;
      } else {
        var nodes = [];
        var links = [];

        var strategyCounter = 1;
        var tacticCounter = 9;
        nodes[0] = { name: "", opacity: 0.0 };
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
        strategies.forEach(strategy => {
          /* nodes[strategyCounter] = {
              title: strategy.name,
              value: 10,
              id: strategyCounter.toString()
            };*/
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
            /*nodes[tacticCounter] = {
              title: tactic.name,
              value: 5,
              id: tacticCounter.toString()
            };*/
            nodes[tacticCounter] = {
              name: tactic.name,
              color: "#337ab7",
              description: tactic.description
            };
            //   console.log(nodes);
            var assignedPatterns = 0;
            var linksToPatterns = [];
            //   console.log("start suche tactic in pattern");
            //  console.log(nodes[tacticCounter].name);
            patterns.forEach(pattern => {
              //    console.log(pattern.name);
              //  nodes[tacticCounter + 1] = { name: pattern.name };
              pattern.assignedStrategiesWithAllTactics.forEach(
                strategyInPattern => {
                  //      console.log(strategyInPattern.name);
                  if (strategyInPattern.name == strategy.name) {
                    //     console.log("Übereinstimmung der strategies");
                    //    console.log(strategyInPattern.name);
                    strategyInPattern.assignedTactics.forEach(
                      tacticInPattern => {
                        //        console.log(
                        //        "durchsuchen aller tactics in der gefundenen strategie"
                        //    );
                        //      console.log(tacticInPattern.name);
                        if (tacticInPattern.name == tactic.name) {
                          //       console.log("Übereinstiimung der tactics");
                          //     console.log(tacticInPattern.name);
                          for (let index = 9; index < nodes.length; index++) {
                            /*          console.log("Länge");
                            console.log(nodes.length);
                            console.log(index);
                            console.log(nodes[index].name);*/
                            if (nodes[index].name == pattern.name) {
                              //     console.log("gefunden in nodes");
                              linksToPatterns.push({
                                source: tacticCounter,
                                target: index,
                                color: "#ddd",
                                active: true
                                // value: 10
                              });
                              index = nodes.length;
                            }
                            // const element = array[index];
                          }
                        }
                      }
                    );
                  }
                }
              );
            });
            if (linksToPatterns.length !== 0) {
              linksToPatterns.forEach(link => {
                link.value = 10 / linksToPatterns.length;
                links.push(link);
              });
            } else {
              tacticCounter++;
              nodes[tacticCounter] = {
                name: "",
                opacity: 0.0
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
        /*links.push({
          source: 37,
          target: 15,
          value: 10
        });*/
        console.log(nodes);
        console.log(links);

        var minHeight = strategies.length * 400;
        if (strategies.length > 5) {
          minHeight = strategies.length * 300;
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
            width={900}
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
            {/*this._renderHint()*/}
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
