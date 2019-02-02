import {
  PROJECT_LOADING,
  GET_PROJECTS,
  GET_PROJECT,
  DELETE_PROJECT,
  SET_ASSIGNED_DEVELOPER,
  SET_ASSIGNED_TACTICS,
  RESET_ASSIGNED_STRATEGIES,
  SET_ASSIGNED_STRATEGIES,
  SWITCH_ATTR_FOR_EDIT_PROJECT,
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
    case GET_PROJECT:
      return {
        ...state,
        project: action.payload,
        loading: false
      };
    case SET_COMMENT:
      //console.log(action.payload);
      return {
        ...state,
        comment: action.payload,
        loading: false
      };
    case SET_FINISHED_TACTIC:
      //console.log(...state);
      return {
        ...state,
        finishedTactics: action.payload.finishedTactics,
        loading: false
      };

    case SWITCH_ATTR_FOR_EDIT_PROJECT:
      var tempArr = [];

      if (state.project.assignedStrategiesWithAllTactics) {
        for (
          var i = 0;
          i < state.project.assignedStrategiesWithAllTactics.length;
          i++
        ) {
          for (
            var j = 0;
            j <
            state.project.assignedStrategiesWithAllTactics[i].assignedTactics
              .length;
            j++
          ) {
            tempArr.push(
              state.project.assignedStrategiesWithAllTactics[i].assignedTactics[
                j
              ]
            );
          }
        }
      }

      return {
        ...state,
        assignedStrategies: state.project.assignedStrategies,
        assignedTactics: tempArr,
        assignedDevelopers: state.project.assignedDevelopers,
        finishedTactics: state.project.finishedTactics,
        comment: state.project.comment,
        commentAttendees: state.project.commentAttendees,
        loading: false
      };
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

        for (var i = 0; i < arr.length; i++) {
          tempArr.push(arr[i]._id);
        }

        //console.log(tempArr);

        var index = tempArr.indexOf(dev._id);
        //console.log(index);
        //console.log(dev);

        if (index !== -1) {
          arr.splice(index, 1);
          // console.log("remove" + arr);
        }
        return arr;
      };

      //console.log(state.assignedDevelopers);

      var tempArr = [];

      for (var i = 0; i < state.assignedDevelopers.length; i++) {
        tempArr.push(state.assignedDevelopers[i]._id);
      }

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
        //console.log(index);
        //console.log(tac);

        if (index !== -1) {
          arr.splice(index, 1);
        }
        return arr;
      };

      //console.log(action.payload);

      var tempArr = [];

      for (var i = 0; i < state.assignedTactics.length; i++) {
        tempArr.push(state.assignedTactics[i]._id);
      }

      if (tempArr.indexOf(action.payload._id) === -1) {
        var newArray = addTactic(action.payload);
      } else {
        var newArray = remTactic(action.payload);
      }

      // console.log(newArray.indexOf(action.payload));

      //console.log(newArray);
      //console.log(action.payload[0]);
      //console.log(state.assignedDevelopers.indexOf(action.payload[0]));
      //console.log(state.nameDeveloper);
      return {
        ...state,
        assignedTactics: newArray,
        loading: false
      };

    case RESET_ASSIGNED_STRATEGIES:
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
      var remTac = [];

      for (var i = 0; i < state.assignedStrategies.length; i++) {
        tempArr.push(state.assignedStrategies[i]._id);
      }

      if (tempArr.indexOf(action.payload._id) === -1) {
        var newArray = addStrategy(action.payload);
      } else {
        //console.log(action.payload);
        //console.log(state.assignedTactics);

        var tempArrAssTac = [];
        var tempArrAssStrTac = [];
        var finalTacArr = state.assignedTactics;

        for (i = 0; i < state.assignedTactics.length; i++) {
          tempArrAssTac.push(state.assignedTactics[i]._id);
        }

        for (i = 0; i < action.payload.assignedTactics.length; i++) {
          tempArrAssStrTac.push(action.payload.assignedTactics[i]._id);
        }

        //console.log(action.payload.assignedTactics);
        //console.log(tempArrAssStrTac);

        //console.log(state.assignedTactics);
        //console.log(tempArrAssTac);

        var intersection = tempArrAssStrTac.filter(
          tac => -1 !== tempArrAssTac.indexOf(tac)
        );
        //console.log(intersection);

        //var revIntersection = intersection.reverse();

        for (i = 0; i < intersection.length; i++) {
          var newTempArr = [];

          for (j = 0; j < state.assignedTactics.length; j++) {
            newTempArr.push(state.assignedTactics[j]._id);
          }

          var tacIndex = newTempArr.indexOf(intersection[i]);

          //console.log(tacIndex);

          if (tacIndex !== -1) {
            finalTacArr.splice(tacIndex, 1);
          }
        }

        /*         var arr2 = state.assignedTactics;

        var tempArr2 = [];

        for (var i = 0; i < arr2.length; i++) {
          tempArr2.push(arr2[i]._id);
        }

        console.log(tempArr2);
        console.log(state);

        for (var i = 0; i < action.payload.assignedTactics.length; i++) {
          var index2 = tempArr2.indexOf(action.payload.assignedTactics[i]._id);
          console.log(index2);

          //Work around: he is skipping always the odd values, this way i get all items

          if (index2 !== -1) {
            arr2.splice(index2, 1);
          }

          //console.log(arr2);
        } */

        var newArray = remStrategy(action.payload);
      }

      //    console.log(arr2);

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
