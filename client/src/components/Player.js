import React, {useState, useEffect} from 'react'
import Hand from './Hand'
import Game from './Game';

  function Player({player, name}) {

    const apiAddress = "http://localhost:5000/v1/player/games/";

    const [showGames, setShowGames] = useState(false);
    const [page, setPage] = useState(0);
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
      setPage(1)
      setShowGames(!showGames);
    }


    useEffect(() => {
      if (showGames){ 
        fetch(apiAddress + name + '/' + page)
        .then(res => res.json())
        .then(res => setGames(res))
      }
    }, [page])


    function Page({page}) {
      return(
        <div className="page-selector">
          <button onClick={() => setPage(Math.max(1, page - 1))}>Prev</button>
          <p>Current page: {page}</p>
          <p>{(page-1)*30}-{(page)*30} / {player.stats.games}</p>
          <button onClick={() => page*30 > player.stats.games ? setPage(page) : setPage(page + 1)}>Next</button>
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
          <div className='player-stat'> 
            <button onClick={getGames}>Show games</button>  
          </div>
                   
          </div>
        {showGames && <Page page={page}/>}
        <div className="history-games">
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
