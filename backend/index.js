const express = require("express");
const app = express();

const fetch = require("node-fetch")
// {'games': [], 'stats': {}}
var data = {'games': [], 'players': {}};
const cursor = "/rps/history"

function determine_winner(a, b) {
  if (a === b) { return 'tie' } 
  else if ( a === 'SCISSORS' && b === 'ROCK') {return 'playerA'}
  else if ( a === 'SCISSORS' && b === 'PAPER') {return 'playerB'}
  else if ( a === 'ROCK' && b === 'SCISSORS') {return 'playerA'}
  else if ( a === 'ROCK' && b === 'PAPER') {return 'playerB'}
  else if ( a === 'PAPER' && b === 'SCISSORS') {return 'playerB'}
  else if ( a === 'PAPER' && b === 'ROCK') {return 'playerA'}  
}

function addGames(data, games) {
  var seen = 0
  for (var i = 0 ; i < games.length ; i++) {
    if (data.games.indexOf(games[i].gameId) != -1) {
      seen++;
    } else {
      data.games.push(games[i].gameId)
      if (!data.players.hasOwnProperty(games[i].playerA.name)) {
        data.players[games[i].playerA.name] = {'games': [games[i]], 'stats': {'wins': 0, 'games': 0, 'ROCK': 0, 'PAPER': 0, 'SCISSORS': 0}}
      }
      if (!data.players.hasOwnProperty(games[i].playerB.name)) {
        data.players[games[i].playerB.name] = {'games': [], 'stats': {'wins': 0, 'games': 0, 'ROCK': 0, 'PAPER': 0, 'SCISSORS': 0}}
      }
      const winner = determine_winner(games[i].playerA.played, games[i].playerB.played)
      data.players[games[i].playerA.name].games.push(games[i])
      data.players[games[i].playerB.name].games.push(games[i])
      data.players[games[i].playerA.name].stats[games[i].playerA.played] += 1;
      data.players[games[i].playerB.name].stats[games[i].playerB.played] += 1;
      data.players[games[i].playerA.name].stats.games += 1;
      data.players[games[i].playerB.name].stats.games += 1;

      if (winner != 'tie') {
          data.players[games[i][winner].name].stats.wins += 1;
      }

      

    }

  
  }
  console.log("Run done")
  console.log("seen", seen)
  console.log("games", data.games.length  )

  var count = 0;
  for(var key in data.players) {
        if(data.players.hasOwnProperty(key)) {
    count++;
    }
  }
  console.log(count)

  return seen
}

function retrieve_data(data, cursor){
  console.log(cursor)
  fetch('https://bad-api-assignment.reaktor.com' + cursor)
    .then((res) => res.json())
    .then((res) => {
      if (addGames(data, res.data) === 0) {
        setTimeout(() => {

          retrieve_data(data, res.cursor)
        }, 1)
      }
    })
    .catch(err => console.log(err))

}




app.get("/join", (req, res, next) => {
  res.send(data.players)
});




app.listen(5000, () => {
  console.log("Server running");
});

retrieve_data(data, cursor);
