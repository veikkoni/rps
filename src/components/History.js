import React, {useEffect, useState} from 'react'

function History() {

  const [games, setGames] = useState([])
  const [cursor, setCursor] = useState("/rps/history")


  useEffect(() => {
    //console.log("USEEFGEXTG")
    console.log(cursor)
    fetch('https://cors-proxy.nakkivene.dy.fi/https://bad-api-assignment.reaktor.com' + cursor)
      .then((res) => res.json())
      .then((res) => {
        console.log(res)
        
        setGames(games => [...games, ...res.data]);
        setTimeout(() => {
          setCursor(res.cursor);
        }, 500)
      })
      .catch(err => alert(err))

  },[cursor]);


    return (
      <div className="history">
          {games.length}
      </div>
    );
  }
  
  export default History;
  