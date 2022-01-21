import React from 'react'
import { useEffect, useState } from 'react'
import LiveGame from './LiveGame'

function Live() {
  const [games, setGames] = useState([{"type":"GAME_RESULT","gameId":"2bb0be4a43bb69d95ffc9","t":1642758242710,"playerA":{"name":"Ahti Mäkelä","played":"PAPER"},"playerB":{"name":"Mielikki Korhonen","played":"PAPER"}},{"type":"GAME_RESULT","gameId":"b8b504e46f497bfe993452","t":1642758303311,"playerA":{"name":"Ahti Mäkelä","played":"ROCK"},"playerB":{"name":"Otso Hämäläinen","played":"PAPER"}},{"type":"GAME_RESULT","gameId":"4dda2796d78d87d4791ed318","t":1642758308879,"playerA":{"name":"Vellamo Mäkelä","played":"ROCK"},"playerB":{"name":"Vellamo Jokinen","played":"ROCK"}},{"type":"GAME_RESULT","gameId":"8003f41b4447333fb690e94","t":1642758320706,"playerA":{"name":"Vellamo Korhonen","played":"ROCK"},"playerB":{"name":"Kyllikki Jokinen","played":"SCISSORS"}},{"type":"GAME_RESULT","gameId":"032e5304c55b6d62b3236","t":1642758279829,"playerA":{"name":"Mielikki Mäkelä","played":"ROCK"},"playerB":{"name":"Kokko Korhonen","played":"ROCK"}},{"type":"GAME_RESULT","gameId":"c65fc82d6c0e1b09dc8","t":1642758272476,"playerA":{"name":"Ahti Laine","played":"ROCK"},"playerB":{"name":"Mielikki Nieminen","played":"PAPER"}},{"type":"GAME_RESULT","gameId":"240658ec858ef96c90eb","t":1642758330080,"playerA":{"name":"Kyllikki Nieminen","played":"ROCK"},"playerB":{"name":"Marjatta Mäkinen","played":"PAPER"}},{"type":"GAME_BEGIN","gameId":"ddd6114b9831eb4a919a236b","playerA":{"name":"Mielikki Mäkinen"},"playerB":{"name":"Ahti Hämäläinen"}},{"type":"GAME_RESULT","gameId":"b6350ea4ef967ad08b","t":1642758352629,"playerA":{"name":"Kullervo Mäkinen","played":"PAPER"},"playerB":{"name":"Kokko Jokinen","played":"SCISSORS"}},{"type":"GAME_BEGIN","gameId":"3a45142a7c19194a070c6224","playerA":{"name":"Seppo Laine"},"playerB":{"name":"Kokko Jokinen"}}])

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

    //return () => {
      ws.close();
    //}
  });

 return (
  <div className="live">
      {games.map(game => {
            return (
                <LiveGame game={game} key={game.gameId} size={4} />
            )
        })}
  </div>
);
}

export default Live;

