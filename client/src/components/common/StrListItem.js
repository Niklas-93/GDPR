import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import { connect } from "react-redux";
import { setAssignedStrategies } from "../../actions/projectActions";
import {
  Panel,
  Row,
  Col,
  Tabs,
  Tab,
  Button,
  Collapse,
  ListGroupItem
} from "react-bootstrap";
import store from "../../store";

class StrListItem extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      assignedStrategies: {},
      assignedStrategiesForProject: store.getState().project.project
        .assignedStrategies
      //nameDeveloper: ""
    };

    this.onClick = this.onClick.bind(this);
  }

  componentDidMount() {
    var arr = this.state.assignedStrategiesForProject;

    if (
      arr !== undefined &&
      this.props.location.pathname !== "/create-project"
    ) {
      arr.map(el =>
        el.name === this.props.strategy.name
          ? this.setState(() => {
              return {
                bsStyle: !this.state.bsStyle ? "info" : undefined
              };
            })
          : ""
      );
    }
  }

  onClick(e) {
    var arr = this.state.assignedStrategiesForProject;

    if (
      arr !== undefined &&
      this.props.location.pathname !== "/create-project"
    ) {
      function createNameArray(array) {
        var tempArr = [];

        //console.log(array.assignedTactics);

        for (var i = 0; i < array.assignedTactics.length; i++) {
          tempArr.push(array.assignedTactics[i].name);
        }
        return tempArr;
      }
      /*
      while (
        createNameArray(this.props.strategy).indexOf(
          this.props.finishedTactics[i] === -1
        )
      ) {
        if (
          createNameArray(this.props.strategy).indexOf(
            this.props.finishedTactics[i]
          ) !== -1
        ) {
          alert("You can't deselect the Strategy with finished tactics");
        } else {
          this.props.setAssignedStrategies(this.props.strategy);
          this.setState(() => {
            return {
              assignedStrategies: this.props.strategy,
              bsStyle: !this.state.bsStyle ? "info" : undefined
            };
          });

          this.setState({
            assignedStrategies: this.props.assignedStrategies
          });
        }
      }
      */

      var indArr = [];

      for (var i = 0; i < this.props.finishedTactics.length; i++) {
        //console.log(
        //  createNameArray(this.props.strategy).indexOf(
        //    this.props.finishedTactics[i]
        //  )
        //);
        //console.log(createNameArray(this.props.strategy));

        //console.log(this.props.finishedTactics[i]);

        var ind = createNameArray(this.props.strategy).indexOf(
          this.props.finishedTactics[i]
        );

        indArr.push(ind);
      }

      //console.log(Math.max(...indArr));

      if (Math.max(...indArr) >= 0) {
        alert("You can't deselect the Strategy with finished tactics");
      } else {
        this.props.setAssignedStrategies(this.props.strategy);
        this.setState(() => {
          return {
            assignedStrategies: this.props.strategy,
            bsStyle: !this.state.bsStyle ? "info" : undefined
          };
        });

        this.setState({
          assignedStrategies: this.props.assignedStrategies
        });
      }
    } else {
      this.props.setAssignedStrategies(this.props.strategy);
      this.setState(() => {
        return {
          assignedStrategies: this.props.strategy,
          bsStyle: !this.state.bsStyle ? "info" : undefined
        };
      });

      this.setState({ assignedStrategies: this.props.assignedStrategies });
    }
  }

  render() {
    // if (this.props.assignedStrategies != undefined) {
    //console.log(this.props.strategy);

    //}

    const { strategy, auth } = this.props;

    return (
      <Row>
        <Col xs={10}>
          <ListGroupItem
            onClick={this.onClick}
            name={strategy.name}
            bsStyle={this.state.bsStyle}
          >
            {strategy.name}
          </ListGroupItem>
        </Col>
        <Col xs={2} className={strategy.name} />
      </Row>
    );
  }
}

StrListItem.propTypes = {
  strategy: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  setAssignedStrategies: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  assignedStrategies: state.assignedStrategies,
  finishedTactics: state.project.finishedTactics
  //nameDeveloper: state.nameDeveloper
});

export default connect(
  mapStateToProps,
  { setAssignedStrategies }
)(StrListItem);
