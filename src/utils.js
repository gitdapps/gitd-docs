export function displayCase(str) {
  if (typeof str === "string") {
    return str
      .replace(/[-_]/g, " ")
      .replace(/([A-Z])/g, " $1")
      .toLowerCase();
  }
}
