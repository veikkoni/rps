import React, {useState} from 'react'
import Hand from './Hand'
import Game from './Game';

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

       return <Hand no_data={biggest === "None"} hand={biggest} size={30}  />
    }

    return(
      <div className='player-history'>
          <div className='player-stats'>
            <div className='player-stat'>{name}</div>
            <div className='player-stat'>Games: {player.stats.games}</div>
            <div className='player-stat'>Win ratio: {winRatio}</div>
            <div className='player-stat'>Most played hand: <MostPlayedHand/></div>
          <div className='player-stat'> <button onClick={() => setShowGames(!showGames)}>Show games</button>  
          </div>
                   
          </div>
        <div className="history-games">
          {showGames && 
          player.games.map(game => {
            return (
                <Game game={game} key={game.gameId} size="small" />
            )
        })}
        </div>
  
      </div>
      
    )

  }

  export default Player;
