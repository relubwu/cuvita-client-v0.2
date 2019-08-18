/**
 * Action Types
 */
export const UPDATE_SERVICES = "UPDATE_SERVICES";

/**
 * Action Constructors
 */
export function updateServices(data) {
  return { type: UPDATE_SERVICES, data };
}