// Required packages and config files for running LIRI Bot
require("dotenv").config(); // Holds API keys and is not tracked by Git
var inquirer = require("inquirer"); // Inquirer for user input in terminal
const axios = require('axios'); // Axios for HTTP GET requests
var moment = require("moment"); // Moment for formatting date and time
var fs = require('fs'); // FileStore for reading files
var Spotify = require('node-spotify-api'); // Spotfy for retrieving song/track data
var keys = require("./keys.js"); // File for mapping of API keys to Spotofy API

// Spotify object for retrieving Spotify API keys
var spotify = new Spotify(keys.spotify);

// Global variable to store the user's name
var username;

// Terminal output that indicates that LIRI Bot has started
console.log("\nInitializing LIRI Bot...\n");

// Function to capture the user's name for personalization
function loginUser()
{
    // Requires the user to input his/her name
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
        
        // Welcomes the users with his/her name
        console.log("\n\nWelcome to LIRI Bot Beta, " + response.username +"!\n");
        
        // Invokes the function which allows the user to pick the task he/she wishes to perform
        pickTask();
    });
}

// Function which allows the user to pick the task he/she wishes to perform
function pickTask()
{
    var task;
    
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

        // Switch that invokes the function associated with the task the user wishes to perform
        switch(task)
        {
            // Invokes concertThis function
            case "Concert This":
                concertThis();
                break;

            // Invokes spotifySong function
            case "Spotify This Song":
                spotifySong();
                break;

            // Invokes movieThis function
            case "Movie This":
                movieThis();
                break;

            // Invokes doIt function            
            case "Do What It Says":
                doIt();
                break
        }
    });
}

// Function which prompts the user to indicate if he/she wants to complete another task
function somethingElse(text)
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
        // Invokes the pickTask function if the user wishes to perform another task
        if(response.choice == true)
        {
            console.log("\n");
            pickTask();
        }

        // Exits the code if the user is done using LIRI Bot
        else{
            console.log("\nThank you for using LIRI Bot Beta, " + username + "! Have a great day. Goodbye!\n");
            process.exit();
        }
    });
}

// Function which looks up concert info for a band/artist the user inputs using the Bands In Town API
function concertThis(value)
{
    // Switch that checks to see if an argument was passed when the function was invoked
    // If no argument is entered (undefined), then user is prompted to enter an artist/band
    // IF an argument is entered, then the user is not prompted to enter an artist/band
    switch(value)
    {
        case undefined:
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
            
                    // Invokes the Bands In Town API using Axios to retrieve concert information
                    axios.get("https://rest.bandsintown.com/artists/" + band + "/events?app_id=codingbootcamp")
                    .then(function(response)
                    {
                        
            
                        
                        for(i = 0; i < 10; i++)
                        {
                            console.log("<><><><><><><> Concert " + (i+1) + " <><><><><><><>\nVenue: " + response.data[i].venue.name);
                            console.log("Location: " + response.data[i].venue.city + ", " + response.data[i].venue.region + ", " + response.data[i].venue.country);
                            console.log("Date: " + moment(response.data[i].datetime).format('MMMM DD YYYY, h:mm:ss a') + "\n<><><><><><><><><><><><><><><><><><><><>\n");
                        }
                        somethingElse();
                    })
                    // Catches errors if the HTTP request fails or no results are returned from the Band In Town API response
                    .catch(function(error)
                    {
                        console.log("\nUh oh! Something went wrong. I promise it's not you. It's me. I may not have found the artist/band you entered. Please try again.\n");
                        somethingElse();
                    });
                });
        break;

        default:
                var band = value;
            
                // Invokes the Bands In Town API using Axios to retrieve concert information
                axios.get("https://rest.bandsintown.com/artists/" + band + "/events?app_id=codingbootcamp")
                .then(function(response)
                {
                    for(i = 0; i < 5; i++)
                    {
                        console.log("<><><><><><><> Concert " + (i+1) + " <><><><><><><>\nVenue: " + response.data[i].venue.name);
                        console.log("Location: " + response.data[i].venue.city + ", " + response.data[i].venue.region + ", " + response.data[i].venue.country);
                        console.log("Date: " + moment(response.data[i].datetime).format('MMMM DD YYYY, h:mm:ss a') + "\n<><><><><><><><><><><><><><><><><><><><>\n");
                    }
                    somethingElse();
                })
                // Catches errors if the HTTP request fails or no results are returned from the Band In Town API response
                .catch(function(error)
                {
                    console.log("\nUh oh! Something went wrong. I promise it's not you. It's me. I may not have found the artist/band you entered. Please try again.\n");
                    somethingElse();
                });
            break;
    }
}

// Function which looks up info for a song/track the user inputs using the Spotify API
function spotifySong(value)
{
    var song;

    // Switch that checks to see if an argument was passed when the function was invoked
    // If no argument is entered (undefined), then user is prompted to enter an artist/band
    // IF an argument is entered, then the user is not prompted to enter an artist/band
    switch(value)
    {
        case undefined:
            inquirer.prompt(
            [
                {
                    name: "song",
                    message: "What song title would you like to look up on Spotify?"
                }
            ]).then(function(response)
            {
                song = response.song;
                
                // Conditional to check if the user entered no artist/band
                if(song === "")
                {
                    song = "I Saw the Sign Ace of Base";
                }
                    // Invokes the Spotify API using Axios to retrieve song/track information
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
                        
                        console.log("<><><><><><><> Spotify A Song <><><><><><><>\nArtist(s): " + artist);
                        console.log("Song Name: " + track);
                        console.log("Preview Link: " + previewUrl);
                        console.log("Album: " + album + "\n<><><><><><><><><><><><><><><><><><><><><><>\n");
                        somethingElse();
                    })
                    // Catches errors if the HTTP request fails or no results are returned from the Spotify API response
                    .catch(function(err)
                    {
                        console.log("\nUh oh! Something went wrong. I promise it's not you. It's me. I may not have found the song you are looking for. Please, try again\n");
                        somethingElse();
                    });
                });
            break
        
        default:
                song = value;
                
                // Conditional to check if the user entered no artist/band; if not artist/band is entered, the Ace of Base's "I Saw the Sign" is invoked
                if(song === "")
                {
                    song = "I Saw the Sign Ace of Base"
                }
                    // Invokes the Spotify API using Axios to retrieve song/track information
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
                        
                        console.log("\n<><><><><><><> Spotify A Song <><><><><><><>\nArtist(s): " + artist);
                        console.log("Song Name: " + track);
                        console.log("Preview Link: " + previewUrl);
                        console.log("Album: " + album + "\n<><><><><><><><><><><><><><><><><><><><><><>\n");
        
                        somethingElse();
                    })
                    // Catches errors if the HTTP request fails or no results are returned from the Spotify API response
                    .catch(function(err)
                    {
                        console.log("\nUh oh! Something went wrong. I promise it's not you. It's me. I may not have found the song you are looking for. Please, try again.\n");
                        somethingElse();
                    });
            break;
    }
    
}

// Function which looks up info for a movie entered by the user
function movieThis(value)
{
    
    // Switch that checks to see if an argument was passed when the function was invoked
    // If no argument is entered (undefined), then user is prompted to enter an artist/band
    // IF an argument is entered, then the user is not prompted to enter an artist/band
    switch(value)
    {
        case undefined:
                inquirer.prompt(
                    [
                        {
                            name: "movie",
                            message: "Which movie would you like to see info on?",
                        }
                        ]).then(function(response)
                        {   
                            var movie = response.movie;

                            // Conditional which checks to see if the user entered a movie; if not, searches for Mr. Nobody
                            if(movie === "")
                            {
                                movie = "Mr. Nobody";
                            }
                
                                // Invokes the OMDB API using Axios to retrieve movie information
                                axios.get("http://www.omdbapi.com/?apikey=1a62d00c&t=" + movie)
                                .then(function(response) {
                                console.log("Title: " + response.data.Title);
                                console.log("Year: " + response.data.Year);
                                console.log("IMDB Rating: " + response.data.Ratings[0].Value);
                                console.log("Rotten Tomatoes Rating: " + response.data.Ratings[1].Value);
                                console.log("Country: " + response.data.Country);
                                console.log("Language: " + response.data.Language);
                                console.log("Plot: " + response.data.Plot);
                                console.log("Actors: " + response.data.Actors + "\n");
                                somethingElse();
                                })
                                // Catches errors if the HTTP request fails or no results are returned from the OMDB API response
                                .catch(function(error)
                                {
                                    console.log("Uh oh! Something went wrong. I promise it's not you. It's me. I may not have found the movie you are looking for. Please, try again. \n");
                                    somethingElse();
                                });
                        });
            break

        default:
                var movie = value;
                
                // Invokes the OMBD API using Axios to retrieve movie information
                axios.get("http://www.omdbapi.com/?apikey=1a62d00c&t=" + movie)
                .then(function(response) {
                console.log("Title: " + response.data.Title);
                console.log("Year: " + response.data.Year);
                console.log("IMDB Rating: " + response.data.Ratings[0].Value);
                console.log("Rotten Tomatoes Rating: " + response.data.Ratings[1].Value);
                console.log("Country: " + response.data.Country);
                console.log("Language: " + response.data.Language);
                console.log("Plot: " + response.data.Plot);
                console.log("Actors: " + response.data.Actors + "\n");
                somethingElse();
            })
            // Catches errors if the HTTP request fails or no results are returned from the OMDB API response
            .catch(function(error)
            {
                console.log("Uh oh! Something went wrong. I promise it's not you. It's me. I may not have found the movie you are looking for. Please, try again.\n");
                somethingElse();
            });
    }
}

// Function which reads a text file and invokes the correct function above using data in the file
function doIt()
{
    // Local variables to parse the file
    var text = [];
    var command = "";
    var query = "";
    
    // Uses FileStore readFile function to read the random.txt file
    fs.readFile('random.txt', 'utf8', function(err, contents) {
        
        // Populates an array by splitting the text in the file
        text = contents.split(",");

        // Sets the command variable to the first item in the array
        command = text[0];

        // Sets the query variable to the second item in the array and removes quotation marks around the query parameter in the text file
        query = text[1].substring(1, (text[1].length - 1));

        // Switch which invokes the correct task function based upon the text in the file
        // Uses the query variable to perform the function without user input since it is coming from the text file
        switch(command)
        {
            case "concert-this":
                concertThis(query);
                break

            case "spotify-this-song":
                spotifySong(query);
                break

            case "movie-this":
                movieThis(query);
                break
        }
    });
}

// Kicks off the LIRI Bot command line program
loginUser();
