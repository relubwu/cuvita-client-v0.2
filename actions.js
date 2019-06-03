/**
 * Action Types
 */
export const SWITCH_TABBAR = "SWITCH_TABBAR";
export const SWITCH_PAGE = "SWITCH_PAGE";
export const SET_LOCALE = "SET_LOCALE";
export const SET_REGION = "SET_REGION";
export const SET_SYSTEM_INFO = "SET_SYSTEM_INFO";
export const SET_USER_INFO = "SET_USER_INFO";
export const UPDATE_USER_INFO = "UPDATE_USER_INFO";
export const SET_MEMBER_INFO = "SET_MEMBER_INFO";
export const UPDATE_MEMBER_INFO = "UPDATE_MEMBER_INFO";
export const PURGE_MEMBER_INFO = "PURGE_MEMBER_INFO";
export const SET_NETWORK_STATUS = "SET_NETWORK_STATUS";
export const SET_GEO_LOCATION = "SET_GEO_LOCATION";

/**
 * Action Constructors
 */
export function switchTabBar(index) {
  return { type: SWITCH_TABBAR, index };
}

export function switchPage(path, delta) {
  return { type: SWITCH_PAGE, path, delta };
}

export function setLocale(locale) {
  return { type: SET_LOCALE, locale };
}

export function setRegion(region) {
  return { type: SET_REGION, region };
}

export function setSystemInfo(res) {
  return { type: SET_SYSTEM_INFO, res };
}

export function setUserInfo(res) {
  return { type: SET_USER_INFO, res };
}

export function updateUserInfo(res) {
  return { type: UPDATE_USER_INFO, res };
}

export function setMemberInfo(res) {
  return { type: SET_MEMBER_INFO, res };
}

export function updateMemberInfo(res) {
  return { type: UPDATE_MEMBER_INFO, res };
}

export function purgeMemberInfo() {
  return { type: PURGE_MEMBER_INFO };
}

export function setNetworkStatus(status) {
  return { type: SET_NETWORK_STATUS, status };
}

export function setGeoLocation(res) {
  return { type: SET_GEO_LOCATION, res }
}