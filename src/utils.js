import _ from "lodash";

export function displayCase(str) {
  return str.replace(/[-_]/g, " ").replace(/\w+/g, _.upperFirst);
}
