/**
 * Action Types
 */
export const SET_LOCALE = "SET_LOCALE";
export const SET_REGION = "SET_REGION";
export const SET_SYSTEM_INFO = "SET_SYSTEM_INFO";
export const SET_NETWORK_STATUS = "SET_NETWORK_STATUS";
export const SET_GEO_LOCATION = "SET_GEO_LOCATION";
export const SET_USER = "SET_USER";
export const UPDATE_USER = "UPDATE_USER";

/**
 * Action Constructors
 */

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

export function setUser(res) {
  return { type: SET_USER, res }
}