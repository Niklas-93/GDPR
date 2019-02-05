import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  Panel,
  Col,
  Tabs,
  Tab,
  Button,
  Glyphicon,
  InputGroup,
  Badge,
  Image
} from "react-bootstrap";
import Spinner from "../common/Spinner";
//import SankeyDiagram from "../../img/SankeyDiagram.png";
import "./Overview.css";
import PatternFeed from "./PatternFeed";
import { getPatterns } from "../../actions/patternActions";
//import TacticFeed from "./TacticFeed";
import { getTactics } from "../../actions/tacticActions";
import StrategyFeed from "./StrategyFeed";
import SankeyDiagram from "./SankeyDiagram";
import { getStrategies } from "../../actions/strategyActions";
import Sidebar from "react-sidebar";
import { Link } from "react-router-dom";

const mql = window.matchMedia(`(min-width: 800px)`);

class Overview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sidebarOpen: true,
      sidebarDocked: mql.matches,
      displaySidebar: "block",
      sidebarCounter: 0
    };
    this.mediaQueryChanged = this.mediaQueryChanged.bind(this);
    this.onSetSidebarOpen = this.onSetSidebarOpen.bind(this);
    // this.hideFilterbar = this.hideFilterbar.bind(this);
  }

  componentWillMount() {
    mql.addListener(this.mediaQueryChanged);
  }

  componentDidMount() {
    this.props.getPatterns();
    this.props.getTactics();
    this.props.getStrategies();
  }

  componentWillUnmount() {
    mql.removeListener(this.mediaQueryChanged);
  }

  onSetSidebarOpen = () => {
    //alert("hallo");
    this.setState({ sidebarOpen: !this.state.sidebarOpen });
  };

  mediaQueryChanged() {
    this.setState({ sidebarDocked: mql.matches, sidebarOpen: false });
  }

  /*hideFilterbar = () => {
    alert("hallo");
    this.setState({
      displaySidebar: "none"
    });
  };

  hideFilterbar() {
    alert("hallo");
    this.setState({
      displaySidebar: "none"
    });
  }
*/
  onSelect() {
    alert("hallo");
    this.setState({
      displaySidebar: "none"
    });
  }

  handleSelect = key => {
    //alert(key);
    if (this.state.sidebarCounter === 1) {
      this.setState({
        displaySidebar: "block",
        sidebarCounter: 0
      });
    } else {
      this.setState({
        displaySidebar: "none",
        sidebarCounter: 1
      });
    }
  };

  getVisiblePatterns = (patterns, filters) => {
    if (filters.length == 0) {
      visiblePatterns = patterns;
    } else {
      var visiblePatterns = [];
      patterns.forEach(pattern => {
        pattern.assignedStrategiesWithAllTactics.forEach(strategy => {
          filters.forEach(filter => {
            if (strategy._id == filter._id) {
              strategy.assignedTactics.forEach(tactic => {
                filter.assignedTactics.forEach(tacticFilter => {
                  if (tacticFilter._id == tactic._id) {
                    //visiblePatterns.push(pattern);
                    const alreadyIncluded = visiblePatterns.filter(
                      visiblePattern => visiblePattern.name == pattern.name
                    );
                    if (alreadyIncluded.length == 0) {
                      visiblePatterns = visiblePatterns.concat(
                        patterns.filter(
                          patternFilter => patternFilter._id == pattern._id
                        )
                      );
                    }
                    return;
                  }
                });
                return;
              });
              return;
            }
          });
          return;
        });
        return;
      });
    }
    return visiblePatterns;
  };
  render() {
    const { patterns, loading } = this.props.pattern;
    //console.log(patterns);
    const { isAuthenticated } = this.props.auth;
    let patternContent;
    var visiblePatterns = [];
    if (patterns === null || loading) {
      patternContent = <Spinner />;
    } else {
      visiblePatterns = this.getVisiblePatterns(
        this.props.pattern.patterns,
        this.props.pattern.visibilityFilters
      );
      //visiblePatterns = this.props.pattern.patterns;
      patternContent = <PatternFeed patterns={visiblePatterns} />;
    }
    //alert(visiblePatterns);
    /*const { tactics, loading2 } = this.props.tactic;
    let tacticContent;

    if (tactics === null || loading2) {
      tacticContent = <Spinner />;
    } else {
    }*/

    const { strategies, loading3 } = this.props.strategy;
    let strategyContent;

    if (strategies === null || loading3) {
      strategyContent = <Spinner />;
    } else {
      // console.log("strategyinOverview");
      // console.log(strategies);
      strategyContent = (
        <StrategyFeed strategies={strategies} isFilter={true} />
      );
    }
    return (
      <div style={{ paddingBottom: "660px" }}>
        {this.state.sidebarOpen ? (
          <Sidebar
            sidebarId="Filterbar"
            sidebar={
              <div>
                <h4 style={{ textAlign: "center" }}>
                  Filter{" "}
                  <Button
                    bsSize="small"
                    style={{ float: "right" }}
                    onClick={() => this.onSetSidebarOpen()}
                  >
                    <Glyphicon glyph="resize-small" />
                  </Button>
                </h4>
                <br />

                {strategyContent}
              </div>
            }
            open={this.state.sidebarOpen}
            docked={true}
            pullRight={true}
            onSetOpen={this.onSetSidebarOpen}
            styles={{
              overlay: {
                zIndex: -1
              },
              sidebar: {
                background: "white",
                position: "fixed",
                marginTop: "52px",
                //display: this.state.displaySidebar,
                maxWidth: "200px"
              }
            }}
          />
        ) : (
          <Sidebar
            sidebarId="Filterbar"
            sidebar={
              <div>
                <h4 />
                <Button bsSize="small" onClick={() => this.onSetSidebarOpen()}>
                  <Glyphicon glyph="resize-full" />
                </Button>
              </div>
            }
            open={this.state.sidebarOpen}
            docked={true}
            pullRight={true}
            onSetOpen={this.onSetSidebarOpen}
            styles={{
              sidebar: {
                background: "white",
                position: "fixed",
                marginTop: "52px",
                //display: this.state.displaySidebar,
                maxWidth: "35px"
              }
            }}
          />
        )}

        <Tabs
          defaultActiveKey={1}
          id="Select-View"
          onSelect={() => this.handleSelect()}
        >
          <Tab eventKey={1} title="Grid View">
            <br />
            <Col xs={12}>
              <span className={"h4"}>
                Patterns <Badge>{visiblePatterns.length}</Badge>
              </span>
              {isAuthenticated ? (
                <span>
                  <Link to="/create-pattern">
                    <Button className={"glyphicon-button"}>
                      <Glyphicon glyph="plus" />
                    </Button>
                  </Link>
                  <Link to="/strategyoverview" style={{ marginLeft: "450px" }}>
                    Manage Strategies and Tactics...
                  </Link>
                </span>
              ) : (
                <span />
              )}
            </Col>
            <br />
            <br />
            <br />
            {patternContent}
          </Tab>
          <Tab eventKey={2} title="Diagram View">
            <SankeyDiagram patterns={visiblePatterns} />
          </Tab>
        </Tabs>
      </div>
    );
  }
}

Overview.propTypes = {
  getPatterns: PropTypes.func.isRequired,
  pattern: PropTypes.object.isRequired,
  getTactics: PropTypes.func.isRequired,
  tactic: PropTypes.object.isRequired,
  getStrategies: PropTypes.func.isRequired,
  strategy: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  pattern: state.pattern,
  tactic: state.tactic,
  strategy: state.strategy,
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { getPatterns, getTactics, getStrategies }
)(Overview);
