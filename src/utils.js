export function displayCase(str) {
  return str
    .replace(/[-_]/g, " ")
    .replace(/([A-Z])/g, " $1")
    .toLowerCase();
}
