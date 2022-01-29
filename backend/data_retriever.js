var WebSocket = require('ws');
const fetch = require("node-fetch")

const db = require('./db.js');

const ORIGCURSOR = "/rps/history"

function initialize() {
    // Retrieve gameids and playerdata to memory
    // And start data fetching
  
    db.query("SELECT id FROM game", [], (res) => {
      db.query('SELECT name, wins, games, "ROCK", "PAPER", "SCISSORS" FROM player', [], (res2) => {
        games = res.rows.map(r => r.id)
  
        for (var i = 0; i < res2.rows.length; i++) {
          playerStats[res2.rows[i].name] = {
            "stats": {
              "wins": res2.rows[i].wins,
              "games": res2.rows[i].games,
              "ROCK": res2.rows[i].ROCK,
              "PAPER": res2.rows[i].PAPER,
              "SCISSORS": res2.rows[i].SCISSORS
            }
          }
        }
        retrieve_data(ORIGCURSOR, true);
        retrieve_websocket();
        every_minute();
      })
    })
  }
  
  
  
  function every_minute() {
    update_player_database();
    setTimeout(every_minute, 60 * 1000);
  }
  
  
  
  function update_player_database() {
    // Saves userstats to database for persistent storage
    // Called every minute
    for (var key in playerStats) {
      db.query('UPDATE player SET wins = $1, games = $2, "ROCK" = $3, "PAPER" = $4, "SCISSORS" = $5 WHERE name = $6',
        [playerStats[key].stats.wins, playerStats[key].stats.games, playerStats[key].stats.ROCK, playerStats[key].stats.PAPER, playerStats[key].stats.SCISSORS, key], (res) => {}
      )
    }
  }
  
  
  
  function add_player_stats(player, j, winner) {
    // Add player if not seen before AND add stats to players
  
    if (!playerStats.hasOwnProperty(j[player].name)) {
      playerStats[j[player].name] = {'stats': {'wins': 0, 'games': 0, 'ROCK': 0, 'PAPER': 0, 'SCISSORS': 0}};
      db.query("INSERT INTO player (name) VALUES ($1) ON CONFLICT DO NOTHING", [j[player].name], () => {})
    }
  
    var stats = playerStats[j[player].name].stats
    stats.games += 1;
    stats[j[player].played] += 1;
    if (winner === player) {
      stats.wins += 1;
    }
  
  }
  
  
  
  function addGame(j) {
    db.query('INSERT INTO game (id, data, playera, playerb) VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING',
     [j.gameId, JSON.stringify(j), j.playerA.name, j.playerB.name], (res) => {}
    );
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
    // Add game to database and add stats for players
    // Called from retrieve_data and retrieve_websocket
    // returns how many games were added (new ones)
    
    var seen = 0;
  
    for (var i = 0; i < batch.length; i++) {
      if (games.indexOf(batch[i].gameId) === -1) {
        addGame(batch[i])
        const winner = determine_winner(batch[i].playerA.played, batch[i].playerB.played)
        add_player_stats('playerA', batch[i], winner)
        add_player_stats('playerB',  batch[i], winner)
      } else {
        seen++;
      }
    }
  
    console.log(new Date().toISOString() + " Added " + (batch.length - seen) + " games, " + seen + " already seen");
    
    return batch.length - seen;
  }
  
  
  
  function retrieve_data(cursor, force){
    // force tells that we continue following cursor even if we have seen games already (force update)
    // Main method for retireving api data
    // Loops automatically (2 secs if follwing cursor, 5 mins if not)
    if (cursor != null) {
  
      fetch('https://bad-api-assignment.reaktor.com' + cursor)
        .then((res) => res.json())
        .then((res) => {
          if (add_games(res.data) > 0 || force) {
            setTimeout(() => {
              retrieve_data(res.cursor, force)
            }, 2000)
          } else {
            setTimeout(() => {
              retrieve_data(ORIGCURSOR, false)
            }, 5 * 60 * 1000)
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

module.exports = initialize
