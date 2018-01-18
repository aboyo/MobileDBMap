var express = require('express');
var router = express.Router();

//var geocoder = require('geocoder');
var geocoder = require('google-geocoder');
var geo = geocoder({
  key: 'AIzaSyBHAs9rP_Xv0WmS0q-sEUpFv9s6QF38vp8'
});

var xlsx = require('node-xlsx');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost');

var fscTvModel;

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  // we're connected!
  console.log('mongodb connected!');

  // Drop the 'foo' collection from the current database
  // db.db.dropDatabase(function (err, result) {
  //   console.log('drop:');
  //   console.log(result);
  //   if (result) {
      var fscTvSchema = mongoose.Schema({
        num: String,
        title: String,
        employment: String,
        region: String,
        address: String,
        startDate: String,
        endDate: String,
        startTime: String,
        endTime: String,
        loc: String
      });
      fscTvModel = db.model('USER', fscTvSchema);
  //   }
  // });
});

/* GET home page. */
router.get('/', function (req, res, next) {
  //addDatabase();
  fscTvModel.find({
     loc: {$ne : ''}
  }).lean().exec(function (err, element) {
    console.log('find:');
    console.log(element.length);
    var myJsonString = JSON.stringify(element);
    res.render('mainactivity', {
      list: myJsonString
    });
  });

  //res.render('index');
});

function addDatabase() {
  var xlsxObj = xlsx.parse('./public/myFile.xlsx'); // parses a file
  console.log(xlsxObj);
  //var myJsonString = JSON.stringify(xlsxObj);
  xlsxObj[0].data.forEach(function (element, index) {
    console.log("index:");
    console.log(index);

    if (index > 1) {
      console.log(element[0]);

      //////////////////////
      setTimeout(function () {
        // Geocoding 
        geo.find(element[4], function (err, data) {
          // do something with data 
          // console.log(data.results[0].geometry.location.lat);
          // console.log(data.results[0].geometry.location.lng);
          var loc;
          try {
            loc = "{lat:" + data[0].location.lat + ",lng:" + data[0].location.lng + "}";
            console.log(data[0].location);
          } catch (error) {
            loc = '';
          }

          var fscTvEntity = new fscTvModel({
            num: element[0],
            title: element[1],
            employment: element[2],
            region: element[3],
            address: element[4],
            startDate: element[5],
            endDate: element[6],
            startTime: element[7],
            endTime: element[8],
            loc: loc
          });

          fscTvEntity.save(function () {
            console.log("save:" + fscTvEntity.title);
          });
        });
      }, 800 * index);
      //////////////////////
    }

  }, this);

  // geocoder.geocode('台南市中西區青年路81號', function (err, data) {
  //   // do something with data 
  //   // console.log(data.results[0].geometry.location.lat);
  //   // console.log(data.results[0].geometry.location.lng);
  //   console.log(data);
  // });

}

module.exports = router;