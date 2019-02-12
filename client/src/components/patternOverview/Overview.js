import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Col, Tabs, Tab, Button, Glyphicon, Badge } from "react-bootstrap";
import Spinner from "../common/Spinner";
import BtnWithMouseOverPop from "../common/BtnWithMouseOverPop";
import "./Overview.css";
import PatternFeed from "./PatternFeed";
import { getPatterns, clearAllFilters } from "../../actions/patternActions";
import { getTactics } from "../../actions/tacticActions";
import StrategyFeed from "./StrategyFeed";
import SankeyDiagram from "./SankeyDiagram";
import { getStrategies } from "../../actions/strategyActions";
import Sidebar from "react-sidebar";
import { Link, withRouter } from "react-router-dom";
import NoPatternFound from "./NoPatternFound";

// Define minwidth of screen for sidebar (filter)
const mql = window.matchMedia(`(min-width: 800px)`);

class Overview extends Component {
  constructor(props) {
    super(props);
    //set initial state: opened sidebar
    this.state = {
      sidebarOpen: true,
      sidebarDocked: mql.matches,
      patternSize: 4
    };
    //bind functions
    this.mediaQueryChanged = this.mediaQueryChanged.bind(this);
    this.onSetSidebarOpen = this.onSetSidebarOpen.bind(this);
  }

  componentWillMount() {
    mql.addListener(this.mediaQueryChanged);
  }

  componentDidMount() {
    // get initial props : patterns, strategies
    this.props.getPatterns();
    this.props.getTactics();
    this.props.getStrategies();
  }

  componentWillUnmount() {
    mql.removeListener(this.mediaQueryChanged);
  }

  onSetSidebarOpen = open => {
    this.setState({ sidebarOpen: !this.state.sidebarOpen });
    if (open == true) {
      this.setState({ patternSize: 4 });
    } else {
      this.setState({ patternSize: 3 });
    }
  };

  mediaQueryChanged() {
    // dock sidebar if screensize is too small
    this.setState({ sidebarDocked: mql.matches, sidebarOpen: false });
  }

  // filter patterns according to visibilityFilters from store
  getVisiblePatterns = (patterns, filters) => {
    if (filters.length == 0) {
      // if no filters are set, take all patterns
      visiblePatterns = patterns;
    } else {
      var visiblePatterns = [];
      // check for each pattern, if assigned tactics or strategies are set as filters
      patterns.forEach(pattern => {
        pattern.assignedStrategiesWithAllTactics.forEach(strategy => {
          filters.forEach(filter => {
            if (strategy._id == filter._id) {
              strategy.assignedTactics.forEach(tactic => {
                filter.assignedTactics.forEach(tacticFilter => {
                  if (tacticFilter._id == tactic._id) {
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
    const { isDataProtectionOfficer } = this.props.auth;
    let patternContent;
    var visiblePatterns = [];
    if (patterns === null || loading) {
      // while patterns are loading, show spinner
      patternContent = <Spinner />;
    } else {
      //if patterns are loaded, filter them according to visibilityFilters from store
      visiblePatterns = this.getVisiblePatterns(
        this.props.pattern.patterns,
        this.props.pattern.visibilityFilters
      );
      patternContent = (
        <span>
          <NoPatternFound patterns={visiblePatterns} />
          <PatternFeed
            patterns={visiblePatterns}
            patternSize={this.state.patternSize}
          />{" "}
        </span>
      );
    }

    const { strategies, loading3 } = this.props.strategy;
    let strategyContent;

    if (strategies === null || loading3) {
      // while strategies are loading, display spinner
      strategyContent = <Spinner />;
    } else {
      // if strategies are loaded, display them
      strategyContent = (
        <StrategyFeed strategies={strategies} isFilter={true} />
      );
    }
    return (
      <div style={{ paddingBottom: "660px" }}>
        {/*if sidebar is open, display full filterbar, otherwise only button to open sidebar*/}
        {this.state.sidebarOpen ? (
          <Sidebar
            sidebarId="Filterbar"
            sidebar={
              <div>
                <h4 style={{ textAlign: "center" }}>
                  <span style={{ float: "left" }}>
                    <BtnWithMouseOverPop
                      icon="glyphicon glyphicon-remove"
                      title="Reset Filters"
                      link="#"
                      onClick={() => this.props.clearAllFilters()}
                    />
                  </span>
                  <span>Filter </span>
                  <Button
                    bsSize="medium"
                    style={{ float: "right" }}
                    onClick={() => this.onSetSidebarOpen(false)}
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
                marginTop: "50px",
                maxWidth: "200px",
                zIndex: "6",
                marginBottom: "60px"
              }
            }}
          />
        ) : (
          <Sidebar
            sidebarId="Filterbar"
            sidebar={
              <div>
                <h4 />
                <Button
                  bsSize="medium"
                  style={{ float: "right" }}
                  onClick={() => this.onSetSidebarOpen(true)}
                >
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
                marginTop: "50px",
                maxWidth: "35px",
                zIndex: "6",
                marginBottom: "60px"
              }
            }}
          />
        )}

        <Tabs defaultActiveKey={1} id="Select-View">
          <Tab eventKey={1} title="Grid View">
            <br />
            <Col xs={12}>
              <span className={"h4"}>
                Patterns <Badge>{visiblePatterns.length} </Badge>
              </span>{" "}
              {isDataProtectionOfficer ? (
                <span>
                  {" "}
                  <BtnWithMouseOverPop
                    icon="fas fa-plus"
                    title="Create Pattern"
                    link="#"
                    onClick={() => this.props.history.push("/create-pattern")}
                  />
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
            {<SankeyDiagram patterns={visiblePatterns} />}
          </Tab>
        </Tabs>
      </div>
    );
  }
}

// define required props
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
  { getPatterns, getTactics, getStrategies, clearAllFilters }
)(withRouter(Overview));
