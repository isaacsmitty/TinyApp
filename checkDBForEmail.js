module.exports =
  function checkDBForEmail(email) {
    for (var id in users) {
      if (users[id].email === email) {
        return true;
      }
    }
      return false;
  };