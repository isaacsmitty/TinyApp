const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session')
const random = require('./randomString.js');
const bcrypt = require('bcrypt');

const PORT = 8080;

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieSession({
  name: 'session',
  keys: ['put that shit it everything'],
}));

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
     password: '$2b$10$U7OBGTxkBi2msVn3MNsu2eoHgf05CaGUmKnBTK0wabXcmYchDXMbu'
   },
   f74b36:
   { id: 'f74b36',
     email: 'isaac@elize.ca',
     password: '$2b$10$xkteF6yAD9staQbm/pj6Pe3SJCJ.pOLKQ3DBCNrXAkdy/JV7pAQOm'
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
  if (request.session.user_id) {
    response.redirect('/urls')
  } else {
    response.redirect('/login')
  };
});

app.get('/urls.json', (request, response) => {
  response.json(urlDB);
});

app.get('/register', (request, response) => {
  if (request.session.user_id) {
    response.redirect('/urls')
  } else {
  let templateVars = {user: users[request.session.user_id]}
  response.render('registration', templateVars);
  }
});

app.post('/register', (request, response) => {
  if (request.body.email === '' || request.body.password === '') {
    response.status(400).send('<html><body><h1><b>Invalid Email or Password. Please try again.</b></1></body></html>');
  } else if (checkDBForEmail(request.body.email)) {
    response.status(400).send('<html><body><h1><b>Email is already registered. Please try again.</b></1></body></html>');
  } else {
    let hash = bcrypt.hashSync(request.body.password, 10);
    console.log(hash);
    let id = random();
    users[id] = {'id': id, email: request.body.email, password: hash};
    request.session.user_id = id;
    response.redirect('/urls');
  }
});

app.get('/login', (request, response) => {
  if (request.session.user_id) {
    response.redirect('/urls')
  } else {
  let templateVars = {user: users[request.session.user_id]}
  response.render('login', templateVars);
  }
});

app.post('/login', (request, response) => {
  const objectID = checkDBForEmail(request.body.email)
  if (!objectID) {
    response.status(403).send('<html><body><h1><b>Invalid Email. Please try again.</b></1></body></html>');
  } else if (bcrypt.compareSync(request.body.password, objectID.password)) {
    request.session.user_id = objectID.id;
    response.redirect('/urls');
  } else {
    response.status(403).send('<html><body><h1><b>Invalid password. Please try again.</b></1></body></html>');
  }
});

app.post('/urls', (request, response) => {
  let shortURL = random();
  urlDB[shortURL] = {longURL: request.body.longURL, userID: request.session.user_id};
  response.redirect('/urls');
});

app.get('/urls', (request, response) => {
  if (request.session.user_id) {
    let accessableURLs = urlsForUser(request.session.user_id);
    let templateVars = {urls: accessableURLs, user: users[request.session.user_id]};
    response.render('urls_index', templateVars);
  } else {
    response.redirect('/login');
  }
});

app.get("/urls/new", (request, response) => {
  if (checkDBForLogin(request.session.user_id)) {
    let templateVars = {urls: urlDB, user: users[request.session.user_id]};
    response.render('urls_new', templateVars);
  } else {
    let templateVars = {urls: urlDB, user: users[request.session.user_id]};
    response.render('login', templateVars);
  }
});

app.get('/u/:shortURL', (request, response) => {
  let longURL = urlDB[request.params.shortURL].longURL;
  if (longURL.slice(0, 7) === 'http://') {
    response.redirect(longURL);
  } else {
    response.redirect('http://' + longURL);
  }
});

app.post('/urls/:shortURL', (request, response) => {
  urlDB[request.params.shortURL].longURL = request.body.longURL;
  response.redirect('/urls',);
});

app.post('/urls/:shortURL/delete', (request, response) => {
  delete urlDB[request.params.shortURL];
  response.redirect('/urls',);
});

app.get('/urls/:id', (request, response) => {
  if (request.session.user_id === urlDB[request.params.id].userID) {
    let templateVars = {
      shortURL : request.params.id,
      longURL  : urlDB[request.params.id].longURL,
      user     : users[request.session.user_id]
    }
    response.render('urls_show', templateVars);
  } else if (request.session.user_id) {
      response.redirect('/urls');
  } else {
      response.redirect('/login');
  }
});

app.post('/logout', (request, response) => {
  request.session = null;
  response.redirect('/urls');

});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);

});