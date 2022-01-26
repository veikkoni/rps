import Player from './Player';

function History({games, players, updatePlayers}) {

  if (games === 0) {
    return (
      <div className="history">
        <h1 className="header">History</h1>
        <div className="loading">Fetching history results...</div>
      </div>
    )
  } else {
    return (
      <div className="history">
        <h1 className="header">History</h1>
        <div className="history-stats">
          <p className="stats-games">Total games retrieved: {games}</p>
          <p className="stats-players">Total players retrieved: {Object.keys(players).length}</p>
          <button onClick={updatePlayers}>Manual refresh</button>
          </div>
          {Object.keys(players).sort().map((key, i) => <Player player={players[key]} name={key} key={key} />)}
      </div>
    );
  }
}
  
  export default History;
  