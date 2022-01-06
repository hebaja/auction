<template>
  <div id="playerPanel">
    <div v-show="player.id">
    <div class="row" style="margin-top: 2em;">
      <span class="col s6"><i class="inline-icon material-icons">person</i>{{ player.playerName }}</span>
      <span class="col s6"><i class="inline-icon material-icons">account_balance_wallet</i>{{ player.walletValue }}</span>
    </div>

    <ul class="collapsible" >
      <li>
        <div class="collapsible-header">
          <b>Acquired lots</b>
        </div>

        <div class="collapsible-body">
          <div v-if="player.acquiredLots.length">
            <table class="centered">
              <thead>
                <tr>
                  <th>Acquired lot</th>
                  <th>Description</th>
                  <th>Price paid</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="lot of player.acquiredLots" :key="lot.id">
                  <td>{{ lot.title }}</td>
                  <td>{{ lot.description }}</td>
                  <td>
                    <i class="inline-icon-money material-icons">attach_money</i><span>{{ lot.pricePaid }}</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </li>
    </ul>

    <p v-if="errors.length">
      <b>Please correct the following error(s):</b>
      <ul class="red-text text-darken-4">
        <li v-for="error of errors" :key="error.id">{{ error }} </li>
      </ul>
    </p>

    <ul v-if="player.activeLot" class="collapsible" style="margin-top: 2em;">
      <li>
        <form v-on:submit.prevent="makeBid" style="margin-top: 1.4em;">
          <div class="row">
            <input class="col s4 offset-s1 browser-default" type="number" v-model="bidValue" placeholder="Bid here" style="height: 2.3em;">
            <button class="col s5 offset-s1 waves-effect waves-light btn-small button-activate blue darken-4" :disabled="disabledButton" type="submit">Make bid</button> 
          </div>
        </form>
        <div class="collapsible-header" >
          <b v-if="!player.activeLot">Active lot</b>
          <div class="show-on-small hide-on-med-and-up">
            <b>Active lot:</b> {{ player.activeLot.title }}
            <br>
            <b>Description:</b> {{ player.activeLot.description }}
            <br>
            <b>Starting bid:</b> ${{ player.activeLot.startingBid }}
            <div v-show="player.activeLot.bids.length > 0">
              <b>Last bid:</b> <i class="inline-icon-money material-icons">attach_money</i><span style="margin-left: -1.4em;">{{ lastBidValue }}</span>
              <i class="inline-icon-money material-icons" style="margin-left: .3em; margin-right: .1em;">remove</i>
              <i class="inline-icon-money material-icons">person</i><span style="margin-left: -1.2em;">{{ lastBidPlayerName }}</span>
            </div>
          </div>

          <table class="centered hide-on-small-only">
            <thead>
              <tr>
                <th>Active lot</th>
                <th>Description</th>
                <th>Starting</th>
                <th>Last bid</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{{ player.activeLot.title }}</td>
                <td>{{ player.activeLot.description }}</td>
                <td>
                  <i class="inline-icon-money material-icons">attach_money</i><span style="margin-left: -1.2em;">{{ player.activeLot.startingBid }}</span>
                </td>
                <td>
                  <span v-show="player.activeLot.bids.length > 0">
                    <div class="hide-on-small-only">
                      <i class="inline-icon-money material-icons">attach_money</i><span style="margin-left: -1.2em; margin-right: 1em;">{{ lastBidValue }}</span>
                      <i class="inline-icon-money material-icons">person</i><span style="margin-left: -1.2em;">{{ lastBidPlayerName }}</span>
                    </div>
                    <div class="show-on-small hide-on-med-and-up">
                      ${{ lastBidValue }} - {{ lastBidPlayerName }}
                    </div>
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="collapsible-body">
          <div>
            <ul class="collection">
              <li class="collection-item" v-for="bid of player.activeLot.bids.slice().reverse()" :key="bid.id">
                <div class="row">
                  <div class="col s6">
                    <i class="inline-icon material-icons">person</i>{{ bid.playerName }}  
                  </div>
                  <div class="col s6">
                    <i class="inline-icon material-icons">attach_money</i>{{ bid.value }}
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </li>
    </ul>
  </div>
  </div>
</template>

<script>
	import axios from 'axios'

  export default {
    name: 'playerPanel',
    data() {
      return {
        player: {
          id: null,
          playerName: null,
          walletValue: null,
          activeLot: {
            id: null,
            title: null,
            description: null,
            startingBid: null,
            active: null,
            bids: []
          },
          acquiredLots: []
        },
        lastReceivedBid: {
          playerName: null,
          value: null
        },
        bid: {
          playerId: null,
          playerName: null,
          value: null,
          lotId: null
        },
        bidValue: null,
        errors: [],
        disabledButton: false
      }
    },   
    created() {
      if(this.playerId) {
        axios.get('https://hebaja-auction-api.herokuapp.com/api/player/' + this.playerId)
        .then((response) => this.player = response.data)
        .catch(error => console.log(error))

        setInterval(() => {
          if(this.playerId) {
            axios.get('https://hebaja-auction-api.herokuapp.com/api/player/' + this.playerId)
            .then((response) => this.player = response.data)
            .catch(error => console.log(error))
          }
        }, 5000)
      }
    },

    methods: {
      makeBid: function() {

        this.bid.playerId = this.player.id
        this.bid.playerName = this.player.playerName
        this.bid.value = this.bidValue
        this.bid.lotId = this.player.activeLot.id

        var parsedBidValue = parseFloat(this.bid.value)
        var parsedWalletValue = parseFloat(this.player.walletValue)
       
        if(!this.bid.value) {
          this.errors.push('You must insert a value in bid.')
        } else if(isNaN(this.bid.value)) {
          this.errors.push('You must input a valid bid.')
        } else if(this.bid.value <= this.lastBidValue) {
          this.errors.push('Your bid must be greater than the last bid.')
        } else if(parsedBidValue > parsedWalletValue) {
          this.errors.push("You don't have enough money for such bid.")
        } else {
          this.disabledButton = true
          axios.post('https://hebaja-auction-api.herokuapp.com/api/player/make-bid', this.bid)
					.then(response => {
            if(response.status === 200) {
              this.errors.splice(0)
              this.player = response.data
              this.bidValue = null
            } else {
              this.errors.push('Your bid is invalid.')
            }
            this.disabledButton = false
          }).catch(error => {
            if(error == 'Error: Request failed with status code 400') {
              this.errors.push('Your bid is invalid.')
            }
            if(error == 'Error: Network Error') {
              this.errors.push('Could not connect to server. Please check your internet connection.')
            }
            this.disabledButton = false
          })
        }
      }
    },

    computed: {
      
      lastBidPlayerName: function() {
        var name
        
        if(this.player.activeLot.bids.length > 0) {
          name = this.player.activeLot.bids.slice().at(-1).playerName
        }
        return name
      },

      lastBidValue: function() {
        var value
        
        if(this.player.activeLot.bids.length > 0) {
          value = this.player.activeLot.bids.slice().at(-1).value
        }
        
        return value
      }
    },

    props: ['playerId']

  }
</script>

<style scoped>

  table, th, td {
    border: 0;
	}

	table {
		width: 100%;
    border-collapse: separate;
	}

  .inline-icon-money {
    margin-left: -.5em;
    vertical-align: sub;
    font-size: 18px !important;
  }

</style>