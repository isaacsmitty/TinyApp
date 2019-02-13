module.exports =
  function generateRandomString() {
    let string = Math.random().toString(36).substr(2, 6);
    return(string);
}
// generateRandomString()