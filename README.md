## RPS Reaktor assignment
Live demo online at [https://rps.nakkivene.dy.fi/](https://rps.nakkivene.dy.fi)

This is a React application that uses WebSocket API and HTTP JSON API to retrieve live data and historical data for the players. As my answer does not contain a backend, history data is retrieved live from the API and this causes the player stats to be calculated from partial data. As the data is retrieved directly from a browser, I had to use cors proxy to get the data. There is a sample compose service in docker-compose file commented out. The proxy server is running at https://cors-proxy.nakkivene.dy.fi/. If you want to use another proxy, you can change it in DataRetrieves on line 9.

RPS images from Pixbay 
[1](https://pixabay.com/users/clker-free-vector-images-3736/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=296853)
[2](https://pixabay.com/users/kropekk_pl-114936/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=350169)

## Deployment
You can either use node to run the development system by running 
```
yarn start
```
If you have Docker-compose installed you can use 
```
docker-compose build
docker-compose run
```
