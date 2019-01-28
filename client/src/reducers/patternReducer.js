import {
  PATTERN_LOADING,
  GET_PATTERNS,
  GET_PATTERN,
  DELETE_PATTERN,
  UPDATE_PATTERN,
  SET_ASSIGNED_TACTICS,
  SET_ASSIGNED_STRATEGIES,
  SET_FILTER_FOR_PATTERNS,
  SET_STRATEGY_AS_FILTER,
  DESELECT_STRATEGY_AS_FILTER,
  SET_EDITING_OF_PATTERN,
  CLEAR_ALL_FILTERS,
  SET_CHOSEN_TACTICS,
  CLEAR_CHOSEN_TACTICS
} from "../actions/types";
//import update from "react-addons-update";
const initialState = {
  patterns: [],
  pattern: {},
  assignedStrategies: [],
  assignedTactics: [],
  loading: false,
  editPattern: false,
  visibilityFilters: [],
  chosenTactics: []
};

export default function(state = initialState, action) {
  switch (action.type) {
    case PATTERN_LOADING:
      return {
        ...state,
        loading: true
      };
    case GET_PATTERNS:
      return {
        ...state,
        patterns: action.payload,
        loading: false
      };
    case GET_PATTERN:
      return {
        ...state,
        pattern: action.payload,
        chosenTactics: action.payload.assignedTactics,
        loading: false
      };
    case DELETE_PATTERN:
      return {
        ...state,
        patterns: state.patterns.filter(
          pattern => pattern._id !== action.payload
        )
      };
    case UPDATE_PATTERN:
      console.log("redcer");
      console.log(action.payload);
      for (var i in state.patterns) {
        if (state.patterns[i]._id == action.payload._id) {
          state.patterns[i] = action.payload;
          break;
        }
      }
      return {
        ...state,
        patterns: state.patterns,
        pattern: action.payload
      };
    case SET_CHOSEN_TACTICS:
      if (state.chosenTactics.includes(action.payload)) {
        return {
          ...state,
          chosenTactics: state.chosenTactics.filter(
            chosenTactic => chosenTactic !== action.payload
          )
        };
      } else {
        return {
          ...state,
          chosenTactics: [action.payload, ...state.chosenTactics]
        };
      }
    case CLEAR_CHOSEN_TACTICS:
      return {
        ...state,
        chosenTactics: []
      };

    /*return {
        ...state,
        pattern: action.payload,
        patterns: state.patterns.filter(
          pattern => pattern._id !== action.payload
        )
      };*/
    case SET_FILTER_FOR_PATTERNS:
      console.log("filter");
      console.log(action.payload);
      //state.visibilityFilter = state.visibilityFilter.push(action.payload);
      if (state.visibilityFilters.includes(action.payload)) {
        return {
          ...state,
          visibilityFilters: state.visibilityFilters.filter(
            visibilityFilter => visibilityFilter !== action.payload
          )
        };
      } else {
        return {
          ...state,
          visibilityFilters: [action.payload, ...state.visibilityFilters]
        };
      }
    case SET_STRATEGY_AS_FILTER:
      console.log("filters");
      console.log(action.payload);
      //state.visibilityFilter = state.visibilityFilter.push(action.payload);
      // var filters
      action.payload.forEach(filter => {
        if (state.visibilityFilters.includes(filter.name)) {
        } else {
          state.visibilityFilters.push(filter.name);
        }
      });
      return {
        ...state,
        visibilityFilters: state.visibilityFilters
      };
    case DESELECT_STRATEGY_AS_FILTER:
      console.log("deselectedfilters");
      console.log(action.payload);
      //state.visibilityFilter = state.visibilityFilter.push(action.payload);
      // var filters
      action.payload.forEach(filter => {
        if (state.visibilityFilters.includes(filter.name)) {
          /* console.log("vorher");
          console.log(filter);
          console.log(state.visibilityFilters);
          state.visibilityFilters.pop(filter.name);

          console.log("nachher");
          console.log(state.visibilityFilters);
          console.log(action.payload.length);*/
          state.visibilityFilters = state.visibilityFilters.filter(
            visibilityFilter => visibilityFilter !== filter.name
          );
        } else {
          /*console.log("nicht drin");
          console.log(filter);*/
        }
      });
      console.log("state.visibilityfilters");
      console.log(state.visibilityFilters);
      return {
        ...state,
        visibilityFilters: state.visibilityFilters
      };
    case CLEAR_ALL_FILTERS:
      return {
        ...state,
        visibilityFilters: []
      };
    case SET_EDITING_OF_PATTERN:
      return {
        ...state,
        editPattern: !state.editPattern,
        chosenTactics: state.pattern.assignedTactics
      };
    case SET_ASSIGNED_STRATEGIES:
      const addStrategy = str => {
        //console.log([...str].concat(state.assignedStrategies));
        // console.log(...[str].concat(state.assignedStrategies));
        //console.log(state.assignedStrategies.concat(str));
        //return "test";
        if (str !== undefined) {
          return state.assignedStrategies.concat(str);
        } else {
          return state.assignedStrategies;
        }

        /*[...str].concat(this.props.strategy)*/
        /*[...str.concat(state.assignedStrategies)]*/
      };

      const remStrategy = str => {
        var arr = state.assignedStrategies;
        var index = arr.indexOf(str);
        //console.log(index);
        //console.log(str);

        if (index !== -1) {
          arr.splice(index, 1);
          // console.log("remove" + arr);
        }
        return arr;
      };

      //console.log(state.assignedDevelopers);

      //console.log(action.payload);
      if (state.assignedStrategies.indexOf(action.payload) === -1) {
        var newArray = addStrategy(action.payload);
      } else {
        var newArray = remStrategy(action.payload);
      }

      // console.log(newArray.indexOf(action.payload));

      //console.log(newArray);
      //console.log(action.payload[0]);
      //console.log(state.assignedDevelopers.indexOf(action.payload[0]));
      //console.log(state.nameDeveloper);
      return {
        ...state,
        assignedStrategies: newArray,
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
        var index = arr.indexOf(tac);
        //console.log(index);
        //console.log(tac);

        if (index !== -1) {
          arr.splice(index, 1);
        }
        return arr;
      };

      //console.log(action.payload);
      if (state.assignedTactics.indexOf(action.payload) === -1) {
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

    default:
      return state;
  }
}
