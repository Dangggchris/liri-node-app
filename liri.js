require("dotenv").config();
var fs = require("fs");
var keys = require("./keys.js");
var axios = require("axios");
var Spotify = require("node-spotify-api");
var moment = require("moment");
var spotify = new Spotify(keys.spotify);

var action = process.argv[2]; 

var linebreak = ("\n---------------------------------------------------");

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
    
    var bandURL = "https://rest.bandsintown.com/artists/" + argv + "/events?app_id=codingbootcamp";

    axios
  .get(bandURL)
  .then(function(response) {
    var responseDate = response.data[0].datetime;
    var convertDate = moment(responseDate);

    console.log("The venue will be " + response.data[0].venue.name + ".");
    console.log("The location of the venue will be " + response.data[0].venue.city + ", " + response.data[0].venue.region + " " + response.data[0].venue.country + ".");
    console.log("Concert Date: " + convertDate.format("MM/DD/YYYY"));

    var concertEntry = ("\nUser Entry: " + argv)
    var concertVenue = ("\nThe venue will be " + response.data[0].venue.name + ".");
    var concertLoc = ("\nThe location of the venue will be " + response.data[0].venue.city + ", " + response.data[0].venue.region + " " + response.data[0].venue.country + ".");
    var concertTime = ("\nConcert Date: " + convertDate.format("MM/DD/YYYY"));

    fs.appendFile("log.txt", (linebreak + concertEntry + concertVenue + concertLoc + concertTime), function(err) {
      if (err) {
        console.log(err);
      }
      else {
        console.log("Content Added to Log!");
      }
    });

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

      var artistEntry = ("\nUser Entry: " + argv)
      var artistName = ("\nThe Artist is: " + response.artists[0].name); 
      var artistTrack = ("\nThe trackname is: " + response.name);
      var artistLink = ("\nThe preview link is: " + response.external_urls.spotify);
      var artistAlbum = ("\nThe album is: " + response.album.name);

        fs.appendFile("log.txt", (linebreak + artistEntry + artistName + artistTrack + artistLink + artistAlbum), function(err) {
          if (err) {
            console.log(err);
          }
          else {
            console.log("Content Added to Log!");
          }
        });
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

        var movieEntry = ("\nUser Entry: " + movieName);
        var movieTitle = ("\nTitle: " + results.Title);
        var movieRelease = ("\nYear: " + results.Year);
        var movieIMDB = ("\nIMDB Rating: " + results.Ratings[0].Value);
        var movieRT = ("\nRotten Tomatoes Rating: " + results.Ratings[1].Value);
        var movieCountry = ("\nCountry: " + results.Country);
        var movieLang = ("\nLanguage: " + results.Language);
        var moviePlot = ("\nPlot: " + results.Plot);
        var movieActors = ("\nActors: " + results.Actors);

          fs.appendFile("log.txt", (linebreak + movieEntry + movieTitle + movieRelease + movieIMDB + movieRT + movieCountry + movieLang + moviePlot + movieActors), function(err) {
            if (err) {
              console.log(err);
            }
            else {
              console.log("Content Added to Log!");
            }
          });

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

        if (action === 'concert-this') {
            var string = dataArr[1];
            var argv = string.substring(1, string.length-1);
            
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