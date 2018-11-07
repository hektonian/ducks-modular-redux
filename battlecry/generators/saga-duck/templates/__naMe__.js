import { fork, all, take } from 'redux-saga/effects';

// Actions

// Action Creators

// Initial state
export const initialState = {
}

// Reducer
export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    default: return state;
  }
}

// Side effects

// Watchers

// Root saga
export function* saga() {
  yield all([
  ]);
}