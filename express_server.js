const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
const random = require('./randomString.js');
const PORT = 8080;

app.set('view engine', 'ejs');

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

app.get("/urls/new", (request, response) => {
  response.render("urls_new");
});

app.post("/urls", (request, response) => {
  let tiny = random();
  urlDB[tiny] = request.body.longURL;
  response.redirect('http://127.0.0.1:8080/urls/' + tiny, 302);
});

app.get('/u/:shortURL', (request, response) => {
  let longURL = urlDB[request.params.shortURL];
  if (longURL.slice(0, 7) === 'http://') {
    response.redirect(longURL);
  } else {
    response.redirect('http://' + longURL);
  }
});

app.get('/urls', (request, response) => {
  // let templateVars = {urls: urlDB};
  response.render('urls_index', {urls: urlDB});
});

app.get('/urls/:id', (request, response) => {
  response.render('urls_show', {shortURL: request.params.id,
                                longURL: urlDB[request.params.id]});
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);

});