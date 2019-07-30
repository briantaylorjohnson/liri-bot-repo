require("dotenv").config();
var Spotify = require('node-spotify-api');
var util = require("util");

var keys = require("./keys.js");
var spotify = new Spotify(keys.spotify);
var operation = process.argv[2];
var argumentOne = process.argv[3];

if (operation === "concert-this")
{
    console.log("Concert this!");
}

else if (operation === "spotify-this-song")
{
    console.log("Spotify this song!");
    spotify
        .search({ type: 'track', query: argumentOne, limit: 1 })
        .then(function(response)
        {
            var track = response.tracks.items[0].name;
            var artist = response.tracks.items[0].artists[0].name;
            var previewUrl = response.tracks.items[0].preview_url;
            var album = response.tracks.items[0].album.name;

            if (previewUrl == null)
            {
                previewUrl = "No preview available at this time.";
            }

            console.log("");
            console.log("<><><><><><><> Spotify A Song <><><><><><><>");
            console.log("Artist(s): " + artist);
            console.log("Song Name: " + track);
            console.log("Preview Link: " + previewUrl);
            console.log("Album: " + album);
            console.log("<><><><><><><><><><><><><><><><><><><><><><>");
            console.log("");
        })
        .catch(function(err)
        {
            console.log("Whoops! Looks like something went wrong. Please try again.");
    });
}

else if (operation === "movie-this")
{
    console.log("Movie this!");
}

else if (operation === "do-what-it-says")
{
    console.log("Do what it says!");
}

else
{
    console.log("Pleaes enter a valid command line operation.");
}
