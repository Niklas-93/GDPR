import React, { Component } from "react";
import { Panel, Col, Tabs, Tab, Button, Collapse } from "react-bootstrap";
import "./PatternOverview.css";

class Overview extends Component {
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
    const open = this.state.open;
    let more;

    if (open) {
      more = <p>Less...</p>;
    } else {
      more = <p>More...</p>;
    }
    return (
      <Col xs={8} xsOffset={2}>
        <Panel>
          <Panel.Heading>
            <h3>Overview</h3>
          </Panel.Heading>
          <Panel.Body>
            <Tabs defaultActiveKey={1} id="Select-View">
              <Tab eventKey={1} title="Grid View">
                <Col xs={4}>
                  <Panel>
                    <Panel.Heading>
                      <h5>Privacy Aware Network Client</h5>
                    </Panel.Heading>
                    <Panel.Body>
                      <h6>Summary</h6>A privacy policy which is hard to
                      understand is in an automated way converted into a more
                      easy to read format.
                      <Collapse in={this.state.open}>
                        <div>
                          <h6>Context</h6>
                          This pattern is limited to the web browsing domain.
                          <h6>Problem</h6>
                          Anim pariatur cliche reprehenderit, enim eiusmod high
                          life accusamus terry richardson ad squid. Nihil anim
                          keffiyeh helvetica, craft beer labore wes anderson
                          cred nesciunt sapiente ea proident.
                        </div>
                      </Collapse>
                      <p class="extendMore" onClick={this.extendMore}>
                        {more}
                      </p>
                    </Panel.Body>
                  </Panel>
                </Col>
                <Col xs={4}>
                  <Panel>
                    <Panel.Heading>
                      <h5>Privacy Aware Network Client</h5>
                    </Panel.Heading>
                    <Panel.Body>
                      <h6>Summary</h6>A privacy policy which is hard to
                      understand is in an automated way converted into a more
                      easy to read format.
                      <Collapse in={this.state.open}>
                        <div>
                          <h6>Context</h6>
                          This pattern is limited to the web browsing domain.
                          <h6>Problem</h6>
                          Anim pariatur cliche reprehenderit, enim eiusmod high
                          life accusamus terry richardson ad squid. Nihil anim
                          keffiyeh helvetica, craft beer labore wes anderson
                          cred nesciunt sapiente ea proident.
                        </div>
                      </Collapse>
                      <p class="extendMore" onClick={this.extendMore}>
                        {more}
                      </p>
                    </Panel.Body>
                  </Panel>
                </Col>
              </Tab>
              <Tab eventKey={2} title="Diagramm View">
                Tab 2 content
              </Tab>
            </Tabs>
            ;
          </Panel.Body>
        </Panel>
      </Col>
    );
  }
}

export default Overview;
