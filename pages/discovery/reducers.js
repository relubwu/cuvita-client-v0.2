import { combineReducers } from '../../lib/redux.min';
import {
  SET_DISCOVERY_PAGEDATA,
  PURGE_DISCOVERY_PAGEDATA,
  SHOW_BACKGROUND_LAYER,
  HIDE_BACKGROUND_LAYER,
  START_PULLDOWN_REFRESH,
  STOP_PULLDOWN_REFRESH,
  START_SCROLL_TO_UPPER,
  STOP_SCROLL_TO_UPPER
} from './actions';

/**
 * Consts
 */
export const TAP_FEEDBACK = "TAP_FEEDBACK";
export const SCROLL_TO_UPPER = "SCROLL_TO_UPPER";
export const SCROLL_TO_UPPER_IDLE = "idle";
export const SCROLL_TO_UPPER_ENGAGED = "engaged";
export const PULLDOWN_REFRESH = "PULLDOWN_REFRESH";
export const PULLDOWN_REFRESH_IDLE = "idle";
export const PULLDOWN_REFRESH_ENGAGED = "engaged";
export const DEFAULT_PAGEDATA = {
  banner: {
    imageSrc: ""
  },
  recommendation: [
    {
      title: {
        zh_CN: " ",
        en_US: " "
      },
      items: [{}, {}, {}, {}]
    }
  ],
  articles: {
    items: [{}, {}]
  }
}
export const DEFAULT_PULLDOWN_REFRESH = PULLDOWN_REFRESH_IDLE;
export const DEFAULT_SCROLL_TO_UPPER = SCROLL_TO_UPPER_IDLE;

export function pageData(state = DEFAULT_PAGEDATA, { type, data }) {
  switch (type) {
    case SET_DISCOVERY_PAGEDATA:
      return { ...state, ...data };
      break;
    case PURGE_DISCOVERY_PAGEDATA:
      return DEFAULT_PAGEDATA;
      break;
    default:
      return state;
      break;
  }
}

export function pullDownRefresh(state = DEFAULT_PULLDOWN_REFRESH, { type }) {
  switch (type) {
    case START_PULLDOWN_REFRESH:
      return PULLDOWN_REFRESH_ENGAGED;
      break;
    case STOP_PULLDOWN_REFRESH:
      return PULLDOWN_REFRESH_IDLE
      break;
    default:
      return state;
  }
}

export function scrollToUpper(state = DEFAULT_SCROLL_TO_UPPER, { type }) {
  switch (type) {
    case START_SCROLL_TO_UPPER:
      return SCROLL_TO_UPPER_ENGAGED;
      break;
    case STOP_SCROLL_TO_UPPER:
      return SCROLL_TO_UPPER_IDLE;
      break;
    default:
      return state;
  }
}

const reducers = combineReducers({
  pageData,
  pullDownRefresh,
  scrollToUpper
});

export default reducers;