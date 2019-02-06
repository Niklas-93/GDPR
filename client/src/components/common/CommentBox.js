import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter, Link } from "react-router-dom";
import { setComment } from "../../actions/projectActions";
import {
  Panel,
  Button,
  FormGroup,
  InputGroup,
  FormControl
} from "react-bootstrap";
import store from "../../store";

import TextAreaField from "../common/TextAreaField";
import "./CommentBox.css";

class CommentBox extends Component {
  constructor() {
    super();
    this.state = {
      comment: {
        author: {},
        content: ""
      },
      empty: "",

      errors: {}
    };

    this.convertDate = this.convertDate.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.correctX = this.correctX.bind(this);
    this.onClickRemove = this.onClickRemove.bind(this);
    this.updateScroll = this.updateScroll.bind(this);
  }

  onClickRemove(commentId) {
    const commentData = {
      id: this.props.match.params.id,
      comment: this.state.comment,
      comments: store.getState().project.comment,
      commentId: commentId,
      delete: true
    };

    this.props.setComment(commentData);
  }

  correctX(comment, x) {
    var index;
    var tempArrAtt = [];
    var tempArrCom = [];

    if (this.props.project.commentAttendees) {
      for (var i = 0; i < this.props.project.commentAttendees.length; i++) {
        tempArrAtt.push(this.props.project.commentAttendees[i]._id);
      }
    }

    if (this.props.project.comment) {
      for (var i = 0; i < this.props.project.comment.length; i++) {
        tempArrCom.push(this.props.project.comment[i].author);
      }
    }

    if (this.props.project.commentAttendees) {
      if (
        this.props.project.commentAttendees.length === 0 ||
        comment.author === this.props.auth.user.id
      ) {
        if (x === "name") {
          return this.props.auth.user.name;
        } else {
          return this.props.auth.user.role;
        }
      }

      index = tempArrAtt.indexOf(comment.author);

      if (x === "name") {
        return this.props.project.commentAttendees[index].name;
      } else {
        return this.props.project.commentAttendees[index].role;
      }
    }
  }

  componentDidMount() {
    setTimeout(() => {
      this.updateScroll();
    }, 1000);
  }

  /*componentDidUpdate() {
    setTimeout(() => {
      this.setState({ state: this.state });
    }, 1000);
  }*/

  convertDate(isoDate) {
    const date = new Date(isoDate);
    const hour = date.getUTCHours();
    const minute = date.getUTCMinutes();
    const DMY = date.toDateString();

    return (
      (hour < 10 ? "0" + hour : hour) +
      ":" +
      (minute < 10 ? "0" + minute : minute) +
      ", " +
      DMY
    );
  }

  onChange(e) {
    this.setState({
      comment: {
        author: this.props.auth.user.id,
        content: e.target.value
      }
    });
  }

  onSubmit(e) {
    e.preventDefault();

    const commentData = {
      id: this.props.match.params.id,
      comment: this.state.comment,
      delete: false
    };

    //console.log(commentData);

    //console.log(editedProject);

    this.props.setComment(commentData);

    this.setState({
      comment: {
        author: this.props.auth.user.id,
        content: ""
      }
    });
    setTimeout(() => {
      this.updateScroll();
    }, 250);
    //this.props.editProject(commentData);
  }

  updateScroll() {
    var element = document.getElementsByClassName("chatBox")[0];
    if (element) {
      element.scrollTop = element.scrollHeight;
    }
  }

  render() {
    //console.log(this.props.match.params.id);
    //console.log(this.state.comment);

    {
      setTimeout(() => {
        this.updateScroll();
      }, 500);
    }

    return (
      <div>
        <Panel>
          <Panel.Heading>
            <Panel.Title componentClass="h3">
              Comment Box{" "}
              <Button
                onClick={() =>
                  this.props.getProject(this.props.match.params.id)
                }
              >
                <i className="fas fa-sync" />
              </Button>
            </Panel.Title>
          </Panel.Heading>
          <Panel.Body id="commentBox">
            <div className="chatBox">
              {this.props.comment
                ? this.props.comment.length !== 0
                  ? this.props.comment.map(comment => (
                      <div key={comment._id}>
                        {this.convertDate(comment.date)},{" "}
                        {this.correctX(comment, "name")},{" "}
                        {this.correctX(comment, "role")}{" "}
                        {this.props.auth.user.id === comment.author ? (
                          <Button
                            bsSize="small"
                            onClick={() => this.onClickRemove(comment._id)}
                          >
                            <i className="far fa-trash-alt" />
                          </Button>
                        ) : (
                          ""
                        )}
                        <Panel>
                          <Panel.Body className="shownText">
                            {comment.content}
                          </Panel.Body>
                        </Panel>
                      </div>
                    ))
                  : ""
                : ""}
            </div>

            <TextAreaField
              name="content"
              placeholder="Enter your comment"
              onChange={this.onChange}
              location={this.props.location}
              onSubmit={
                this.state.comment.content !== ""
                  ? this.onSubmit
                  : () => alert("You can't send a empty message")
              }
              value={this.state.comment.content}
            />
          </Panel.Body>
        </Panel>
      </div>
    );
  }
}

CommentBox.propTypes = {
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors,
  comment: state.project.comment
});

export default connect(
  mapStateToProps,
  {
    setComment
  }
)(withRouter(CommentBox));
