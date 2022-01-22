import React, { useEffect, useState, useReducer } from 'react';
import Live from './Live';
import History from './History';
import reducer from './reducer';

function DataRetriever() {

  const websocketAddress = "wss://bad-api-assignment.reaktor.com/rps/live";
  const proxyAddress = "https://cors-proxy.nakkivene.dy.fi/";
  const httpApiAddress = "https://bad-api-assignment.reaktor.com";

  const [state, dispatch] = useReducer(reducer, { 'players': {}, 'liveGames': [], 'games': 0 });
  const [cursor, setCursor] = useState("/rps/history")


  useEffect(() => {
    const ws = new WebSocket(websocketAddress);

    ws.onmessage = function (event) {
      const parsed = JSON.parse(JSON.parse(event.data));

      if (parsed.type === 'GAME_BEGIN') {
        dispatch({ type: 'addLiveGame', payload: parsed })
      } else {
        dispatch({ type: 'endLiveGame', payload: parsed })
        dispatch({ type: 'addGames', payload: [parsed] })
      }
    }

    return () => {
      ws.close();
    }

  }, []);



  useEffect(() => {
    if (cursor != null) {
      fetch( proxyAddress + httpApiAddress + cursor)
        .then((res) => res.json())
        .then((res) => {
          dispatch({ type: 'addGames', payload: res.data })
          setTimeout(() => {
            setCursor(res.cursor);
          }, 1000)
        })
        .catch(err => alert(err))
    }
  }, [cursor]);

  
  return (
    <div className="app">
      <div className="main-content">
        <Live liveGames={state.liveGames} />
        <History games={state.games} players={state.players}/>        
      </div>
    </div>
  );
}


export default DataRetriever;
