import React, { Component } from "react";
import { Col } from "react-bootstrap";

class PatternDetail_StrategiesWithTactics extends Component {
  //displays the strategies and assigned Tactics in PatternDetail

  render() {
    //get assigned strategies and tactics as prop from patterndetail
    const { assignedStrategiesWithAllTactics } = this.props;

    return (
      <Col xs={12}>
        {assignedStrategiesWithAllTactics.map(strategy => (
          <Col xs={2}>
            <h5>
              <span class="dotForStrategy" /> {strategy.name}
            </h5>
            <ul className={"StrategyListInPatterns"}>
              {strategy.assignedTactics.map(tactic => (
                <li>
                  <span class="dotForTactic" /> {tactic.name}
                  <br />
                </li>
              ))}
            </ul>
          </Col>
        ))}
      </Col>
    );
  }
}

export default PatternDetail_StrategiesWithTactics;