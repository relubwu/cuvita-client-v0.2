import { combineReducers } from '../../lib/redux.min';
import {
  UPDATE_SERVICES
} from './actions';
import DEFAULT_SERVICES from '../../config/services.config';

/**
 * Consts
 */
export function services(state = DEFAULT_SERVICES, { type, data }) {
  switch (type) {
    case UPDATE_SERVICES:
      for (let index in data)
        data[index] = { ...state[index], ...data[index] }
      return data;
      // return [ ...state, ...data ];
      break;
    default: 
      return state;
      break;
  }
}

const reducers = combineReducers({
  services
});

export default reducers;