import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import {
  FormGroup,
  FormControl,
  Dropdown,
  CustomMenu,
  CustomToggle,
  MenuItem,
  Col
} from "react-bootstrap";
import "./NavigationBar.css";
import { searchInBackend } from "../../actions/generalActions";
import Spinner from "../common/Spinner";
import ResultList from "./ResultList";
import {
  AsyncTypeahead,
  GithubMenuItem,
  makeAndHandleRequest,
  PER_PAGE,
  Menu
} from "react-bootstrap-typeahead";
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
    this.search = this.search.bind(this);
  }

  _cache = {};

  search = event => {
    const self = this;
    if (self.state.typingTimeout) {
      clearTimeout(self.state.typingTimeout);
    }

    self.setState({
      searchString: event.target.value,
      typing: false,
      typingTimeout: setTimeout(function() {
        self.props.searchInBackend(self.state.searchString);
      }, 1000)
    });
  };

  _handleInputChange = query => {
    this.setState({ query });
  };

  _handlePagination = (e, shownResults) => {
    const { query } = this.state;
    const cachedQuery = this._cache[query];

    // Don't make another request if:
    // - the cached results exceed the shown results
    // - we've already fetched all possible results
    if (
      cachedQuery.options.length > shownResults ||
      cachedQuery.options.length === cachedQuery.total_count
    ) {
      return;
    }

    this.setState({ isLoading: true });

    const page = cachedQuery.page + 1;

    makeAndHandleRequest(query, page).then(resp => {
      const options = cachedQuery.options.concat(resp.options);
      this._cache[query] = { ...cachedQuery, options, page };
      this.setState({
        isLoading: false,
        options
      });
    });
  };

  _handleSearch = query => {
    if (this._cache[query]) {
      this.setState({ options: this._cache[query].options });
      return;
    }

    this.setState({ isLoading: true });
    makeAndHandleRequest(query).then(resp => {
      this._cache[query] = { ...resp, page: 1 };
      this.setState({
        isLoading: false,
        options: resp.options
      });
    });
  };

  __handleSearch = query => {
    console.log("query");
    console.log(query);
    this.setState({ isLoading: true });
    this.props.searchInBackend(query);
    this.setState({
      options: this.props.general.searchResults,
      isLoading: false
    });

    //this.search();
    // makeAndHandleRequest(query).then(({ options }) => {

    // });
  };
  componentWillReceiveProps() {
    /* this.setState({
      isLoading: false,
      options: this.props.general.searchResults
    });*/
  }

  handleSelectedSearchItem2 = searchItem => {
    // this.setState({ selected: searchItem }, alert(searchItem));

    console.log("searchItem");
    console.log(searchItem);
    console.log(this.props.history);
    const selectedItem = searchItem[0];
    console.log("sel");
    console.log(selectedItem);
    if (searchItem.length != 0) {
      // is Pattern
      if (selectedItem.summary != undefined) {
        //this.props.linkToPatternAfterSearch(selectedItem);
        this.props.getPattern(selectedItem._id);
        this.props.history.push("/patterndetail/" + selectedItem._id);
      }
      // is Strategy
      else if (selectedItem.assignedTactics != undefined) {
        alert("2");
        this.props.clearAllFilters();
        this.props.setStrategyAsFilter(selectedItem);
        this.props.history.push("/overview");
      }
      // is Tactic
      else {
        alert("3");
        this.props.clearAllFilters();
        this.props.setFilterForPatterns(selectedItem.name);
        this.props.history.push("/overview");
      }
    }
  };

  handleSelectedSearchItem = searchItem => {
    // this.setState({ selected: searchItem }, alert(searchItem));
    this.setState({
      selected: undefined
    });
    console.log("searchItem");
    // console.log(searchItem);
    console.log(this.props.history);
    //const selectedItem = searchItem[0];
    console.log("sel");
    console.log(selectedItem);
    var selectedItem = searchItem[0];
    if (searchItem.length != 0) {
      // is Pattern
      if (selectedItem.summary != undefined) {
        //this.props.linkToPatternAfterSearch(selectedItem);
        this.props.getPattern(selectedItem._id);
        this.props.history.push("/patterndetail/" + selectedItem._id);
      }
      // is Strategy
      else if (selectedItem.assignedTactics != undefined) {
        // alert("2");
        this.props.clearAllFilters();
        this.props.setStrategyAsFilter(selectedItem);
        this.props.history.push("/overview");
      }
      // is Tactic
      else {
        // alert("3");
        this.props.clearAllFilters();
        this.props.setFilterForPatterns(
          { name: selectedItem.name, _id: selectedItem._id },
          selectedItem.assignedStrategy
        );
        this.props.history.push("/overview/");
        /*setTimeout(() => {
          $("#" + selectedItem.assignedStrategy.name).collapse();
        }, 1000);*/
      }
    }
  };

  differBetweenSearchresults(searchItem) {
    if (searchItem.summary !== undefined) {
      return <span className={"searchResultIndicator"}>Pattern: </span>;
    } else if (searchItem.assignedStrategy !== undefined) {
      return (
        <span className={"searchResultIndicator"}>Filter for Tactic: </span>
      );
    } else {
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
    if (
      searchResults === null ||
      loading ||
      Object.keys(searchResults).length === 0
    ) {
      //  searchContent = <Spinner />;

      searchContent = [];
      isLoading = false;
      searchBoxContent = (
        <Col xs={8} xsOffset={2}>
          <AsyncTypeahead
            // {...this.state}
            delay={200}
            {...this.state}
            minLength={2}
            selectHintOnEnter={true}
            emptyLabel="No Results found!"
            clearButton={true}
            selected={this.state.selected}
            // isLoading={isLoading}
            options={searchContent}
            labelKey="name"
            onChange={selected => this.setState({ selected })}
            // onChange={this.search}
            onSearch={this.__handleSearch}
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
      searchContentBeforeTactics = searchResults.Patterns.concat(
        searchResults.Strategies
      );
      searchContent = searchContentBeforeTactics.concat(searchResults.Tactics);
      console.log(searchResults);
      //searchContent = [{ id: 1, name: "John" }, { id: 2, name: "Miles" }];
      isLoading = false;
      // alert("gefunden");
      // alert(option);
      searchBoxContent = (
        <Col xs={8} xsOffset={2}>
          <AsyncTypeahead
            {...this.state}
            delay={200}
            clearButton={true}
            selectHintOnEnter={true}
            emptyLabel="No Results found!"
            clearButton={true}
            minLength={2}
            selected={this.state.selected}
            //isLoading={isLoading}
            options={searchContent}
            labelKey="name"
            onChange={selected => this.handleSelectedSearchItem(selected)}
            // onChange={this.search}
            onSearch={this.__handleSearch}
            placeholder="Search..."
            renderMenuItemChildren={(result, menuProps, index) => (
              <MenuItem option={result} position={index}>
                {this.differBetweenSearchresults(result)}
                {result.name}
              </MenuItem>
            )}

            /*}
                </MenuItem>
              ))}
            </Menu>
          )}*/
            /*  renderMenuItemChildren={(result, menuProps, index) => (
            <MenuItem option={result} position={index}>
              {this.differBetweenSearchresults(result)}
              {result.name}
            </MenuItem>
          )}*/
            /*
           renderMenu={(results, menuProps) => (
            <Menu {...menuProps}>
              {results.map((result, index) => (
                <MenuItem option={result} position={index}>
                  {this.differBetweenSearchresults(result)}
                  <span onClick={() => this.handleSelectedSearchItem(result)}>
                    {result.name}
                  </span>
                  </MenuItem>
              ))}
              </Menu>)}
*/
          />
        </Col>
      );
      //  searchContent = <ResultList searchResults={searchResults} />;
      // searchContent = searchResults;
    }

    return (
      <div>
        {/* <AsyncTypeahead
          // {...this.state}
          selected={this.state.selected}
          isLoading={isLoading}
          options={searchContent}
          labelKey="login"
          onChange={selected => this.setState({ selected })}
          // onChange={this.search}
          onSearch={this.__handleSearch}
          placeholder="Search for a Github user..."
          renderMenuItemChildren={(option, props) => (
            <GithubMenuItem key={option.id} user={option} />
          )}
          />*/}
        {searchBoxContent}

        {/*<FormGroup>
          <FormControl
            id="search"
            type="text"
            placeholder="Enter thishh"
            onChange={this.search}
          />
          {searchContent}
        </FormGroup>*/}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
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
