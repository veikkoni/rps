import React from 'react'
import { useEffect, useState } from 'react'

function Live() {
  const [games, setGames] = useState([])

  useEffect(() => {
    const ws = new WebSocket("wss://bad-api-assignment.reaktor.com/rps/live");

    const endGame = function(game) {
      const index = games.findIndex(g => g.gameId === game.gameId);;
      if (index === -1) {
        return (games => [...games, game]);
      } else {
        const gameCopy = games;
        gameCopy[index] = game;
        return gameCopy;
      }
    }

    ws.onmessage = function(event) {
      const parsed = JSON.parse(JSON.parse(event.data));

      if (parsed.type === 'GAME_BEGIN') {
        setGames(games => [...games, parsed]);
      } else {
        setGames(endGame(parsed));
      }
    }

    return () => {
      ws.close();
    }
  });

 return (
  <div className="live">
      {games.map(game => {
            return (
                <>
                    {game.gameId}
                    {game.type}
                    {game.playerA.name}
                    {game.playerB.name}
                </>
            )
        })}
  </div>
);
}

export default Live;

