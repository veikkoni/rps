
function Hand ({no_data, hand, size}) {
    if (no_data) {
        return <img src="/images/question_mark.png" alt="No result" height={size+"px"} width={size+"px"}/>;
    }
    if (hand === "PAPER" ) {
        return <img src="/images/paper.png" alt="Paper" height={size+"px"} width={size+"px"}/>;
    }
    if (hand === "ROCK" ) {
        return <img src="/images/rock.png" alt="Rock" height={size+"px"} width={size+"px"}/>;
    }
    if (hand === "SCISSORS" ) {
        return <img src="/images/scissors.png" alt="Scissors" height={size+"px"} width={size+"px"}/>;
    }
}

export default Hand;
