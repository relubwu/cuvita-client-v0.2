import { combineReducers } from 'lib/redux.min';
import detectInset from 'utils/detect-inset';
import {
  SWITCH_TABBAR,
  SWITCH_PAGE,
  SET_LOCALE,
  SET_REGION,
  SET_SYSTEM_INFO,
  SET_USER_INFO,
  UPDATE_USER_INFO,
  SET_MEMBER_INFO,
  UPDATE_MEMBER_INFO,
  PURGE_MEMBER_INFO,
  SET_NETWORK_STATUS,
  SET_GEO_LOCATION
} from './actions';

/**
 * Reducer Initial Values
 */
const DEFAULT_SYSTEM_INFO = null;
const DEFAULT_LOCALE = wx.getStorageSync("locale") || "zh_CN";
const DEFAULT_LOCALE_MAPPING = ["zh_CN", "en_US"];
const DEFAULT_REGION = "sd";
const DEFUALT_TABBAR_ITEMS = ["discovery", "vitae", "me"];

/**
 * Global Reducers
 */
function systemInfo(state = DEFAULT_SYSTEM_INFO, { type, res }) {
  switch (type) {
    case SET_SYSTEM_INFO:
      return {
        ...res,
        safeAreaInset: detectInset(res.model, res.screenHeight),
        navigationBarHeight: detectInset(res.model, res.screenHeight) ? 88 : 64
      };
      break;
    default:
      return state;
      break;
  }
}

const GLOBAL_REDUCERS = combineReducers({
  systemInfo
});

/**
 * Export
 */
const reducers = combineReducers({
  global: GLOBAL_REDUCERS
});

export default reducers;