import React, { useEffect, useState, useReducer } from 'react';
import Live from './Live';
import History from './History';
import reducer from './reducer';

function DataRetriever() {

  const websocketAddress = "wss://bad-api-assignment.reaktor.com/rps/live";
  const apiAddress = "http://localhost:5000/v1/players/";


  const [state, dispatch] = useReducer(reducer, { 'players': {}, 'liveGames': [], 'games': 0 });


  function retrieve_player_data () {
    fetch(apiAddress)
      .then((res) => res.json())
      .then((res) => {
        if (state.games !== res.games) {
          dispatch({ type: 'addPlayers', payload: res })
        }
      }
    )
  }
  

  useEffect(() => {
    retrieve_player_data();

    const ws = new WebSocket(websocketAddress);

    ws.onmessage = function (event) {
      const parsed = JSON.parse(JSON.parse(event.data));

      if (parsed.type === 'GAME_BEGIN') {
        dispatch({ type: 'addLiveGame', payload: parsed })
      } else {
        dispatch({ type: 'endLiveGame', payload: parsed })
        retrieve_player_data()
      }
    }

    return () => {
      ws.close();
    }

  }, []);

  
  return (
    <div className="app">
      <div className="main-content">
        <Live liveGames={state.liveGames} />
        <History games={state.games} players={state.players} updatePlayers={retrieve_player_data}/>        
      </div>
    </div>
  );
}


export default DataRetriever;
