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

const d2b = require('./db.js');

//function deleteDataFile(){
//  try {
//    fs.unlinkSync('./rps-data.json');
//  } catch(err) {
//    console.log("File already deleted");
//  }
//  db.push("/games", [])
//  db.push("/players", {})
//  
//}
//
//
//var db = new JsonDB(new Config("rps-data", false, true, '/'));
//
//try {
//  db.getData("/games")
//  games = db.getData("/games");
//} catch (err) {
//  deleteDataFile();
//}
//
//try {
//  db.getData("/players")
//  playerNames = db.getData("/players");
//} catch (err) {
//  deleteDataFile();
//}

app.use(cors());


function update_player_database() {
  db.push("/games", games, true)
  db.push("/players", playerNames, true)  
  db.save();


}

function add_player_stats(player, j, winner) {



  /*d2b.query('SELECT * FROM player WHERE name = $1', [j[player].name], (res) => {
   
      if (res.rowCount === 0) {
      d2b.query("INSERT INTO player (name) VALUES ($1)", [j[player].name], (res2) => {

          console.log("Added player")
        
    });
  }

  })*/

  if (!playerNames.hasOwnProperty(j[player].name)) {
    playerNames[j[player].name] = {'stats': {'wins': 0, 'games': 0, 'ROCK': 0, 'PAPER': 0, 'SCISSORS': 0}};
    d2b.query("INSERT INTO player (name) VALUES ($1) ON CONFLICT DO NOTHING", [j[player].name], () => {})
   // db.push("/players/" + j[player].name, {'games': []})
  }

// d2b.query("SELECT id, playerA, playerB from games WHERE id = $1 LIMIT 1", [j.gameId], (err, res) => {
//       if (res.rowCount === 0) {
//         d2b.query('INSERT INTO games (id, data, playerA, playerB) VALUES ($1, $2, $3, $4) RETURNING id, playerA,', [j.gameId, JSON.stringify(j), j], (err, res) => {
//         ))
//  if (games.indexOf(j.gameId) == -1) {
      var stats = playerNames[j[player].name].stats
      stats.games += 1;
      stats[j[player].played] += 1;
      if (winner === player) {
        stats.wins += 1;
      }

   //   d2b.query('INSERT INTO games (id, data, playerA, playerB) VALUES ($1, $2, $3, $4)', [j.gameId, JSON.stringify(j), j], (err, res) => {
  //
   //       console.log("Added game")
   //     
   //   });
   //   db.push("/players/" + j[player].name + "/games[]", j, true)
      //db.push("/players/" + j[player].name + "/games/" + j.gameId, j, true)
      return 0
  //}
  //else {
  //  console.log("already seen")
 //  return 1
//  };

}



function addGame(j) {

  d2b.query('INSERT INTO game (id, data, playera, playerb) VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING', [j.gameId, JSON.stringify(j), j.playerA.name, j.playerB.name], (res) => {
    
  });
  games.push(j.gameId)
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
  var startTimer = performance.now();

  for (var i = 0; i < batch.length; i++) {
    
    if (games.indexOf(batch[i].gameId) === -1) {
      addGame(batch[i])
      const winner = determine_winner(batch[i].playerA.played, batch[i].playerB.played)
      add_player_stats('playerA', batch[i], winner)
      add_player_stats('playerB',  batch[i], winner)
      
  
      
    } else {
      
      seen++;
    }

    // db.push("/games[]", batch[i].gameId, true)

  }
  var endTimer = performance.now();
  console.log(new Date(), batch.length, (endTimer - startTimer)/batch.length)
  return seen;

  
}


function retrieve_data(cursor){
  if (cursor != null) {

    fetch('https://bad-api-assignment.reaktor.com' + cursor)
      .then((res) => res.json())
      .then((res) => {
        add_games(res.data) 
          setTimeout(() => {
            retrieve_data(res.cursor)
          }, 2000)
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



  const start = (page - 1) * 10;


  //const games_to_send = memorizedPlayer.slice(start, start + 10);

  d2b.query("SELECT data FROM game WHERE playera = $1 OR playerb = $1 LIMIT $2 OFFSET $3", [player, 10, page], (qres) => {
    if (qres.rowCount >= 0 ) {
      res.json(qres.rows)
    }
    else {
      res.json([])
    }
  })


});





app.listen(5000, () => {
  console.log("Server running");
});

retrieve_data(cursor);
retrieve_websocket();
