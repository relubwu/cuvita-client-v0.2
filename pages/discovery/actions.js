/**
 * Action Types
 */
export const SET_DISCOVERY_PAGEDATA = "SET_DISCOVERY_PAGEDATA";
export const PURGE_DISCOVERY_PAGEDATA = "PURGE_DISCOVERY_PAGEDATA";
export const START_PULLDOWN_REFRESH = "START_PULLDOWN_REFRESH";
export const STOP_PULLDOWN_REFRESH = "STOP_PULLDOWN_REFRESH";
export const START_SCROLL_TO_UPPER = "START_SCROLL_TO_UPPER";
export const STOP_SCROLL_TO_UPPER = "STOP_SCROLL_TO_UPPER";

/**
 * Action Constructors
 */
export function setPageData(data) {
  return { type: SET_DISCOVERY_PAGEDATA, data };
}

export function purgePageData(data) {
  return { type: PURGE_DISCOVERY_PAGEDATA };
}

export function startPullDownRefresh() {
  return { type: START_PULLDOWN_REFRESH };
}

export function stopPullDownRefresh() {
  return { type: STOP_PULLDOWN_REFRESH };
}

export function startScrollToUpper() {
  return { type: START_SCROLL_TO_UPPER };
}

export function stopScrollToUpper() {
  return { type: STOP_SCROLL_TO_UPPER };
}