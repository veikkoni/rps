## RPS Reaktor assignment
Live demo online at [https://rps.nakkivene.dy.fi/](https://rps.nakkivene.dy.fi), backend in [https://api.nakkivene.dy.fi/players/](https://api.nakkivene.dy.fi/players/)

This is a React application that uses WebSocket API and HTTP JSON API to retrieve live data and historical data for the players. ~~As my answer does not contain a backend, history data is retrieved live from the API and this causes the player stats to be calculated from partial data. As the data is retrieved directly from a browser, I had to use cors proxy to get the data. There is a sample compose service in docker-compose file commented out. The proxy server is running at https://cors-proxy.nakkivene.dy.fi/. If you want to use another proxy, you can change it in DataRetrieves on line 9~~

RPS images from Pixbay 
[1](https://pixabay.com/users/clker-free-vector-images-3736/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=296853)
[2](https://pixabay.com/users/kropekk_pl-114936/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=350169)

## Deployment
You can either use node to run the development system by running: (You need psql database)
```
cd client && yarn start
# in other terminal
cd backend && npm run dev-start
```

If you have Docker-compose installed you can use 
```
docker-compose build
docker-compose up -d
```

## Backend
Backend is implemented in node.js with postgres database. Backend has two routes, /players with all players and stats and /player/games/:player/:page for game history. Each page has 30 games.

Data is retrieved in very same manner as it was fetched in frontend before. After getting all data, new data is fetched every 5 minutes. And live games are also processed when finished.

First iteration was done with json storage but it turned out to be way too slow. End result is mix with sql data storage and gameids + player stats in memory.

## Possible improvements
- Testing
- Frontend
    - Better ui
- Backend
    - Better scheduling for retrieving data (cron)
    - Game history api with filters
    - Code improvements, extract configurable params, better division to files
    - Takes a bit to answer if it is retrieving data at same time
    - Could be divided to two (or three) different microservices, api, api data retriever ,/+ websocket retriever 
    - Communication to frontend could be faster, maybe websockets?
    - Pagination could be better, sql limit + offset does not work well with changing data
    - Not using global variables for data storage
