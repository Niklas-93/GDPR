import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Panel, Col, Tabs, Tab, Button, Collapse } from "react-bootstrap";
import { Link } from "react-router-dom";
import EditToolbar from "../common/EditToolbar";

class PatternItem extends Component {
  constructor(props, context) {
    super(props, context);
  }

  render() {
    const { pattern } = this.props;
    let patternDescriptionFirstPart = pattern.summary;

    // if summary is too long, cut it after 28 words
    if (pattern.summary.split(" ").length > 30) {
      patternDescriptionFirstPart = pattern.summary.split(" ", 28).join(" ");
      patternDescriptionFirstPart = patternDescriptionFirstPart + "...";
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
          </Panel.Heading>
          <Panel.Body className={"adjusted-PanelBody"}>
            <ul className={"StrategyListInPatterns"}>
              {pattern.assignedStrategiesWithAllTactics.map(strategy => (
                <li>
                  <span class="dotForStrategy" /> {"  " + strategy.name + "  "}
                </li>
              ))}
            </ul>
            {patternDescriptionFirstPart}
          </Panel.Body>
        </Panel>
      </Col>
    );
  }
}

PatternItem.propTypes = {
  pattern: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  {}
)(PatternItem);
