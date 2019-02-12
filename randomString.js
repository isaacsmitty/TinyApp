function generateRandomString() {
  let string = Math.random().toString(36).substring(7);
  console.log(string);
}
generateRandomString()