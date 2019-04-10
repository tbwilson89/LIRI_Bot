require('dotenv').config();
var keys = require('./keys.js')
var axios = require('axios')
var moment = require('moment')
var Spotify = require('node-spotify-api')
var fs = require('fs')

var spotify = new Spotify(keys.spotify)

var args = process.argv.slice(2)

function getInformation(action, term){
  if (action === `concert-this`) {
    let bandsAPI = `https://rest.bandsintown.com/artists/${term}/events?app_id=codingbootcamp`
    axios.get(bandsAPI).then((res)=>{
      fs.appendFile('output.txt', `""""""""""""""""""""""""""""""""""""""""\nCommand: ${args[0]}, ${args[1]}\n`, (err)=>{if(err){throw err}})
      for (index in res.data) {
        let results = `""""""""""""""""""""""""""""""""""""""""\nVenue: ${res.data[index].venue.name}\nVenue location: ${res.data[index].venue.city}\nEvent date: ${moment(res.data[index].datetime).format('MM/DD/YYYY')}\n""""""""""""""""""""""""""""""""""""""""\n`
        fs.appendFile('output.txt', results, (err)=>{if(err){console.log(err)}})
        console.log(results)
      }
    }).catch((err)=>console.log(err))

  } else if (action === `spotify-this-song`) {
    spotify.search({type: 'track', query: term ? term : "The Sign Ace of Base"}, (err, data)=>{
      if (err) {
        return console.log(`Error occurred: ${err}`)
      }
      // for (index in data.tracks.items){
        let artists = ''
        for(i in data.tracks.items[0].artists){artists += `${i > 0 ? ',':''} ${data.tracks.items[0].artists[i].name}`}
        let results = `""""""""""""""""""""""""""""""""""""""""\nArtist(s): ${artists}\nSong Name: ${data.tracks.items[0].name}\nPreview Link: ${data.tracks.items[0].preview_url}\nSong Album: ${data.tracks.items[0].album.name}\n""""""""""""""""""""""""""""""""""""""""\n`
        fs.appendFile('output.txt', `""""""""""""""""""""""""""""""""""""""""\nCommand: ${args[0]}, ${args[1]}\n`, (err)=>{if(err){throw err}})
        fs.appendFile('output.txt', results, (err)=>{if(err){throw err}})
        console.log(results)
      // }
    })

  } else if (action === `movie-this`) {
    let queryURL
    if (!term) {
      queryURL = `http://www.omdbapi.com/?t=Mr.Nobody&y=&plot=short&apikey=trilogy`
    } else {
      queryURL = `http://www.omdbapi.com/?t=${term}&y=&plot=short&apikey=trilogy`
    }
    axios.get(queryURL).then((res) => {
      // let RTRating = res.data.Ratings[res.data.Ratings.findIndex(x => x.Source = 'Rotten Tomatoes')].Value
      let results = `""""""""""""""""""""""""""""""""""""""""\nMovie Title: ${res.data.Title}\nRelease Year: ${res.data.Released.slice(-4)}\nMovie Rating: ${res.data.imdbRating}\nRotten Tomatoes Rating: ${res.data.Ratings[1].Value}\nProduced in: ${res.data.Country}\nLanguage(s): ${res.data.Language}\nMovie Plot: ${res.data.Plot}\nActors: ${res.data.Actors}\n""""""""""""""""""""""""""""""""""""""""\n`
      fs.appendFile('output.txt', `""""""""""""""""""""""""""""""""""""""""\nCommand: ${args[0]}, ${args[1]}\n`, (err)=>{if(err){throw err}})
      fs.appendFile('output.txt', results, (err)=>{if(err){ throw err }})
      console.log(results)
    }).catch((err)=>console.log(err))
  }
}

if(args[0] === `do-what-it-says`){
  fs.readFile('random.txt', 'utf8', (err, data)=>{
    if(err){console.log(err)}
    let searchInfo = data.split(',')
    getInformation(searchInfo[0], searchInfo[1])
  })
} else {
  getInformation(args[0], args[1])
}
