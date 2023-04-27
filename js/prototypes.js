// first letter up
String.prototype.toCapitalize = (str) => {
  return str.slice(0, 1).toUpperCase() + str.slice(1);
};

// Last letter up
String.prototype.toCapitalizeLast = (str) => {
  return str.slice(0, -1) + str.slice(-1).toUpperCase();
};
