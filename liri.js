require("dotenv").config();
var keys = require("./keys.js");
var fs = require("fs");
var axios = require("axios");
var Spotify = require("node-spotify-api");
var moment = require("moment");

var spotify = new Spotify(keys.spotify);

var action = process.argv[2]; 
var input = ""

if (action === 'concert-this') {
    var argv = process.argv[3];
    concert(argv);
}
else if (action === 'spotify-this-song') {
    var argv = process.argv[3];
    songInfo(argv);   
}
else if (action === 'movie-this') {
    movie(argv);    
}
else if (action === 'do-what-it-says') {
    var argv = process.argv;
    whatever(argv);
}

// Functions for modularization
function concert(argv) {
    
    var bandURL = "https://rest.bandsintown.com/artists/" + argv + "/events?app_id=codingbootcamp";
    console.log(bandURL);

    axios
  .get(bandURL)
  .then(function(response) {
    var responseDate = response.data[0].datetime;
    var convertDate = moment(responseDate);

    console.log("The venue will be " + response.data[0].venue.name + ".");
    console.log("The location of the venue will be " + response.data[0].venue.city + ", " + response.data[0].venue.region + " " + response.data[0].venue.country + ".");
    console.log("Concert Date: " + convertDate.format("MM/DD/YYYY"));
    
  })
  .catch(function(error) {
    if (error.response) {
      console.log(error.response.data);
      console.log(error.response.status);
      console.log(error.response.headers);
    } else if (error.request) {
      console.log(error.request);
    } else {
      console.log("Error", error.message);
    }
    console.log(error.config);
  });
}


function songInfo(argv) {

    spotify.search({ type: 'track', query: argv }, function(err, response) {
        if (err) {
          return console.log('Error occurred: ' + err);
        }
        
        var response = response.tracks.items[0];

      console.log("The Artist is: " + response.artists[0].name); 
      console.log("The trackname is: " + response.name);
      console.log("The preview link is: " + response.external_urls.spotify);
      console.log("The album is: " + response.album.name);

      });
}

function movie(argv) { 
    var movieName = "";

    for (var i = 3; i < argv.length; i++) {

        if (i > 2 && i < argv.length) {
          movieName = movieName + "+" + argv[i];
        }
    }

    var movieURL = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=40d78a3d";

    axios
    .get(movieURL)
    .then(function(response) {

        var results = response.data

        console.log("Title: " + results.Title);
        console.log("Year: " + results.Year);
        console.log("IMDB Rating: " + results.Ratings[0].Value);
        console.log("Rotten Tomatoes Rating: " + results.Ratings[1].Value);
        console.log("Country: " + results.Country);
        console.log("Language: " + results.Language);
        console.log("Plot: " + results.Plot);
        console.log("Actors: " + results.Actors);
      
    })
    .catch(function(error) {
      if (error.response) {
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        console.log(error.request);
      } else {
        console.log("Error", error.message);
      }
      console.log(error.config);
    });
}

function whatever() {

    fs.readFile("random.txt", "utf8", function(error, data) {

        if (error) {
          return console.log(error);
        }

        var dataArr = data.split(",");
        
        var action = dataArr[0];
        

        console.log(dataArr);

        if (action === 'concert-this') {
            var argv = dataArr[1];

            console.log(argv);
            
            concert(argv);
        }
        else if (action === 'spotify-this-song') {
            var argv = dataArr[1];
            songInfo(argv);   
        }
        else if (action === 'movie-this') {
            var argv = ["node", "liri", "action", dataArr[1]]

            movie(argv);    
        }
      
      });
}