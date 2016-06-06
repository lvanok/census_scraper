var express = require('express');
var app = express();
var request = require('request');
var cheerio = require('cheerio');
var bodyParser = require('body-parser');
//Database configuration
// app.use(methodOverride('_method'));
var exphbs = require('express-handlebars');
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');
var mongojs = require('mongojs');
var databaseUrl = "scraperr";
var collections = ["scrapedData"];
var db = mongojs(databaseUrl, collections);
db.on('error', function(err) {
  console.log('Database Error:', err);
});

app.use(express.static('public'));
app.use(bodyParser.urlencoded({
  extended: false
}))

//creating a collection
function generateUrls(limit) {
  var url = 'http://quickfacts.census.gov/';
  var urls = [];
  var i;
  for (i=1; i < limit; i++) {
    urls.push(url + i);
  }
  return urls;
}

//retrieve artices with cheerio
var cheerio = require('cheerio');
var html = '<div><ul><li>1</li><li id="mynum">2</li><li>3</li></ul></div>';
var $ = cheerio.load(html);
// get my number
var mynum = $('#mynum').text();
console.log(mynum) // logs 2

// Routes
app.get('/', function(req, res) {
  res.send(index.html);
});

//Save to DB
app.post('/submit', function(req, res) {
  console.log(req.body);
  db.notes.save(req.body, function(err, saved) {
    if (err) {
      console.log(err);
    } else {
      res.send(saved);
    }
  });
});


//api
//Get from DB
app.get('/all', function(req, res) {
  db.notes.find({}, function(err, found) {
    if (err) {
      console.log(err);
    } else {
      res.json(found);
    }
  });
});


app.get('/all', function(req, res) {
  app.get('/scrape', function(req, res) {
  request('http://quickfacts.census.gov/', function(error, response, html) {
  if (title && link) {
        db.scrapedData.save({
          title: title,
          link: link
        }, function(err, saved) {
          if (err) {
            console.log(err);
          } else {
            console.log(saved);
          }
        });
      }
    });
  });
  res.send("Scrape Complete");
});

//Find One in DB
app.get('/find/:id', function(req, res){

    //when searching by an id, the id needs to be passed in as (mongojs.ObjectId(IDYOUWANTTOFIND))
    console.log(req.params.id);
    db.notes.findOne({
        '_id': mongojs.ObjectId(req.params.id)
    }, function(err, found){
        if (err) {
            console.log(err);
            res.send(err);
        } else {
            console.log(found);
            res.send(found);
        }
    });
});


//Update One in the DB
app.post('/update/:id', function(req, res) {
    //when searching by an id, the id needs to be passed in as (mongojs.ObjectId(IDYOUWANTTOFIND))

  db.notes.update({
    '_id': mongojs.ObjectId(req.params.id)
  }, {
    $set: {
            'title': req.body.title,
      'note': req.body.note,
            'modified': Date.now()
    }
  }, function(err, edited) {
    if (err) {
      console.log(err);
            res.send(err);
    } else {
      console.log(edited);
            res.send(edited);
    }
  });
});


//Delete One from the DB
app.get('/delete/:id', function(req, res) {
  db.notes.remove({
    "_id": req.params.id
  }, function(err, removed) {
    if (err) {
      console.log(err);
            res.send(err);
    } else {
      console.log(removed);
      res.send(removed);
    }
  });
});


//Clear the DB
app.get('/clearall', function(req, res) {
    db.notes.remove({}, function(err, response){
        if (err){
            console.log(err);
            res.send(err);
        } else {
            console.log(response);
            res.send(response);
        }
    });
});



app.listen(3000, function() {
  console.log('App running on port 3000!');
});