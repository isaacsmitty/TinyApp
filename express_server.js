const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
const cookieParser = require('cookie-parser');
app.use(cookieParser());
const random = require('./randomString.js');
const PORT = 8080;

app.set('view engine', 'ejs');

var urlDB = {
  'b2xVn2': 'http://www.lighthouselabs.ca',
  '9sm5xK': 'http://www.google.com',
  'p98nb5': 'http://www.downtowndecks.com',
  '23cb6v': 'http://helm.life'
};



app.get('/', (request, response) => {
  response.send('Hello!');
});

app.get('/urls.json', (request, response) => {
  response.json(urlDB);
});

app.get('/hello', (request, response) => {
  response.send('<html><body>Hello <b>World</b></body></html>')
});

app.post('/login', (request, response) => {
  response.cookie('username', request.body.username);
  response.redirect('/urls',);

});

app.get("/urls/new", (request, response) => {
  response.render("urls_new", {username: request.cookies["username"]});

});

app.post("/urls", (request, response) => {
  let tiny = random();
  urlDB[tiny] = request.body.longURL;
  response.redirect('http://127.0.0.1:8080/urls/');
});

app.get('/urls', (request, response) => {
  response.render('urls_index', {urls: urlDB, username: request.cookies["username"]});
});

app.get('/u/:shortURL', (request, response) => {
  let longURL = urlDB[request.params.shortURL];
  if (longURL.slice(0, 7) === 'http://') {
    response.redirect(longURL);
  } else {
    response.redirect('http://' + longURL);
  }
});

app.post('/urls/:shortURL/delete', (request, response) => {
  delete urlDB[request.params.shortURL];
  response.redirect('/urls',);
});

app.post('/urls/:shortURL', (request, response) => {
  urlDB[request.params.shortURL] = request.body.longURL;
  response.redirect('/urls',);
});

app.get('/urls/:id', (request, response) => {
  response.render('urls_show', {shortURL: request.params.id,
                                longURL: urlDB[request.params.id], username: request.cookies["username"]});
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);

});