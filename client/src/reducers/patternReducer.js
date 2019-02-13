import {
  PATTERN_LOADING,
  GET_PATTERNS,
  GET_PATTERN,
  DELETE_PATTERN,
  UPDATE_PATTERN,
  SET_FILTER_FOR_PATTERNS,
  DESELECT_TACTIC_AS_FILTER,
  SET_STRATEGY_AS_FILTER,
  DESELECT_STRATEGY_AS_FILTER,
  SET_EDITING_OF_PATTERN,
  CLEAR_ALL_FILTERS,
  SET_CHOSEN_TACTICS,
  CLEAR_CHOSEN_TACTICS,
  LINK_TO_PATTERN_AFTER_SEARCH,
  SET_EDITING_TO_FALSE
} from "../actions/types";

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
        // if tactic is already chosen --> deselect tactic
        return {
          ...state,
          chosenTactics: state.chosenTactics.filter(
            chosenTactic => chosenTactic !== action.payload
          )
        };
      } else {
        // if tactic is not already chosen --> select tactic
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
    case SET_FILTER_FOR_PATTERNS:
      // if tactic is set as filter
      var visFilters = state.visibilityFilters;
      var visFilters = state.visibilityFilters.filter(
        strategyFilter =>
          strategyFilter._id == action.payload.strategyFilter._id
      );

      // check if corresponding strategy is already set as filter
      if (visFilters.length == 0) {
        var strategyToInsert = action.payload.strategyFilter;
        strategyToInsert.assignedTactics = [action.payload.tacticFilter];
        if (state.visibilityFilters.length == 0) {
          // if corresponding strategy is not set as filter and no other filters are already set
          return {
            ...state,
            visibilityFilters: [strategyToInsert]
          };
        } else {
          //if corresponding strategy is not set as filter, but already others
          state.visibilityFilters.push(strategyToInsert);
          return {
            ...state,
            visibilityFilters: state.visibilityFilters
          };
        }
      } else {
        //if corresponding strategy is already set
        // add tactic to strategy
        visFilters[0].assignedTactics.push(action.payload.tacticFilter);

        // convert strategy back to object
        visFilters = visFilters[0];

        // delete old strategy from filters
        state.visibilityFilters = state.visibilityFilters.filter(
          strategyFilter =>
            strategyFilter._id != action.payload.strategyFilter._id
        );

        // add new strategy to filters
        return {
          ...state,
          visibilityFilters: [...state.visibilityFilters, visFilters]
        };
      }

    case DESELECT_TACTIC_AS_FILTER:
      // if tactic is deselected as filter
      // Select corresponding strategy from filters
      var strategyInFilters = state.visibilityFilters.filter(
        filter => filter._id == action.payload.strategyFilter._id
      );

      //filter out selected tactic
      var assignedTacticsInCorrespondingStrategy = strategyInFilters[0].assignedTactics.filter(
        tacticFilter => tacticFilter._id != action.payload.tacticFilter._id
      );

      // check if deselected tactic was last selected tactic from strategy
      if (assignedTacticsInCorrespondingStrategy.length == 0) {
        // if tactic was last selected tactic from strategy
        // Delete old strategy from filters
        state.visibilityFilters = state.visibilityFilters.filter(
          strategyFilter =>
            strategyFilter._id != action.payload.strategyFilter._id
        );

        //check if fiters are completely empty now
        if (state.visibilityFilters.length == 0) {
          return {
            ...state,
            visibilityFilters: []
          };
        }
        // if not all filters are empty, but strategy, return rest of filters
        else {
          return {
            ...state,
            visibilityFilters: state.visibilityFilters
          };
        }
      } else {
        // if at least one tactic is left in corresponding strategy

        //replace assignedTactics
        strategyInFilters[0].assignedTactics = assignedTacticsInCorrespondingStrategy;

        // convert strategy to object
        strategyInFilters = strategyInFilters[0];

        // Delete old strategy from filters
        state.visibilityFilters = state.visibilityFilters.filter(
          strategyFilter =>
            strategyFilter._id != action.payload.strategyFilter._id
        );
        // return remaining strategies and new strategy with deleted tactic
        return {
          ...state,
          visibilityFilters: [...state.visibilityFilters, strategyInFilters]
        };
      }

    case SET_STRATEGY_AS_FILTER:
      // Delete old strategy from filters
      state.visibilityFilters = state.visibilityFilters.filter(
        strategyFilter => strategyFilter._id !== action.payload._id
      );
      //check if filters were empty
      if (state.visibilityFilters.length == 0) {
        // if no fiters are set
        return {
          ...state,
          visibilityFilters: [action.payload]
        };
      } else {
        // if other filters were already set
        // return new complete strategy as filter
        return {
          ...state,
          visibilityFilters: [...state.visibilityFilters, action.payload]
        };
      }
    case DESELECT_STRATEGY_AS_FILTER:
      // Delete old strategy from filters
      state.visibilityFilters = state.visibilityFilters.filter(
        strategyFilter => strategyFilter._id !== action.payload._id
      );
      //check if filters are empty now
      if (state.visibilityFilters.length == 0) {
        // if empty
        return {
          ...state,
          visibilityFilters: []
        };
      } else {
        // if other filters are still set
        return {
          ...state,
          visibilityFilters: state.visibilityFilters
        };
      }
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
    case SET_EDITING_TO_FALSE:
      return {
        ...state,
        editPattern: false,
        chosenTactics: []
      };
    case LINK_TO_PATTERN_AFTER_SEARCH:
      const patterns = state.patterns.filter(
        pattern => pattern.name == action.payload.name
      );
      return {
        ...state,
        pattern: patterns[0]
      };

    default:
      return state;
  }
}
