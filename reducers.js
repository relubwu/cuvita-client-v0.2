import { combineReducers } from 'lib/redux.min';
import detectInset from 'utils/detect-inset';
import changeTabLocal from 'utils/change-tab-locale';
import {
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
 * Constants
 */
const DEFAULT_SYSTEM_INFO = null;
const DEFAULT_LOCALE = wx.getStorageSync("locale") || 0;
const DEFAULT_LOCALE_MAPPING = ["zh_CN", "en_US"];
const DEFAULT_ROUTER = { path: "/pages/index/index", delta: 0 };
const DEFAULT_REGION = "sd";

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

function locale(state = DEFAULT_LOCALE, { type, locale }) {
  switch (type) {
    case SET_LOCALE:
      changeTabLocal(DEFAULT_LOCALE_MAPPING[locale]);
      return locale;
      break;
    default:
      return state;
      break;
  }
}

const GLOBAL_REDUCERS = combineReducers({
  systemInfo,
  locale
});

/**
 * Export
 */
const reducers = combineReducers({
  global: GLOBAL_REDUCERS
});

export default reducers;