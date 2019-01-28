import React, { Component } from "react";
//import ReactSankey from "react-sankey";
import { connect } from "react-redux";
import Spinner from "../common/Spinner";
import { Sankey } from "react-vis";
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

/*const createCustomNode = (chartConfig, node) => {
  return (
    <g key={node.id} transform={`translate(${node.x},${node.y})`}>
      <rect
        height={node.height}
        width={chartConfig.node.width}
        style={{
          stroke: "#ff5252",
          fill: "url(#custom-linear-gradient)",
          strokeWidth: "1px"
        }}
      />
      <text
        x={chartConfig.node.width / 2}
        y={node.height / 2}
        style={{
          fontSize: "20px",
          fill: "#b57272",
          textAnchor: "middle",
          alignmentBaseline: "central"
        }}
      >
        {`${node.title}`}
      </text>
    </g>
  );
};*/
const createNode = (title, value, id) => ({ title, value, id });
const createLink = (sourceId, targetId) => ({ sourceId, targetId });

/*const nodes = {
  "0": createNode("Brazil", 5091520, 0),
  "1": createNode("Portugal", 3967612, 1),
  "2": createNode("Spain", 3948389, 2),
  "3": createNode("England", 1974194, 3),
  "4": createNode("France", 1202, 4),
  "5": createNode("Canada", 1974184, 5),
  "6": createNode("Conversion", 348, 6),
  "7": createNode("Mexico", 3936731, 7),
  "8": createNode("USA", 1983806, 8),
  "9": createNode("Angola", 661228, 9),
  "10": createNode("Senegal", 199236, 10),
  "11": createNode("Conversion", 348, 11),
  "12": createNode("Morocco", 1983082, 12),
  "13": createNode("South Africa", 1290205, 13),
  "14": createNode("Italy", 348123, 14),
  "15": createNode("Conversion", 123, 15),
  "16": createNode("Mali", 1201, 16),
  "17": createNode("Conversion", 1302, 17),
  "18": createNode("Conversion", 1403, 18),
  "19": createNode("Conversion", 1504, 19),
  "20": createNode("Conversion", 1605, 20)
  createCustomNode(chartConfig, node1)
};*/

/*const links = [
  createLink(0, 1),
  createLink(1, 2),
  createLink(1, 7),
  createLink(1, 8),
  createLink(2, 3),
  createLink(2, 5),
  createLink(2, 16),
  createLink(3, 4),
  createLink(3, 17),
  createLink(3, 18),
  createLink(3, 19),
  createLink(3, 20),
  createLink(5, 6),
  createLink(7, 12),
  createLink(8, 9),
  createLink(8, 10),
  createLink(9, 11),
  createLink(12, 13),
  createLink(12, 14),
  createLink(13, 15)
];*/
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
  // { sourceId: 4, targetId: 5 },

  //{ sourceId: 2, targetId: 6 }
  // { sourceId: 3, targetId: 6 }
];

class SankeyDiagram extends React.Component {
  render() {
    let SankeyDiagramContent;
    const { loading } = this.props.pattern;
    const patterns = this.props.patterns;
    if (patterns === null || loading || patterns.length === 0) {
      //alert("waiting1");
      SankeyDiagramContent = <Spinner />;
    } else {
      const { strategies, loading } = this.props.strategy;

      if (strategies === null || loading || strategies.length === 0) {
        // alert("waiting2");
        SankeyDiagramContent = <Spinner />;
      } else {
        // const strategies = this.props.strategy.strategies;
        //console.log("node1[0]");
        console.log(patterns);
        /*var nodes = {
          0: {
            title: "Node 1",
            value: 20,
            id: "0"
          }
        };*/
        var nodes = [];
        var links = [
          /*
          { sourceId: 0, targetId: 1 },
          { sourceId: 0, targetId: 2 },
          { sourceId: 0, targetId: 3 },
          { sourceId: 0, targetId: 4 },
          { sourceId: 0, targetId: 5 },
          { sourceId: 0, targetId: 6 },
          { sourceId: 0, targetId: 7 },
          { sourceId: 0, targetId: 8 }*/
        ];

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
          nodes[strategyCounter] = { name: strategy.name, color: "#337ab7" };

          strategy.assignedTactics.forEach(tactic => {
            links.push({
              source: strategyCounter,
              target: tacticCounter,
              value: 10,
              color: "#ddd",
              key: strategy._id
            });
            /*nodes[tacticCounter] = {
              title: tactic.name,
              value: 5,
              id: tacticCounter.toString()
            };*/
            nodes[tacticCounter] = { name: tactic.name, color: "#337ab7" };
            console.log(nodes);
            var assignedPatterns = 0;
            var linksToPatterns = [];
            console.log("start suche tactic in pattern");
            console.log(nodes[tacticCounter].name);
            patterns.forEach(pattern => {
              console.log(pattern.name);
              //  nodes[tacticCounter + 1] = { name: pattern.name };
              pattern.assignedStrategiesWithAllTactics.forEach(
                strategyInPattern => {
                  console.log(strategyInPattern.name);
                  if (strategyInPattern.name == strategy.name) {
                    console.log("Übereinstimmung der strategies");
                    console.log(strategyInPattern.name);
                    strategyInPattern.assignedTactics.forEach(
                      tacticInPattern => {
                        console.log(
                          "durchsuchen aller tactics in der gefundenen strategie"
                        );
                        console.log(tacticInPattern.name);
                        if (tacticInPattern.name == tactic.name) {
                          console.log("Übereinstiimung der tactics");
                          console.log(tacticInPattern.name);
                          for (let index = 9; index < nodes.length; index++) {
                            console.log("Länge");
                            console.log(nodes.length);
                            console.log(index);
                            console.log(nodes[index].name);
                            if (nodes[index].name == pattern.name) {
                              console.log("gefunden in nodes");
                              linksToPatterns.push({
                                source: tacticCounter,
                                target: index,
                                color: "#ddd"
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
              links.push({
                source: tacticCounter,
                target: 0,
                value: 10,
                opacity: 0.1,
                color: "white"
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
        // var patternCounter = tacticCounter + 1;
        /*patterns.forEach(pattern => {
          nodes[patternCounter] = {
            title: pattern.name,
            value: 5,
            id: patternCounter.toString()
          };
          nodes.push({name: pattern.name})
          pattern.assignedStrategiesWithAllTactics.forEach(strategy => {
            strategy.assignedTactics.forEach(tactic => {
              for (let index = 0; index < nodes.length; index++) {
                //alert(nodes);
              //  console.log(nodes[index].title);

                console.log(tactic.name);
              //  console.log(typeof nodes[index].title);
                console.log(typeof tactic.name);
                if (nodes[index].name == tactic.name) {
                  console.log("Treffer");
                 // console.log(nodes[0].title);
                  console.log(tactic.name);
                  links.push({
                    source: Number(nodes[index].id),
                    target: patternCounter
                  });
                  index = Object.keys(nodes).length;
                }
              }
            });
          });
          patternCounter++;
        });*/
        /*  var nodes3 = nodes[0]; 
    var nodes4 = nodes[1];
    nodes = { nodes3, nodes4 };*/
        // links = links.slice(0, 2);
        /* nodes = {
        0: nodes[0],
        1: nodes[1],
        2: nodes[2]
        /*3: nodes[3],
      4: nodes[4],
      5: nodes[5],
      6: nodes[6],
      7: nodes[7],
      8: nodes[8],
      9: nodes[9],
      10: nodes[10],
      11: nodes[11],
      12: nodes[12],
      13: nodes[13]
      };*/
        // nodes.push({ name: "fake" });
        //  links.push({ source: 30, target: 52, value: 10 });
        console.log("nodes");
        console.log(nodes);

        console.log("links");
        console.log(links);
        console.log("nodes3");
        console.log(nodes3);

        console.log("links3");
        console.log(links3);
        // links = [...links, (links[38] = { source: 8, target: 35, value: 10 })];
        //console.log(nodes[0]);
        SankeyDiagramContent = (
          /*<ReactSankey
            rootID={"0"}
            nodes={nodes2}
            links={links2}
            chartConfig={chartConfig}
          />*/ <Sankey
            nodes={nodes}
            links={links}
            width={1100}
            height={1500}
            nodeWidth={20}
            //  labelRotation={10}

            onValueClick={(datapoint, event) => {
              //console.log(datapoint);
              //console.log(event);
              // alert(datapoint);
              // console.log(datapoint);
              if (datapoint.id) {
                this.props.history.push("/patterndetail/" + datapoint.id);
              }
              // does something on click
              // you can access the value of the event
            }}
            onValueMouseOver={(datapoint, event) => {
              // does something on click
              // you can access the value of the event
              // alert(datapoint);
            }}
          />
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
