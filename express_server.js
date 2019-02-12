var express = require('express');
var app = express();
var PORT = 8080;

var urlDB = {
  'b2xVn2': 'http://www.lighthouselabs.ca',
  '9sm5xK': 'http://www.google.com'
};

app.get('/', (request, result) => {
  result.send('Hello!');
});

app.get('/urls.json', (request, response) => {
  response.json(urlDB);
});

app.get('/hello', (request, response) => {
  response.send('<html><body>Hello <b>World</b></body></html>')
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);

});