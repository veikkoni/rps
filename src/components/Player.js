import React, {useState} from 'react'
import Hand from './Hand'
import Modal from './Modal';
import LiveGame from './LiveGame';

  function Player({player, name}) {

    const [showGames, setShowGames] = useState(false);

    const winRatio = Math.round((player.stats.wins / player.stats.games)*100) + "%"

    function MostPlayedHand() {
        var biggest = "None";
        var value = 0;

        if (player.stats.ROCK > value) {
            biggest = "ROCK"
            value = player.stats.ROCK
        }
        if (player.stats.PAPER > value) {
            biggest = "PAPER"
            value = player.stats.Paper
        }
        if (player.stats.SCISSORS > value) {
            biggest = "SCISSORS"
            value = player.stats.Scissors
        }

       return <Hand no_data={biggest == "None"} hand={biggest} size={30}  />
    }

    console.log("asd")
    return(
      <div className='player-history'>
          <div className='player-stats'>
            <div>{name}</div>
            <div>Games: {player.stats.games}</div>
            <div>Win ratio: {winRatio}</div>
            <div>Most played hand: <MostPlayedHand/></div>
            <button onClick={() => setShowGames(!showGames)}>Show games</button>         
          </div>
        <div className="history-games">
          {showGames && 
          player.games.map(game => {
            return (
                <LiveGame game={game} key={game.gameId} size={2} />
            )
        })}
        </div>
  
      </div>
      
    )

  }

  export default Player;
