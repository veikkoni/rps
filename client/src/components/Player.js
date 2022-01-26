import React, {useState, useEffect} from 'react'
import Hand from './Hand'
import Game from './Game';

  function Player({player, name}) {

    const [showGames, setShowGames] = useState(false);
    const [page, setPage] = useState(1);
    const [games, setGames] = useState([]);

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

    function getGames() {
      if (!showGames){ 
        fetch('http://localhost:5000/player/games/' + name + '/' + page)
        .then(res => res.json())
        .then(res => setGames(res))
      }

      setShowGames(!showGames);
    }


    useEffect(() => {
      fetch('http://localhost:5000/player/games/' + name + '/' + page)
      .then(res => res.json())
      .then(res => setGames(res))
    }, [page])


    function Page({page}) {
      return(
        <div className="page">
          <button onClick={() => setPage(Math.max(1, page - 1))}>Prev</button>
          <p>Current page: {page}</p>
          <p>{(page-1)*games.length}-{(page)*games.length} / {player.stats.games}</p>
          <button onClick={() => setPage(page + 1)}>Next</button>
        </div>
      )
    }

    return(
      <div className='player-history'>
          <div className='player-stats'>
            <div className='player-stat'>{name}</div>
            <div className='player-stat'>Games: {player.stats.games}</div>
            <div className='player-stat'>Win ratio: {winRatio}</div>
            <div className='player-stat'>Most played hand: <MostPlayedHand/></div>
          <div className='player-stat'> <button onClick={getGames}>Show games</button>  
          </div>
                   
          </div>
        <div className="history-games">

        {showGames && <Page page={page}/>}
        {showGames && games.map(game => {
            return (
                <Game game={game} key={game.gameId} size="small" />
            )
        })}
        </div>
  
      </div>
      
    )

  }

  export default Player;
