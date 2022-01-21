import React from 'react';
import Hand from './Hand';

function  LiveGame({game, size}) {
    // size 1 to 4


    return (
        <div className={"game-" + size} >
            <Hand no_data={game.type === "GAME_BEGIN"} hand={game.playerA.played} size={size*25} />
            <div className="game-info">
                <div className="game-id">{game.gameId}</div>
                <div className="game-status">{game.type === "GAME_BEGIN" ? "Game started" : "Game finished"}</div>
                <div className="players">
                    <div className="player">{game.playerA.name}</div>
                    <div className="versus">VS</div>
                    <div className="player">{game.playerB.name}</div>
                </div>
            </div>
            <Hand no_data={game.type === "GAME_BEGIN"} hand={game.playerB.played} size={size*25} />
        </div>
    )
}

export default LiveGame;

