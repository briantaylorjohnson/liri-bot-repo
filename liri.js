require("dotenv").config();
var inquirer = require("inquirer");
const axios = require('axios');
var moment = require("moment");

var Spotify = require('node-spotify-api');
var util = require("util");

var keys = require("./keys.js");
var spotify = new Spotify(keys.spotify);
var operation;
//var argumentOne = process.argv[3];
var username = "";
var task = "";

console.log("\nInitializing LIRI Bot...\n");

function loginUser()
{
    inquirer.prompt(
    [
        {
            name: "username",
            message: "Please enter your name:",
            validate: function(value)
            {
                if(value == "")
                {
                    return false;
                }
                return true;
            }
        }
    ]).then(function(response)
    {
        username = response.username;
        console.log("\n\nWelcome to LIRI Bot Beta, " + response.username +"!\n");
        
        pickTask();
    });
}

function pickTask()
{
    inquirer.prompt(
    [
        {
            type: "list",
            name: "task",
            message: "What would you like to do?",
            choices:
            [
                "Concert This",
                "Spotify This Song",
                "Movie This",
                "Do What It Says"
            ]
        }
    ]).then(function(response)
    {
        task = response.task;
        console.log("\nRighty-o! Let's " + task.toLowerCase() + "!\n");

        switch(task)
        {
            case "Concert This":
                concertThis();
                break;

            case "Spotify This Song":
                spotifySong();
                break;

            case "Movie This":
                movieThis();
                break;
            
            case "Do What It Says":
                doIt();
                break
        }
    });
}

function somethingElse()
{
    inquirer.prompt(
    [
        {
            type: "confirm",
            name: "choice",
            message: "Would you like to do something else?",  
            default: true  
        }
    ]).then(function (response)
    {
        if(response.choice == true)
        {
            pickTask();
        }

        else{
            console.log("\nThank you for using LIRI Bot Beta, " + username + "! Have a great day. Goodbye!\n");
            process.exit();
        }
    });
}

function concertThis()
{
    inquirer.prompt(
    [
        {
            name: "band",
            message: "Which artist/band would you like to see concert info on?",
            validate: function(value)
            {
                if(value == "")
                {
                    return false;
                }
                return true;
            }
        }
    ]).then(function(response)
    {
        var band = response.band;

        axios.get("https://rest.bandsintown.com/artists/" + band + "/events?app_id=codingbootcamp")
        .then(function(response)
        {
            

            
            for(i = 0; i < 5; i++)
            {
                console.log("Venue: " + response.data[i].venue.name);
                console.log("Location: " + response.data[i].venue.city + ", " + response.data[i].venue.region + ", " + response.data[i].venue.country);
                console.log("Date: " + moment(response.data[i].datetime).format('MMMM DD YYYY, h:mm:ss a') + "\n");
            }
            somethingElse();
        })
        .catch(function(error)
        {
            console.log("Uh oh! Something went wrong. I promise it's not you. It's me. Try again later.");
            somethingElse();
        });
    });
}

function spotifySong()
{
    var song;

    inquirer.prompt(
    [
        {
            name: "song",
            message: "What song title would you like to look up on Spotify?"
        }
    ]).then(function(response)
    {
        song = response.song;
        
        if(song !== "")
        {
            spotify
            .search({ type: 'track', query: song, limit: 1 })
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

                somethingElse();
            })
            .catch(function(err)
            {
                console.log("Uh oh! Something went wrong. I promise it's not you. It's me. Try again later.");
                somethingElse();
            });
        }
        else
        {
            console.log("\n<><><><><><><> Spotify A Song <><><><><><><>");
            console.log("Artist(s): Ace of Base");
            console.log("Song Name: The Sign");
            console.log("Preview Link: https://p.scdn.co/mp3-preview/4c463359f67dd3546db7294d236dd0ae991882ff?cid=f36a84e4bc524e7692764fdaf45eb206");
            console.log("Album: The Sign (US Album) [Remastered]");
            console.log("<><><><><><><><><><><><><><><><><><><><><><>");
            console.log("");

            somethingElse();
        }
    }); 
}

function movieThis()
{
    console.log("Movie this!");

    axios.get("http://www.omdbapi.com/?apikey=1a62d00c&t=Forrest+Gump")
    .then(function(response) {

        console.log("Title: " + response.data.Title);
        console.log("Year: " + response.data.Year);
        console.log("IMDB Rating: " + response.data.Ratings[0].Value);
        console.log("Rotten Tomatoes Rating: " + response.data.Ratings[1].Value);
        console.log("Country: " + response.data.Country);
        console.log("Language: " + response.data.Language);
        console.log("Plot: " + response.data.Plot);
        console.log("Actors: " + response.data.Actors);
    })
    .catch(function(error)
    {
        console.log(error);
    });
}

function doIt()
{
    console.log("Do what it says!");
}

loginUser();
