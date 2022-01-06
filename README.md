# Joy Auction

## Purpose
As a language teacher, I've proposed an auction game to my students: I give them some fake money, print some grammatically correct and incorrect sentences and sell them as if we were at an auction. When I decided to find an app in which I could do something similar, I haven't found it. So I've decided to make one.

## Tutorial
The project is currently deployed at [https://joy-auction.herokuapp.com/](https://joy-auction.herokuapp.com/). You must first register your account using a valid e-mail. After that, you have to register your auctions and lots (you must check whether the lot's description is correct or not).

![Registering an auction](https://github.com/hebaja/auction/blob/master/src/assets/auction_images/register_auction.png)

Then, You have to register groups of players, a link will be created for each player after the group is created, which should be given to each player.

![Registering a group of players](https://github.com/hebaja/auction/blob/master/src/assets/auction_images/register_group.png)

![Links for players](https://github.com/hebaja/auction/blob/master/src/assets/auction_images/links.png)

Finally, you must activate all the groups of players which will be able to play. 

![Activating a group](https://github.com/hebaja/auction/blob/master/src/assets/auction_images/group.png)

Choose a lot and determine its initial bid and the players are now allowed to give their bids. You should decide when it is enough and close the lot.

![Initial bid](https://github.com/hebaja/auction/blob/master/src/assets/auction_images/initial_bid.png)

![player's control](https://github.com/hebaja/auction/blob/master/src/assets/auction_images/player.png)

The player who gave the highest bid will acquire the lot. When all lots are sold, you can finish the auction and check the score, the winner is the player who bought more correct lots.

## Link for API
[https://github.com/hebaja/auction-api](https://github.com/hebaja/auction-api)

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

## How to Try it
The project is currently deployed at [https://joy-auction.herokuapp.com/](https://joy-auction.herokuapp.com/). You must first register your account using a valid e-mail. After that, you have to register your auctions and lots (you must check whether the lot's description is correct or not). Then, You have to register groups of players, a link will be created for each player after the group is created, which should be given to each player. Finally, you must activate all the groups of players which will be able to play. Choose a lot and determine its initial bid and the players are now allowed to give their bids. You should decide when it is enough and close the lot. The player who gave the highest bid will acquire the lot. When all lots are sold, you can finish the auction and check the score, the winner is the player who bought more correct lots.

## Link for API
[https://github.com/hebaja/auction_api](https://github.com/hebaja/auction_api)