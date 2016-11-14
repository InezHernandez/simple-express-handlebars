var fs = require('fs');
var path = require('path');
var express = require('express');
var exphbs = require('express-handlebars');
var people = require('./people');
var app = express();
var port = process.env.PORT || 3000;

/*
 * Do some preprocessing on our data to make special note of people 65 or
 * older.
 */
Object.keys(people).forEach(function (person) {
  if (people[person].age >= 65) {
    people[person].is65OrOlder = true;
  }
});

// Serve static files from public/.
app.use(express.static(path.join(__dirname, 'public')));

app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars');

app.get('/', function (req, res) {
  res.render('index-page');
});

app.get('/people', function (req, res) {
  res.render('people-page', { people: people });
});


app.get('/people/:person', function (req, res, next) {

  var person = people[req.params.person];

  if (person) {

    res.render('person-page', person);

  } else {

    // If we don't have info for the requested person, fall through to a 404.
    next();

  }

});

// If we didn't find the requested resource, send a 404 error.
app.get('*', function(req, res) {
  res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

// Listen on the specified port.
app.listen(port, function () {
  console.log("== Listening on port", port);
});
