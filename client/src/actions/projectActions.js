import axios from "axios";

import {
  GET_ERRORS,
  DELETE_PROJECT,
  PROJECT_LOADING,
  GET_PROJECTS,
  GET_PROJECT,
  CLEAR_ERRORS,
  SET_ASSIGNED_DEVELOPER,
  SET_ASSIGNED_TACTICS,
  RESET_ASSIGNED_STRATEGIES,
  SET_ASSIGNED_STRATEGIES,
  MATCH_USER,
  SWITCH_ATTR_FOR_EDIT_PROJECT,
  SET_COMMENT,
  SET_FINISHED_TACTIC,
  REMOVE_PROJECT_FROM_USER,
  ADD_PROJECT_TO_USER
} from "./types";

// create Project
export const createProject = (projectData, history) => dispatch => {
  axios
    .post("/api/projects/createproject", projectData)
    .then(res => history.push("/PMoverview"))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Edit Project
export const editProject = (projectData, history) => dispatch => {
  axios
    .post(`/api/projects/project/edit`, projectData)
    .then(res =>
      dispatch({
        type: GET_PROJECT,
        payload: res.data
      })
    )
    .then(res => history.push(`/project/${projectData.id}`))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Get Projects
export const getProjects = () => dispatch => {
  dispatch(setProjectLoading());
  axios
    .get("/api/projects")
    .then(res =>
      dispatch({
        type: GET_PROJECTS,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_PROJECTS,
        payload: null
      })
    );
};

// Get Project
export const getProject = id => dispatch => {
  dispatch(setProjectLoading());
  axios
    .get(`/api/projects/project/${id}`)
    .then(res =>
      dispatch({
        type: GET_PROJECT,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_PROJECT,
        payload: null
      })
    );
};

// Match Developer
export const matchDev = id => dispatch => {
  dispatch(setProjectLoading());
  axios
    .get(`/api/users/user/${id}`)
    .then(res =>
      dispatch({
        type: MATCH_USER,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: MATCH_USER,
        payload: err.data
      })
    );
};

// Delete Project
export const deleteProject = id => dispatch => {
  console.log(id);
  axios
    .delete(`/api/projects/${id}`)
    .then(res =>
      dispatch({
        type: DELETE_PROJECT,
        payload: id
      })
    )
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Set loading state
export const setProjectLoading = () => {
  return {
    type: PROJECT_LOADING
  };
};

// Clear errors
export const clearErrors = () => {
  return {
    type: CLEAR_ERRORS
  };
};

// Set assignedDevelopers
export const setAssignedDevelopers = developer => {
  return {
    type: SET_ASSIGNED_DEVELOPER,
    payload: developer
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

export const setComment = commentData => dispatch => {
  axios
    .post("/api/projects/project/setComment", commentData)
    .then(res =>
      dispatch({
        type: SET_COMMENT,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

export const setFinishedTactic = tacticData => dispatch => {
  axios
    .post("/api/projects/project/setFinishedTactic", tacticData)
    .then(res =>
      dispatch({
        type: SET_FINISHED_TACTIC,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

/*export const setFinishedTactic = tactic => {
  return {
    type: SET_FINISHED_TACTIC,
    payload: tactic
  };
};*/

// Reset assignedTactics
export const resetAssignedStrategies = strategy => {
  return {
    type: RESET_ASSIGNED_STRATEGIES,
    payload: strategy
  };
};

// switch Attributes to edit project
export const switchAttrForEditProject = attr => {
  return {
    type: SWITCH_ATTR_FOR_EDIT_PROJECT,
    payload: attr
  };
};

export const removeAssignedProjects = project => dispatch => {
  axios
    .post(`/api/projects/project/deleteAssignedProject`, project)
    .then(res =>
      dispatch({
        type: REMOVE_PROJECT_FROM_USER,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: REMOVE_PROJECT_FROM_USER,
        payload: null
      })
    );
};

export const addAssignedProjects = project => dispatch => {
  axios
    .post(`/api/projects/project/addAssignedProject`, project)
    .then(res =>
      dispatch({
        type: ADD_PROJECT_TO_USER,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: ADD_PROJECT_TO_USER,
        payload: null
      })
    );
};
