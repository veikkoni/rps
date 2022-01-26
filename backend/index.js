const express = require("express");
const app = express();


const JsonDB = require('node-json-db').JsonDB;
const Config = require('node-json-db/dist/lib/JsonDBConfig').Config;
const fs = require('fs');
const cors = require('cors');

var WebSocket = require('ws');

const fetch = require("node-fetch")
var playerNames = {};
var games = [];
const cursor = "/rps/history"

var memorizedPlayer = {};
var memorizedPlayerName = "";

try {
  fs.unlinkSync('./rps-data.json');
} catch(err) {
  console.log("File already deleted");
}

var db = new JsonDB(new Config("rps-data", false, true, '/'));


db.push("/games", [])
db.push("/players", {})

app.use(cors());

function add_player_stats(player, j, winner) {

  if (!playerNames.hasOwnProperty(j[player].name)) {
    playerNames[j[player].name] = {'stats': {'wins': 0, 'games': 0, 'ROCK': 0, 'PAPER': 0, 'SCISSORS': 0}};
    db.push("/players/" + j[player].name, {'games': []})
  }

  if (games.indexOf(j.gameId) == -1) {
      var stats = playerNames[j[player].name].stats
      stats.games += 1;
      stats[j[player].played] += 1;
      if (winner === player) {
        stats.wins += 1;
      }

      db.push("/players/" + j[player].name + "/games[]", j, true)
      //db.push("/players/" + j[player].name + "/games/" + j.gameId, j, true)
      return 0
  }
  else {
    console.log("already seen")
   return 1
  };

}



function determine_winner(a, b) {

  if (a === b) { return 'tie' }
  else if (a === 'SCISSORS' && b === 'ROCK') { return 'playerA' }
  else if (a === 'SCISSORS' && b === 'PAPER') { return 'playerB' }
  else if (a === 'ROCK' && b === 'SCISSORS') {return 'playerA' }
  else if (a === 'ROCK' && b === 'PAPER') { return 'playerB' }
  else if (a === 'PAPER' && b === 'SCISSORS') { return 'playerB' }
  else if (a === 'PAPER' && b === 'ROCK') { return 'playerA' }

}

function add_games(batch) {



  var seen = 0;
  console.log(batch.length)
  var startTimer = performance.now();
  for (var i = 0; i < batch.length; i++) {

      const winner = determine_winner(batch[i].playerA.played, batch[i].playerB.played)
      seen += add_player_stats('playerA', batch[i], winner)
      seen += add_player_stats('playerB',  batch[i], winner)
      games.push(batch[i].gameId);
      db.push("/games[]", batch[i].gameId, true)

  }

  db.save();
  var endTimer = performance.now();
  console.log((endTimer - startTimer)/batch.length)
  return seen;

}


function retrieve_data(cursor){
  if (cursor != null) {

    fetch('https://bad-api-assignment.reaktor.com' + cursor)
      .then((res) => res.json())
      .then((res) => {
        if (add_games(res.data) === 0) {
          setTimeout(() => {
            retrieve_data(res.cursor)
          }, 2000)
        }
      })
      .catch(err => console.log(err))
  }
}

function retrieve_websocket() {
  const ws = new WebSocket('wss://bad-api-assignment.reaktor.com/rps/live');

  ws.onmessage = (event) => {
    const parsed = JSON.parse(JSON.parse(event.data));

    if (parsed.type === 'GAME_RESULT') {
      add_games([parsed])
      
    }
  }

}



app.get("/players", (req, res, next) => {
  res.json({'players': playerNames, 'games': games.length})
});

app.get("/player/games/:player/:page", (req, res, next) => {
  const player = req.params.player;
  const page = req.params.page;
  
  if (player !== memorizedPlayerName){
    memorizedPlayerName = player;
    memorizedPlayer = db.getData("/players/" + player + "/games")
  }

  const start = (page - 1) * 10;
  const games_to_send = memorizedPlayer.slice(start, start + 10);
  res.json(games_to_send)
});





app.listen(5000, () => {
  console.log("Server running");
});

retrieve_data(cursor);
retrieve_websocket();
