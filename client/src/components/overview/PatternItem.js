import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Panel, Col, Tabs, Tab, Button, Collapse } from "react-bootstrap";
import { Link } from "react-router-dom";
import EditToolbar from "../common/EditToolbar";

class PatternItem extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      open: false
    };
  }
  extendMore = () => {
    this.setState({ open: !this.state.open });
  };

  render() {
    const { pattern, auth } = this.props;
    //alert(typeof pattern);
    const open = this.state.open;
    let more;
    let patternDescriptionFirstPart = pattern.summary;
    if (pattern.summary.split(" ").length > 30) {
      patternDescriptionFirstPart = pattern.summary.split(" ", 28).join(" ");
      patternDescriptionFirstPart = patternDescriptionFirstPart + "...";
    }
    //let patternDescriptionFirstPart = pattern.summary.split(" ", 30).join(" ");
    let patternDescriptionSecondPart = pattern.summary.substring(
      patternDescriptionFirstPart.length
    );
    if (open) {
      more = <p>Less...</p>;
    } else {
      more = <p>More...</p>;
    }

    return (
      <Col xs={4}>
        <Panel className={"minHeightPatternPanel"}>
          <Panel.Heading
            style={{ textAlign: "center" }}
            className="minHeightPatternPanelHeading"
          >
            <div className={"inline-flex"}>
              <Link
                to={{
                  pathname: "/patterndetail/" + pattern._id,
                  state: { pattern }
                }}
              >
                <div className={"h4"}>{pattern.name}</div>
              </Link>
            </div>

            {/*<div>
              {pattern.assignedTactics.map(tactic => (
                <span>{tactic.name} </span>
              ))}
              </div>*/}
          </Panel.Heading>
          <Panel.Body className={"adjusted-PanelBody"}>
            {/*patternDescriptionFirstPart*/}
            <ul className={"StrategyListInPatterns"}>
              {pattern.assignedStrategiesWithAllTactics.map(strategy => (
                <li>
                  <span class="dotForStrategy" /> {"  " + strategy.name + "  "}
                </li>
              ))}
            </ul>
            {patternDescriptionFirstPart}
            {/*<Collapse in={this.state.open}>
              <div>
                patternDescriptionSecondPart
                {pattern.context}
                {pattern.problem}
                {pattern.forcesConcerns}
                {pattern.solution}
                {pattern.structure}
                {pattern.implementation}
                {pattern.consequences}
                {pattern.liabilities}
                {pattern.examples}
                {pattern.relatedPatterns}
                {pattern.sources}
                {pattern.knownUses}
              </div>
            </Collapse>*/}
            {/*<Link
              to={{
                pathname: "/patterndetail/" + pattern._id,
                state: { pattern }
              }}
            >
              <div className={"h4"}>More...</div>
            </Link>*/}
            {/*<div className="extendMore" onClick={this.extendMore}>
              {more}
              </div>*/}
          </Panel.Body>
        </Panel>
      </Col>
    );
  }
}

PatternItem.propTypes = {
  pattern: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  {}
)(PatternItem);
