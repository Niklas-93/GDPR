import React, { Component } from "react";
import { Col, Panel } from "react-bootstrap";

class PatternDetail_StrategiesWithTactics extends Component {
  //displays the strategies and assigned Tactics in PatternDetail

  render() {
    //get assigned strategies and tactics as prop from patterndetail
    const { assignedStrategiesWithAllTactics } = this.props;

    return (
      <Col xs={12}>
        {assignedStrategiesWithAllTactics.map(strategy => (
          <Col xs={3}>
            <Panel>
              <Panel.Heading>
                <span class="dotForStrategy" /> {strategy.name}
              </Panel.Heading>
              <Panel.Body className={"TacticsBody"}>
                <ul className={"StrategyListInPatterns"}>
                  {strategy.assignedTactics.map(tactic => (
                    <li>
                      <span class="dotForTactic" /> {tactic.name}
                      <br />
                    </li>
                  ))}
                </ul>
              </Panel.Body>
            </Panel>
          </Col>
        ))}
      </Col>
    );
  }
}

export default PatternDetail_StrategiesWithTactics;
