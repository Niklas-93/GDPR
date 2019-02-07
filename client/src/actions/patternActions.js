import axios from "axios";

import {
  GET_ERRORS,
  DELETE_PATTERN,
  PATTERN_LOADING,
  GET_PATTERNS,
  GET_PATTERN,
  UPDATE_PATTERN,
  CLEAR_ERRORS,
  SET_ASSIGNED_TACTICS,
  SET_ASSIGNED_STRATEGIES,
  SET_FILTER_FOR_PATTERNS,
  DESELECT_STRATEGY_AS_FILTER,
  CLEAR_ALL_FILTERS,
  SET_EDITING_OF_PATTERN,
  SET_CHOSEN_TACTICS,
  CLEAR_CHOSEN_TACTICS,
  SET_STRATEGY_AS_FILTER,
  DESELECT_TACTIC_AS_FILTER,
  LINK_TO_PATTERN_AFTER_SEARCH,
  SET_EDITING_TO_FALSE
} from "./types";

// create Pattern
export const createPattern = (patternData, history) => dispatch => {
  axios
    .post("/api/patterns/createpattern", patternData)
    .then(res => history.push("/patterndetail/" + res.data._id))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Get Patterns
export const getPatterns = () => dispatch => {
  dispatch(setPatternLoading());
  axios
    .get("/api/patterns")
    .then(res =>
      dispatch({
        type: GET_PATTERNS,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_PATTERNS,
        payload: null
      })
    );
};

// get single Pattern
export const getPattern = id => dispatch => {
  // set loading while getting Pattern from server
  dispatch(setPatternLoading());

  axios
    .get(`/api/patterns/${id}`)
    .then(res =>
      dispatch({
        type: GET_PATTERN,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_PATTERN,
        payload: null
      })
    );
};

// Delete Pattern
export const deletePattern = (id, history) => dispatch => {
  axios
    .delete(`/api/patterns/${id}`)
    .then(
      dispatch({
        type: DELETE_PATTERN,
        payload: id
      }),
      history.push("/overview")
    )
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Edit Pattern
export const editPattern = patternData => dispatch => {
  axios
    .post("/api/patterns/editpattern", patternData)
    .then(res =>
      dispatch({
        type: UPDATE_PATTERN,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: UPDATE_PATTERN,
        payload: null
      })
    );
};

// Set loading state
export const setPatternLoading = () => {
  return {
    type: PATTERN_LOADING
  };
};

// Clear errors
export const clearErrors = () => {
  return {
    type: CLEAR_ERRORS
  };
};

// Set assignedTactics
export const setAssignedTactics = tactic => {
  return {
    type: SET_ASSIGNED_TACTICS,
    payload: tactic
  };
};

// Set assignedStrategy
export const setAssignedStrategies = strategy => {
  return {
    type: SET_ASSIGNED_STRATEGIES,
    payload: strategy
  };
};

// Set Filter for Patterns
/*export const setFilterForPatterns = (tacticFilter, strategyFilter) => {
  return {
    type: SET_FILTER_FOR_PATTERNS,
    payload: { tacticFilter: tacticFilter, strategyFilter: strategyFilter }
  };
};*/
export const setFilterForPatterns = (
  tacticFilter,
  strategyFilter
) => dispatch => {
  dispatch({
    type: SET_FILTER_FOR_PATTERNS,
    payload: { tacticFilter: tacticFilter, strategyFilter: strategyFilter }
  });
};

// Deselect Tactic as Filter for Patterns
export const deselectTacticAsFilter = (tacticFilter, strategyFilter) => {
  return {
    type: DESELECT_TACTIC_AS_FILTER,
    payload: { tacticFilter: tacticFilter, strategyFilter: strategyFilter }
  };
};

//Clear all Filters
export const clearAllFilters = () => {
  return {
    type: CLEAR_ALL_FILTERS
  };
};

// Set Strategy as Filter for Patterns
export const setStrategyAsFilter = filters => {
  return {
    type: SET_STRATEGY_AS_FILTER,
    payload: filters
  };
};

//Deselect Strategy as Filter
export const deselectStrategyAsFilter = filters => {
  return {
    type: DESELECT_STRATEGY_AS_FILTER,
    payload: filters
  };
};

// Handle Editing of Pattern
export const handleEditing = () => {
  return {
    type: SET_EDITING_OF_PATTERN
  };
};

// Set Editing of Pattern to false if editing was left without dismiss button
export const setEditingToFalse = () => {
  return {
    type: SET_EDITING_TO_FALSE
  };
};

// Set Chosen tactics
export const setChosenTactics = tactic => {
  return {
    type: SET_CHOSEN_TACTICS,
    payload: tactic
  };
};

// Clear Chosen tactics
export const clearChosenTactics = () => {
  return {
    type: CLEAR_CHOSEN_TACTICS
  };
};

// Link to Pattern after Search and fill Pattern
export const linkToPatternAfterSearch = Pattern => {
  return {
    type: LINK_TO_PATTERN_AFTER_SEARCH,
    payload: Pattern
  };
};
