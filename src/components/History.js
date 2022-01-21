import React, {useEffect, useState} from 'react'
import Player from './Player';

function History() {

  const [games, setGames] = useState([])
  const [cursor, setCursor] = useState("/rps/history")
  const [players, setPlayers] = useState({})
  
  function determine_winner(a, b) {
    if (a === b) { return 'tie' } 
    else if ( a === 'SCISSORS' && b === 'ROCK') {return 'playerA'}
    else if ( a === 'SCISSORS' && b === 'PAPER') {return 'playerB'}
    else if ( a === 'ROCK' && b === 'SCISSORS') {return 'playerA'}
    else if ( a === 'ROCK' && b === 'PAPER') {return 'playerB'}
    else if ( a === 'PAPER' && b === 'SCISSORS') {return 'playerB'}
    else if ( a === 'PAPER' && b === 'ROCK') {return 'playerA'}  
  }

  function addGames(batch) {
    var newGames = games;
    var newPlayers = players;

    var seen = 0
    for (var i = 0 ; i < batch.length ; i++) {
  
      if (newGames.indexOf(batch[i].gameId) != -1) {
        seen++;
      } else {
        newGames.push(batch[i].gameId)
        if (!newPlayers.hasOwnProperty(batch[i].playerA.name)) {
          newPlayers[batch[i].playerA.name] = {'games': [batch[i]], 'stats': {'wins': 0, 'games': 0, 'ROCK': 0, 'PAPER': 0, 'SCISSORS': 0}}
        }
        if (!newPlayers.hasOwnProperty(batch[i].playerB.name)) {
          newPlayers[batch[i].playerB.name] = {'games': [], 'stats': {'wins': 0, 'games': 0, 'ROCK': 0, 'PAPER': 0, 'SCISSORS': 0}}
        }
        const winner = determine_winner(batch[i].playerA.played, batch[i].playerB.played)
        newPlayers[batch[i].playerA.name].games.push(batch[i])
        newPlayers[batch[i].playerB.name].games.push(batch[i])
        newPlayers[batch[i].playerA.name].stats[batch[i].playerA.played] += 1;
        newPlayers[batch[i].playerB.name].stats[batch[i].playerB.played] += 1;
        newPlayers[batch[i].playerA.name].stats.games += 1;
        newPlayers[batch[i].playerB.name].stats.games += 1;
  
        if (winner != 'tie') {
            newPlayers[batch[i][winner].name].stats.wins += 1;
        }
      }
    }

    setGames(newGames)
    console.log(newPlayers)
    setPlayers(newPlayers)

    console.log("seen", seen)
    return seen
  }


  useEffect(() => {
    if (cursor != null) {
      console.log(cursor)
      fetch('https://cors-proxy.nakkivene.dy.fi/https://bad-api-assignment.reaktor.com' + cursor)
        .then((res) => res.json())
        .then((res) => {
          console.log(res)
          
          //setGames(games => [...games, ...res.data]);
          if (addGames(res.data) == 0) {
            setTimeout(() => {
  
              setCursor(res.cursor);
            }, 5000)
            
          }
        })
        .catch(err => alert(err))
  
    }
   
  },[cursor]);

  if (games.length === 0 && players === 0) {
    <div className="history">
      Loading data...
    </div>
  } else {
    return (
      <div className="history">
          Total games loaded: {games.length}
          Total players loaded: {Object.keys(players).length}
          <br></br>
          {Object.keys(players).sort().map((key, i) => <Player player={players[key]} name={key} key={key} />)}
          
      </div>
    );
  }


  }
  
  export default History;
  