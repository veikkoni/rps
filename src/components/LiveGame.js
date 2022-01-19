import React from 'react'

function  LiveGame({game}) {

    function Hand ({game, hand}) {
        if (game.type === "GAME_BEGIN" ) {
            return <img src="/images/question_mark.png" alt="No result" height="100px" width="100px"/>;
        }
        if (hand === "PAPER" ) {
            return <img src="/images/paper.png" alt="Paper" height="100px" width="100px"/>;
        }
        if (hand === "ROCK" ) {
            return <img src="/images/rock.png" alt="Rock" height="100px" width="100px"/>;
        }
        if (hand === "SCISSORS" ) {
            return <img src="/images/scissors.png" alt="Scissors" height="100px" width="100px"/>;
        }
    }

    return (
        <div className="game">
            <Hand game={game} hand={game.playerA.played} />
            <div className="game-info">
                <div className="game-id">{game.gameId}</div>
                <div className="game-status">{game.type === "GAME_BEGIN" ? "Game started" : "Game finished"}</div>
                <div className="players">
                    <div className="player">{game.playerA.name}</div>
                    <div className="versus">VS</div>
                    <div className="player">{game.playerB.name}</div>
                </div>
            </div>
            <Hand game={game} hand={game.playerB.played} />
        </div>
    )
}

export default LiveGame;

