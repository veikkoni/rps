function add_player_stats(player, newPlayers, j, winner) {

    if (!newPlayers.hasOwnProperty(j[player].name)) {
        newPlayers[j[player].name] = { 'games': [], 'stats': { 'wins': 0, 'games': 0, 'ROCK': 0, 'PAPER': 0, 'SCISSORS': 0 } }
    }

    //if (newPlayers[j[player].name].games.indexOf(j) === -1) {
        //newPlayers[j[player].name].games.push(j)
        newPlayers[j[player].name].stats[j[player].played] += 1;
        newPlayers[j[player].name].stats.games += 1;
        if (winner === player) {
            newPlayers[j[player].name].stats.wins += 1;
        }
  //  }

}

function determine_winner(a, b) {

    if (a === b) { return 'tie' }
    else if (a === 'SCISSORS' && b === 'ROCK') { return 'playerA' }
    else if (a === 'SCISSORS' && b === 'PAPER') { return 'playerB' }
    else if (a === 'ROCK' && b === 'SCISSORS') {return 'playerA' }
    else if (a === 'ROCK' && b === 'PAPER') { return 'playerB' }
    else if (a === 'PAPER' && b === 'SCISSORS') { return 'playerB' }
    else if (a === 'PAPER' && b === 'ROCK') { return 'playerA' }

}

function reducer(state, action) {
    let newState;
    switch (action.type) {

        case 'addLiveGame':
            newState = { ...state, 'liveGames': [action.payload, ...state.liveGames].splice(0, 25) }
            break;


        case 'endLiveGame':
            var newLiveGames = state.liveGames
            const index = newLiveGames.findIndex(g => g.gameId === action.payload.gameId)

            if (index === -1) {
                newLiveGames = [action.payload, ...state.liveGames].splice(0, 25)
            } else {
                newLiveGames[index] = action.payload
            }

            newState = { ...state, 'liveGames': newLiveGames }
            break;


        case 'addGames':
            var newGames = state.games + action.payload.length;
            var newPlayers = state.players;

            for (var i = 0; i < action.payload.length; i++) {
                const winner = determine_winner(action.payload[i].playerA.played, action.payload[i].playerB.played)
                add_player_stats('playerA', newPlayers, action.payload[i], winner)
                add_player_stats('playerB', newPlayers, action.payload[i], winner)
            }

            newState = { ...state, 'games': newGames, 'players': newPlayers }
            break;

        case 'addPlayers':
            var newPlayers = { ...action.payload.players }
            newState = { ...state, 'players': newPlayers, 'games': action.payload.games }
            break;

        default:
            throw new Error();
    }
    return newState;
}


export default reducer;