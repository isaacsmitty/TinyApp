const express = require('express');
const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));

const PORT = 8080;

app.set('view engine', 'ejs');

function generateRandomString() {
  let string = Math.random().toString(36).substring(7);
  return(string);
}
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
  urlDB[generateRandomString()] = request.body.longURL;
  // console.log(request.body);  // Log the POST request body to the console
  // response.send("Ok");
           // Respond with 'Ok' (we will replace this)
  //console.log(string);
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