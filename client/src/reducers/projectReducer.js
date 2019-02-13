import {
  PROJECT_LOADING,
  GET_PROJECTS,
  GET_PROJECT,
  DELETE_PROJECT,
  SET_ASSIGNED_DEVELOPER,
  SET_ASSIGNED_TACTICS,
  RESET_PROJECT,
  SET_ASSIGNED_STRATEGIES,
  SET_COMMENT,
  SET_FINISHED_TACTIC,
  REMOVE_PROJECT_FROM_USER,
  ADD_PROJECT_TO_USER
} from "../actions/types";

const initialState = {
  projects: [],
  project: {},
  assignedDevelopers: [],
  assignedStrategies: [],
  assignedTactics: [],
  comment: [],
  commentAttendees: [],
  loading: false,
  finishedTactics: []
};

export default function(state = initialState, action) {
  switch (action.type) {
    case PROJECT_LOADING:
      return {
        ...state,
        loading: true
      };
    case GET_PROJECTS:
      return {
        ...state,
        projects: action.payload,
        loading: false
      };

    case SET_COMMENT:
      return {
        ...state,
        comment: action.payload,
        loading: false
      };
    case SET_FINISHED_TACTIC:
      return {
        ...state,
        finishedTactics: action.payload.finishedTactics,
        loading: false
      };

    // this case loads the project into the redux store and put some values into a temp value
    // for further workflow
    case GET_PROJECT:
      var tempArr = [];

      // all assigned tactics will be pushed into a tempArr to send it into the redux store
      if (action.payload.assignedStrategiesWithAllTactics) {
        for (
          var i = 0;
          i < action.payload.assignedStrategiesWithAllTactics.length;
          i++
        ) {
          for (
            var j = 0;
            j <
            action.payload.assignedStrategiesWithAllTactics[i].assignedTactics
              .length;
            j++
          ) {
            tempArr.push(
              action.payload.assignedStrategiesWithAllTactics[i]
                .assignedTactics[j]
            );
          }
        }
      }

      return {
        ...state,
        project: action.payload,
        assignedStrategies: action.payload.assignedStrategies,
        assignedTactics: tempArr,
        assignedDevelopers: action.payload.assignedDevelopers,
        finishedTactics: action.payload.finishedTactics,
        comment: action.payload.comment,
        commentAttendees: action.payload.commentAttendees,
        loading: false
      };

    //this case set in the store a array with all selected developers
    case SET_ASSIGNED_DEVELOPER:
      const addDeveloper = dev => {
        if (dev !== undefined) {
          return state.assignedDevelopers.concat(dev);
        } else {
          return state.assignedDevelopers;
        }
      };

      const remDeveloper = dev => {
        var arr = state.assignedDevelopers;
        var tempArr = [];

        // a temporary array where only the ids of the developers are in there
        for (var i = 0; i < arr.length; i++) {
          tempArr.push(arr[i]._id);
        }

        var index = tempArr.indexOf(dev._id);

        // if id is matching then the object with this id will be removed from the array
        if (index !== -1) {
          arr.splice(index, 1);
        }
        return arr;
      };

      var tempArr = [];

      for (var i = 0; i < state.assignedDevelopers.length; i++) {
        tempArr.push(state.assignedDevelopers[i]._id);
      }

      // if the id is included in the array it will be removed, if not it will be inserted
      if (tempArr.indexOf(action.payload._id) === -1) {
        var newArray = addDeveloper(action.payload);
      } else {
        var newArray = remDeveloper(action.payload);
      }
      return {
        ...state,
        assignedDevelopers: newArray,
        loading: false
      };

    // comments are the same like in SET_ASSIGNED_DEVELOPERS
    case SET_ASSIGNED_TACTICS:
      const addTactic = tac => {
        if (tac !== undefined) {
          return state.assignedTactics.concat(tac);
        } else {
          return state.assignedTactics;
        }
      };

      const remTactic = tac => {
        var arr = state.assignedTactics;
        var tempArr = [];

        for (var i = 0; i < arr.length; i++) {
          tempArr.push(arr[i]._id);
        }

        var index = tempArr.indexOf(tac._id);

        if (index !== -1) {
          arr.splice(index, 1);
        }
        return arr;
      };

      var tempArr = [];

      for (var i = 0; i < state.assignedTactics.length; i++) {
        tempArr.push(state.assignedTactics[i]._id);
      }

      if (tempArr.indexOf(action.payload._id) === -1) {
        var newArray = addTactic(action.payload);
      } else {
        var newArray = remTactic(action.payload);
      }
      return {
        ...state,
        assignedTactics: newArray,
        loading: false
      };
    // RESET_PROJECT is to clean all temporary variables in the redux store for further workflow
    case RESET_PROJECT:
      return {
        ...state,
        assignedTactics: [],
        assignedStrategies: [],
        assignedDevelopers: [],
        finishedTactics: [],
        comment: [],
        commentAttendees: [],
        loading: false
      };
    // comments are the same like in SET_ASSIGNED_DEVELOPERS
    case SET_ASSIGNED_STRATEGIES:
      const addStrategy = str => {
        if (str !== undefined) {
          return state.assignedStrategies.concat(str);
        } else {
          return state.assignedStrategies;
        }
      };

      const remStrategy = str => {
        var arr = state.assignedStrategies;

        var tempArr = [];

        for (var i = 0; i < arr.length; i++) {
          tempArr.push(arr[i]._id);
        }

        var index = tempArr.indexOf(str._id);
        if (index !== -1) {
          arr.splice(index, 1);
        }
        return arr;
      };

      var tempArr = [];
      for (var i = 0; i < state.assignedStrategies.length; i++) {
        tempArr.push(state.assignedStrategies[i]._id);
      }

      if (tempArr.indexOf(action.payload._id) === -1) {
        var newArray = addStrategy(action.payload);
      } else {
        var tempArrAssTac = [];
        var tempArrAssStrTac = [];
        var finalTacArr = state.assignedTactics;

        for (i = 0; i < state.assignedTactics.length; i++) {
          tempArrAssTac.push(state.assignedTactics[i]._id);
        }

        for (i = 0; i < action.payload.assignedTactics.length; i++) {
          tempArrAssStrTac.push(action.payload.assignedTactics[i]._id);
        }
        // this part is to remove also the already selected tactics after deselecting the strategy
        var intersection = tempArrAssStrTac.filter(
          tac => -1 !== tempArrAssTac.indexOf(tac)
        );

        for (i = 0; i < intersection.length; i++) {
          var newTempArr = [];

          for (j = 0; j < state.assignedTactics.length; j++) {
            newTempArr.push(state.assignedTactics[j]._id);
          }

          var tacIndex = newTempArr.indexOf(intersection[i]);

          if (tacIndex !== -1) {
            finalTacArr.splice(tacIndex, 1);
          }
        }

        var newArray = remStrategy(action.payload);
      }

      if (finalTacArr === undefined) {
        return {
          ...state,
          assignedStrategies: newArray,
          loading: false
        };
      } else {
        return {
          ...state,
          assignedStrategies: newArray,
          assignedTactics: finalTacArr,
          loading: false
        };
      }

    case DELETE_PROJECT:
      return {
        ...state,
        projects: state.projects.filter(
          project => project._id !== action.payload
        )
      };

    case REMOVE_PROJECT_FROM_USER:
      return {
        ...state
      };

    case ADD_PROJECT_TO_USER:
      return {
        ...state
      };

    default:
      return state;
  }
}
