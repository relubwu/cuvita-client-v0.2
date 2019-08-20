import { combineReducers } from 'lib/redux.min';
import detectInset from 'utils/detect-inset';
import changeTabLocal from 'utils/change-tab-locale';
import {
  SET_LOCALE,
  SET_REGION,
  SET_SYSTEM_INFO,
  SET_USER,
  UPDATE_USER,
  SET_MEMBER,
  UPDATE_MEMBER,
  PURGE_MEMBER,
  SET_NETWORK_STATUS,
  SET_GEO_LOCATION
} from './actions';
import PAGE_REDUCERS_DISCOVERY from 'pages/discovery/reducers';

/**
 * Constants
 */
const DEFAULT_SYSTEM_INFO = null;
const DEFAULT_LOCALE = wx.getStorageSync("locale") || 0;
const DEFAULT_LOCALE_MAPPING = ["zh", "en"];
const DEFAULT_ROUTER = { path: "/pages/discovery/discovery", delta: 0 };
const DEFAULT_REGION = wx.getStorageSync("region") || "ucsd";
const DEFAULT_USER = null;
const DEFAULT_MEMBER = wx.getStorageSync("member") || null;

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
      wx.setStorage({
        key: 'locale',
        data: locale
      });
      return locale;
      break;
    default:
      return state;
      break;
  }
}

function region(state = DEFAULT_REGION, { type, region }) {
  switch (type) {
    case SET_REGION:
      wx.setStorage({
        key: 'region',
        data: region,
      });
      return region;
      break;
    default: 
      return state;
      break;
  }
}

function user(state = DEFAULT_USER, { type, res }) {
  switch (type) {
    case SET_USER:
      return { ...state, ...res };
      break;
    default: 
      return state;
      break;
  }
}

function member(state = DEFAULT_MEMBER, { type, res }) {
  switch (type) {
    case SET_MEMBER:
      wx.setStorage({
        key: 'member',
        data: res
      });
      return { ...state, ...res };
      break;
    case UPDATE_MEMBER:
      wx.setStorage({
        key: 'member',
        data: res
      });
      return { ...state, ...res };
      break;
    case PURGE_MEMBER:
      wx.removeStorage({
        key: 'member'
      });
      return DEFAULT_MEMBER;
      break;
    default:
      return state;
      break;
  }
}

const GLOBAL_REDUCERS = combineReducers({
  systemInfo,
  locale,
  region,
  user,
  member
});

const PAGE_REDUCERS = combineReducers({
  discovery: PAGE_REDUCERS_DISCOVERY
});

/**
 * Export
 */
const reducers = combineReducers({
  global: GLOBAL_REDUCERS,
  page: PAGE_REDUCERS
});

export default reducers;