import axios from "axios";

import { SEARCHRESULTS_LOADING, SEARCH_IN_BACKEND } from "./types";

// Search in Backend with Searchbox in Navbar
export const searchInBackend = searchString => dispatch => {
  // Set Loading while getting data
  dispatch(setSearchResultsLoading());
  axios
    .post(`/api/general/search`, { searchString: searchString })
    .then(res =>
      dispatch({
        type: SEARCH_IN_BACKEND,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: SEARCH_IN_BACKEND,
        payload: err
      })
    );
};

// Set loading state
export const setSearchResultsLoading = () => {
  return {
    type: SEARCHRESULTS_LOADING
  };
};
