
const express = require("express");
const app = express();

const cors = require('cors');
app.use(cors());

const db = require('./db.js');

global.playerNames = {};
global.games = [];


const initialize = require('./data_retriever.js');


app.get("/v1/players", (req, res, next) => {
  console.log("GET /players")
  res.json({'players': playerNames, 'games': games.length})
});



app.get("/v1/player/games/:player/:page", (req, res, next) => {
  console.log("GET /player/games/" + req.params.player + "/" + req.params.page)
  const pageSize = 30;
  const player = req.params.player;
  const page = (req.params.page-1) * pageSize;

  db.query("SELECT data FROM game WHERE playera = $1 OR playerb = $1 ORDER BY id LIMIT $2 OFFSET $3", [player, pageSize, page], (qres) => {
    if (qres.rowCount >= 0 ) {
      res.send(qres.rows.map(r => JSON.parse(r.data)))
    }
    else {
      res.json([])
    }
  })
});



app.listen( process.env.PORT || 5000, () => {
  console.log("Server running");
});



initialize()
