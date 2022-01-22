import Game from './Game'

function Live({liveGames}) {

  if (liveGames.length === 0) {
      return (
        <div className="live">
          <h1 className="header">Live games</h1>
          <div className="loading">Waiting for live results</div>
        </div>
      )
    } else {
      return (
        <div className="live">
          <h1 className="header">Live games</h1>
            {liveGames.map(game => {
                  return (
                      <Game game={game} key={game.gameId} size="large" />
                  )
              })}
        </div>
      );
    }

}

export default Live;

