export function displayCase(str) {
  if (typeof str === "string") {
    if (str.match(/[A-Z]{2,}/g)) {
      return str; // if there are multiple caps in a row, just return the string
    }

    return str.replace(/[-_]/g, " ").replace(/([A-Z])/g, " $1");
  }
}
