import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { MenuItem, Col } from "react-bootstrap";
import "./NavigationBar.css";
import { searchInBackend } from "../../actions/generalActions";
import { AsyncTypeahead, Menu } from "react-bootstrap-typeahead";
import "react-bootstrap-typeahead/css/Typeahead.css";
import {
  setFilterForPatterns,
  setStrategyAsFilter,
  clearAllFilters,
  linkToPatternAfterSearch,
  getPattern
} from "../../actions/patternActions";

class SearchBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchString: "",
      typing: false,
      typingTimeout: 0,

      isLoading: false,
      options: [],
      query: "",
      selected: []
    };
  }

  // perform Backend search --> call backend search in generalactions
  handleSearch = query => {
    this.setState({ isLoading: true });
    this.props.searchInBackend(query);
    this.setState({
      options: this.props.general.searchResults,
      isLoading: false
    });
  };

  // handles selected searchItem
  handleSelectedSearchItem = searchItem => {
    this.setState({
      selected: undefined
    });
    var selectedItem = searchItem[0];
    if (searchItem.length != 0) {
      // is Pattern
      if (selectedItem.summary != undefined) {
        this.props.getPattern(selectedItem._id);
        this.props.history.push("/patterndetail/" + selectedItem._id);
      }
      // is Strategy
      else if (selectedItem.assignedTactics != undefined) {
        // reset all filters before setting searched strategy as filter
        this.props.clearAllFilters();
        this.props.setStrategyAsFilter(selectedItem);
        this.props.history.push("/overview");
      }
      // is Tactic
      else {
        // reset all filters before setting searched tactic as filter
        this.props.clearAllFilters();
        this.props.setFilterForPatterns(
          { name: selectedItem.name, _id: selectedItem._id },
          selectedItem.assignedStrategy
        );
        this.props.history.push("/overview/");
      }
    }
  };

  //appends different descriptions before searchItem
  differBetweenSearchresults(searchItem) {
    if (searchItem.summary !== undefined) {
      //if searchItem is pattern
      return <span className={"searchResultIndicator"}>Pattern: </span>;
    } else if (searchItem.assignedStrategy !== undefined) {
      //if searchItem is tactic
      return (
        <span className={"searchResultIndicator"}>Filter for Tactic: </span>
      );
    } else {
      //if searchItem is strategy
      return (
        <span className={"searchResultIndicator"}>Filter for Strategy: </span>
      );
    }
  }
  render() {
    const { loading, searchResults } = this.props.general;
    let searchContentBeforeTactics;
    let searchContent;
    let isLoading;
    let searchBoxContent;
    //check if searcg returned results
    if (
      searchResults === null ||
      loading ||
      Object.keys(searchResults).length === 0
    ) {
      // if no results or no search performed

      searchContent = [];
      isLoading = false;
      searchBoxContent = (
        <Col xs={8} xsOffset={2}>
          <AsyncTypeahead
            {...this.state}
            minLength={2}
            selectHintOnEnter={true}
            emptyLabel="No Results found!"
            clearButton={true}
            selected={this.state.selected}
            options={searchContent}
            labelKey="name"
            onChange={selected => this.setState({ selected })}
            onSearch={this.handleSearch}
            placeholder="Search..."
            renderMenu={(results, menuProps) => (
              <Menu {...menuProps}>
                {results.map((result, index) => (
                  <MenuItem option={result} position={index}>
                    {result.name}
                  </MenuItem>
                ))}
              </Menu>
            )}
          />
        </Col>
      );
    } else {
      // if search returned results
      searchContentBeforeTactics = searchResults.Patterns.concat(
        searchResults.Strategies
      );
      searchContent = searchContentBeforeTactics.concat(searchResults.Tactics);
      isLoading = false;
      searchBoxContent = (
        <Col xs={8} xsOffset={2}>
          <AsyncTypeahead
            {...this.state}
            clearButton={true}
            selectHintOnEnter={true}
            emptyLabel="No Results found!"
            clearButton={true}
            minLength={2}
            selected={this.state.selected}
            options={searchContent}
            labelKey="name"
            onChange={selected => this.handleSelectedSearchItem(selected)}
            onSearch={this.handleSearch}
            placeholder="Search..."
            renderMenuItemChildren={(result, menuProps, index) => (
              <MenuItem option={result} position={index}>
                {this.differBetweenSearchresults(result)}
                {result.name}
              </MenuItem>
            )}
          />
        </Col>
      );
    }

    return <div>{searchBoxContent}</div>;
  }
}

const mapStateToProps = state => ({
  general: state.general
});

export default connect(
  mapStateToProps,
  {
    searchInBackend,
    setStrategyAsFilter,
    setFilterForPatterns,
    clearAllFilters,
    linkToPatternAfterSearch,
    getPattern
  }
)(withRouter(SearchBox));
