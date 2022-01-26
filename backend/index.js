const express = require("express");
const app = express();


const JsonDB = require('node-json-db').JsonDB;
const Config = require('node-json-db/dist/lib/JsonDBConfig').Config;
const fs = require('fs');

const fetch = require("node-fetch")
var playerNames = {};
var games = [];
const cursor = "/rps/history"

try {
  fs.unlinkSync('./rps-data.json');
} catch(err) {
  console.log("File already deleted");
}

var db = new JsonDB(new Config("rps-data", false, true, '/'));


db.push("/games", 0)
db.push("/players", {})



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

  db.push("/games", batch.length + db.getData("/games"), true);

  var seen = 0;
  console.log(batch.length)
  var startTimer = performance.now();
  for (var i = 0; i < batch.length; i++) {

      const winner = determine_winner(batch[i].playerA.played, batch[i].playerB.played)
      seen += add_player_stats('playerA', batch[i], winner)
      seen += add_player_stats('playerB',  batch[i], winner)
      games.push(batch[i].gameId);

  }
  
  db.save();
  var endTimer = performance.now();
  console.log((endTimer - startTimer)/batch.length)
  return seen;

}





function retrieve_data(data, cursor){
  console.log(cursor)
  fetch('https://bad-api-assignment.reaktor.com' + cursor)
    .then((res) => res.json())
    .then((res) => {
      if (add_games(res.data) === 0) {
        setTimeout(() => {
          retrieve_data(data, res.cursor)
        }, 100)
      }
    })
    .catch(err => console.log(err))

}




//app.get("/join", (req, res, next) => {
//  res.send(games.length)
//});




//app.listen(5000, () => {
//  console.log("Server running");
//});

retrieve_data(data, cursor);
