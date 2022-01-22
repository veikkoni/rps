import React from 'react';
import Hand from './Hand';

function  Game({game, size}) {
   // size small or large
   const px = size === 'small' ? '50px' : '100px';

    return (
        <div className={"game game-" + size} >
            <Hand no_data={game.type === "GAME_BEGIN"} hand={game.playerA.played} size={px} />
            <div className="game-info">
                <div className="game-id">{game.gameId}</div>
                { size === 'large' &&
                 <div className="game-status">{game.type === "GAME_BEGIN" ? "Game started" : "Game finished"}</div>
                 }
                <div className="players">
                    <div className="player">{game.playerA.name}</div>
                    <div className="versus">VS</div>
                    <div className="player">{game.playerB.name}</div>
                </div>
            </div>
            <Hand no_data={game.type === "GAME_BEGIN"} hand={game.playerB.played} size={px} />
        </div>
    )
}

export default Game;

