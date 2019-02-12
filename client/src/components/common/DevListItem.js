import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import { connect } from "react-redux";
import { setAssignedDevelopers } from "../../actions/projectActions";
import {
  Panel,
  Col,
  Tabs,
  Tab,
  Button,
  Collapse,
  ListGroupItem
} from "react-bootstrap";
import store from "../../store";

class DevListItem extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      assignedDevelopers: {},
      assignedDevelopersForProject: store.getState().project.project
        .assignedDevelopers
    };

    this.onClick = this.onClick.bind(this);
  }

  componentDidMount() {
    var arr = this.state.assignedDevelopersForProject;

    if (
      arr !== undefined &&
      this.props.location.pathname !== "/create-project"
    ) {
      arr.map(el =>
        el.name === this.props.developer.name
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
    this.setState(() => {
      this.props.setAssignedDevelopers(this.props.developer);
      return {
        assignedDevelopers: this.props.developer,
        bsStyle: !this.state.bsStyle ? "info" : undefined
        //nameDeveloper: newArray[0]
      };
    });
  }

  render() {
    const { developer, auth } = this.props;

    return (
      <ListGroupItem
        onClick={this.onClick}
        name={developer.name}
        bsStyle={this.state.bsStyle}
      >
        {developer.name}
      </ListGroupItem>
    );
  }
}

DevListItem.propTypes = {
  developer: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  setAssignedDevelopers: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  assignedDevelopers: state.assignedDevelopers
  //nameDeveloper: state.nameDeveloper
});

export default connect(
  mapStateToProps,
  { setAssignedDevelopers }
)(DevListItem);
