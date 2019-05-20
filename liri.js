require("dotenv").config();
var keys = require("./keys.js");
var axios = require("axios");
var Spotify = require("node-spotify-api");
var moment = require("moment");

var spotify = new Spotify(keys.spotify);

var action = process.argv[2]; 

// conditional statements
if (action === 'concert-this') {
    var argv = process.argv[3];
    concert(argv);
}
else if (action === 'spotify-this-song') {
    var argv = process.argv[3];
    songInfo(argv);   
}
else if (action === 'movie-this') {

    // Default to Mr Nobody if there is no process.argv[3]
    if (process.argv[3]) {
      var argv = process.argv[3];
      movie(argv);
    }
    else {
      var argv = "Mr Nobody";
      movie(argv); 
    }
    
}
else if (action === 'do-what-it-says') {
    whatever();
}


// Functions
function concert(argv) {
    
    console.log(argv);
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
    console.log(error);
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
    var movieName = argv;

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
      console.log(error);
    });
}

function whatever() {

  var fs = require("fs");

    fs.readFile("random.txt", "utf8", function(error, data) {

        if (error) {
          return console.log(error);
        }

        var dataArr = data.split(",");
        
        var action = dataArr[0];
        

        console.log(dataArr);

        if (action === 'concert-this') {
            var string = dataArr[1];
            var argv = string.substring(1, string.length-1);
            console.log(argv);
            
            concert(argv);
        }
        else if (action === 'spotify-this-song') {
            var argv = dataArr[1];
            songInfo(argv);   
        }
        else if (action === 'movie-this') {
        
            var argv = dataArr[1];
            movie(argv);    
        }
      
      });
}