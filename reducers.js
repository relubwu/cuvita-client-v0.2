import { combineReducers } from 'lib/redux.min';
import detectInset from 'utils/detect-inset';
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

/**
 * Constants
 */
const DEFAULT_SYSTEM_INFO = null;
const DEFAULT_LOCALE = 0;
const DEFAULT_LOCALE_MAPPING = ["zh", "en"];
const DEFAULT_TAB_LOCALE = {
  "zh": ["发现", "VITA", "我"],
  "en": ["Discovery", "VITA", "Me"]
};
const DEFAULT_ROUTER = { path: "/pages/discovery/discovery", delta: 0 };
const DEFAULT_REGION = { alias: "sd", name: ["圣迭戈", "San Diego"], zipCode: 92092, geoLocation: { lat: 32.88, long: -117.23 } };
const DEFAULT_USER = null;
const DEFAULT_MEMBER = null;

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
      for (let i = 0; i < DEFAULT_TAB_LOCALE[DEFAULT_LOCALE_MAPPING[locale]].length; i++)
        wx.setTabBarItem({
          index: i,
          text: DEFAULT_TAB_LOCALE[DEFAULT_LOCALE_MAPPING[locale]][i]
        });
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
      return res;
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
      return null;
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

/**
 * Export
 */
const reducers = combineReducers({
  global: GLOBAL_REDUCERS
});

export default reducers;