import React, { Component } from "react";
//import ReactSankey from "react-sankey";
import { connect } from "react-redux";
import Spinner from "../common/Spinner";
import { Sankey, Hint } from "react-vis";
import { withRouter } from "react-router-dom";

const nodes3 = [
  { name: "s1" },
  { name: "s2" },
  { name: "t1" },
  { name: "t2" },
  { name: "p1" },
  { name: "p2" }
];
const links3 = [
  { source: 2, target: 4, value: 10 },
  { source: 3, target: 4, value: 10 },
  { source: 1, target: 3, value: 10 },
  // { source: 3, target: 5, value: 10 },
  { source: 0, target: 2, value: 10 },
  // { source: 2, target: 4, value: 20 },
  { source: 0, target: 3, value: 10 }
  //{ source: 1, target: 2, value: 20 }
];

const createNode = (title, value, id) => ({ title, value, id });
const createLink = (sourceId, targetId) => ({ sourceId, targetId });

const nodes2 = {
  0: {
    title: "Node 0",
    value: 10,
    id: "0"
  },
  1: {
    title: "S 1",
    value: 9,
    id: "1"
  },
  2: {
    title: "S 2",
    value: 8,
    id: "2"
  },
  3: {
    title: "T 3",
    value: 7,
    id: "3"
  },
  4: {
    title: "T 4",
    value: 3,
    id: "4"
  },
  5: {
    title: "P 5",
    value: 3,
    id: "5"
  },
  6: {
    title: "P 6",
    value: 3,
    id: "6"
  }
};
const links2 = [
  { sourceId: 0, targetId: 1 },
  { sourceId: 0, targetId: 2 },
  { sourceId: 1, targetId: 3 },
  { sourceId: 2, targetId: 4 },
  { sourceId: 3, targetId: 5 },
  { sourceId: 4, targetId: 5 }
];

class SankeyDiagram extends React.Component {
  state = {
    activeNode: null,
    activeLink: null
  };
  _renderHint() {
    const { activeNode } = this.state;
    console.log("activeNode");
    console.log(activeNode);
    if (activeNode === null) {
      return null;
    }

    // calculate center x,y position of link for positioning of hint
    const x = activeNode.x1 + (activeNode.x0 - activeNode.x1) / 2;
    const y = activeNode.y0 - (activeNode.y0 - activeNode.y1) / 2;

    const hintValue = {};
    const label = `${activeNode.description}`;
    //  hintValue[label] = activeNode.value;
    hintValue["Description"] = label;
    console.log(hintValue);
    console.log(x);
    console.log(y);

    /* console.log("hintlabel");
    console.log(hintValue);
    let hintValue2;
    hintValue2 = hintValue.slice(0, -3);*/
    return (
      <Hint
        x={x}
        y={y}
        value={hintValue}
        style={{
          background: "#337ab7",
          color: "white",
          padding: "10px 10px 10px 10px"
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
            key: pattern._id
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
        links = links.map((d, i) => ({
          ...d,
          opacity:
            activeLink && i === activeLink.index && activeLink.active
              ? 0.9
              : 0.3
        }));

        SankeyDiagramContent = (
          <Sankey
            layout={200}
            style={{ zIndex: 0 }}
            nodes={nodes}
            links={links}
            width={900}
            height={minHeight}
            nodeWidth={20}
            //  labelRotation={10}

            onValueClick={(datapoint, event) => {
              //console.log(datapoint);

              if (datapoint.id) {
                this.props.history.push("/patterndetail/" + datapoint.id);
              }
            }}
            onValueMouseOver={node => this.setState({ activeNode: node })}
            onValueMouseOut={node => this.setState({ activeNode: null })}
            onLinkMouseOver={node => this.setState({ activeLink: node })}
            onLinkMouseOut={() => this.setState({ activeLink: null })}
          >
            {this._renderHint()}
          </Sankey>
        );
      }
    }
    //console.log(strategies);

    return <div>{SankeyDiagramContent}</div>;

    //return <div />;
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
