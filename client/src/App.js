import React, { Component } from "react";

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import jwt_decode from "jwt-decode";
import setAuthToken from "./utils/setAuthToken";
import { setCurrentUser, logoutUser } from "./actions/authActions";

import { Provider } from "react-redux";
import store from "./store";

import PrivateRoute from "./components/common/PrivateRoute";

import NavigationBar from "./components/layout/NavigationBar";
import Landing from "./components/layout/Landing";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import Overview from "./components/patternOverview/Overview";
import CreatePattern from "./components/patternDetail/CreatePattern";
import CreateProject from "./components/projectOverview/CreateProject";
import EditProject from "./components/projectOverview/EditProject";
import DetailProject from "./components/projectDetail/DetailProject";
import { Footer } from "./components/layout/Footer";
import Search from "./components/layout/Search";
import PMoverview from "./components/projectOverview/PMoverview";
import StrategyOverview from "./components/strategyOverview/StrategyOverview";

import "./App.css";
import PatternDetail from "./components/patternDetail/PatternDetail";

// Check for token
if (localStorage.jwtToken) {
  // Set auth token header auth
  setAuthToken(localStorage.jwtToken);
  // Decode token and get user info and exp
  const decoded = jwt_decode(localStorage.jwtToken);
  // Set user and isAuthenticated
  store.dispatch(setCurrentUser(decoded));

  // Check for expired token
  const currentTime = Date.now() / 1000;
  if (decoded.exp < currentTime) {
    // Logout user
    store.dispatch(logoutUser());

    // Redirect to login
    window.location.href = "/login";
  }
}

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <div className="App">
            <NavigationBar />
            <Route exact path="/" component={Landing} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/register" component={Register} />
            <div
              className="container"
              style={{ marginBottom: "75px", marginTop: "75px" }}
            >
              <Route exact path="/search" component={Search} />
              <Route exact path="/overview" component={Overview} />
              <Route
                path="/patterndetail/:_id?/:editing?"
                component={PatternDetail}
              />
              <Switch>
                <PrivateRoute
                  exact
                  path="/strategyoverview"
                  component={StrategyOverview}
                />

                <PrivateRoute exact path="/PMoverview" component={PMoverview} />
                <PrivateRoute
                  exact
                  path="/create-pattern"
                  component={CreatePattern}
                />

                <PrivateRoute
                  exact
                  path="/create-project"
                  component={CreateProject}
                />
                <PrivateRoute
                  exact
                  path="/project/edit-project/:id"
                  component={EditProject}
                />
                <PrivateRoute
                  exact
                  path="/project/:id"
                  component={DetailProject}
                />
              </Switch>
            </div>
            <Footer />
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
