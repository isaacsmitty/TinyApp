const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
const cookieParser = require('cookie-parser');
app.use(cookieParser('long rambling statement'));
const random = require('./randomString.js');
//const checkDBForEmail = require('./checkDBForEmail.js')

const PORT = 8080
;

app.set('view engine', 'ejs');

const urlDB = {
  'b2xVn2': {longURL: 'http://www.lighthouselabs.ca', userID: 'f74b36'},
  '9sm5xK': {longURL: 'http://www.google.com', userID: 'gu6g6f'},
  'p98nb5': {longURL: 'http://www.downtowndecks.com', userID: 'gu6g6f'},
  '23cb6v': {longURL: 'http://helm.life', userID: 'f74b36'}
};

function urlsForUser(id) {
  let accessableURLs = {};
  for (let shortURL in urlDB) {
    if (urlDB[shortURL].userID === id) {
      accessableURLs[shortURL] = urlDB[shortURL].longURL;
    }
  }
  return accessableURLs;
}
const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  },
  gu6g6f:
   { id: 'gu6g6f',
     email: 'isaac.smitty@gmail.com',
     password: '12345'
   },
   f74b36:
   { id: 'f74b36',
     email: 'isaac@elize.ca',
     password: '12345'
   }
}

function checkDBForEmail(email) {
  for (var id in users) {
    if (users[id].email === email) {
      return users[id];
    }
  }
    return false;
};

function checkDBForLogin(cookie) {
  for (var id in users) {
    if (users[id].id === cookie) {
      return true;
    }
  }
    return false;
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

app.get('/register', (request, response) => {
  let templateVars = {user: users[request.cookies["user_id"]]}
  response.render('registration', templateVars);
});

app.post('/register', (request, response) => {
  if (request.body.email === '' || request.body.password === '') {
    response.send ('400 : invalid email or password');
  } else if (checkDBForEmail(request.body.email)) {
    response.send ('400 : Email is already used.');
  } else {
    let id = random();
    console.log(id);
    users[id] = {'id': id, email: request.body.email ,password: request.body.password};
    response.cookie('user_id', id);
    response.redirect('/urls');
  }
});

app.get('/login', (request, response) => {
  let templateVars = {user: users[request.cookies["user_id"]]}
  response.render('login', templateVars);
});

app.post('/login', (request, response) => {
  //console.log(request.body);
  const objectID = checkDBForEmail(request.body.email)
  if (!objectID) {
    response.send ('403 : Invalid Email');
  } else if ((objectID.password !== request.body.password)) {
  response.send ('403 : Invalid Password')
  } else {
    response.cookie('user_id', objectID.id);
    response.redirect('/urls');
  }
});

app.post('/logout', (request, response) => {
  response.clearCookie('user_id');
  response.redirect('/urls',);

});

app.get("/urls/new", (request, response) => {
  if (checkDBForLogin(request.cookies['user_id'])) {
    let templateVars = {urls: urlDB, user: users[request.cookies["user_id"]]};
    response.render('urls_new', templateVars);
  } else {
    let templateVars = {urls: urlDB, user: users[request.cookies["user_id"]]};
    response.render('login', templateVars);
  }
});

app.post('/urls', (request, response) => {
  // let accessableURLs = urlsForUser(request.cookies['user_id']);
  let shortURL = random();
  urlDB[shortURL] = {longURL: request.body.longURL, userID: request.cookies["user_id"]};
  response.redirect('http://127.0.0.1:8080/urls/');
});

app.get('/urls', (request, response) => {
  let accessableURLs = urlsForUser(request.cookies['user_id']);
  //console.log(accessableURLs);
  let templateVars = {urls: accessableURLs, user: users[request.cookies["user_id"]]};
  response.render('urls_index', templateVars);
});

app.get('/u/:shortURL', (request, response) => {
  let longURL = urlDB[request.params.shortURL].longURL;
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
  urlDB[request.params.shortURL].longURL = request.body.longURL;
  response.redirect('/urls',);
});

app.get('/urls/:id', (request, response) => {
  let templateVars = {shortURL: request.params.id,
   longURL: urlDB[request.params.id].longURL,
   user: users[request.cookies["user_id"]]}
  response.render('urls_show', templateVars);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);

});