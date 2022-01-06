<template>
  <div id="register-player">
    <ul class="collapsible">
      <li>
        <div class="collapsible-header">
          <b>Register a group of players</b>
        </div>
        <div class="collapsible-body" style="margin-top: -2em;">
          <form id="group-player-form" v-on:submit.prevent="register">

            <p v-if="errors.length">
            <b>Please, correct the following error(s):</b>
              <ul class="red-text text-darken-4">
                <li v-for="error in errors" :key="error.id">{{ error }}</li>
              </ul>
            </p>

            <div class="row">
              <div class="col s12 input-field" style="margin-bottom: 1.5em;">
                <input id="group-name" type="text" v-model="groupPlayer.name">
                <label for="group-name">Group's name</label>
              </div>
              <div class="col s12">
                <div v-for="(player, index) in groupPlayer.players" :key="player.id">
                  <div class="row">
                    <label class="player-label-form" :for="'player-name'+index"><i class="col s1 inline-icon material-icons" style="margin-top: .4em;">person</i></label>
                    <input :id="'player-name'+index" class="col s7 player-input-form browser-default" type="text" v-model="player.name" placeholder="Input player's name">
                    <label class="player-label-form" :for="'wallet-value'+index" style="margin-left: 1.5em;"><i class="col s1 inline-icon material-icons" style="margin-top: .4em">account_balance_wallet</i></label>
                    <input :id="'wallet-value'+index" class="col s2 player-input-form browser-default" type="number" step="10" v-model="player.walletValue" placeholder="Value in wallet">
                  </div>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col s12">
                <div class="row">
                  <app-floating-button category="add" v-tooltip.top="'Add a player to the group'" @click.prevent.native="addPlayer"/>
                  <app-floating-button category="remove" v-tooltip.top="'Remove last player from the group'" @click.prevent.native="removeLastPlayer"/>
                </div>
              </div>
              <button class="col s12 m8 l6 offset-m2 offset-l3 btn-small blue darken-4" type="submit">Register players</button>
            </div>
          </form>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
  import AppFloatingButton from "./shared/AppFloatingButton.vue"

  import axios from 'axios'

  export default {

    name: 'register-player',
    props: ['auctioneerId'],
    components: {
      AppFloatingButton
    },
    data () {
      return {
        groupPlayer: {
          name: null,
          auctioneerId: null,
          players: []
        },
        errors: []
      }
    },
    created() {
      this.groupPlayer.players.push({name: null, walletValue: null })
    },
    methods: {
      register: function() {

        var thereIsNoEmptyName = true
        var thereIsNoEmptyWalletValue = true

        this.groupPlayer.players.forEach(player => {
          if(!player.name) {
            thereIsNoEmptyName = false
          }
          if(!player.walletValue) {
            thereIsNoEmptyWalletValue = false
          }
        })

        if(this.groupPlayer.name && thereIsNoEmptyName && thereIsNoEmptyWalletValue) {
          this.groupPlayer.auctioneerId = this.auctioneerId
          axios.post('https://hebaja-auction-api.herokuapp.com/api/group-player/register', this.groupPlayer)
					.then(response => {
            this.$emit('groupCreated', response.data)
            this.errors.splice(0)
            this.groupPlayer.name = null
            this.groupPlayer.auctioneerId = null
            this.groupPlayer.players = []
            this.groupPlayer.players.push({name: null, walletValue: null })
            document.location.reload(true)
          })
					.catch(err => console.log(err))
        } else if(!this.groupPlayer.name) {
          this.errors.push('You must input a name for the group.')
        } else if(!thereIsNoEmptyName) {
          this.errors.push("You must not leave a player's name empty.")
        } else if(!thereIsNoEmptyWalletValue) {
          this.errors.push("You must not leave a player's wallet empty.")
        } else {
          this.errors.push("There was an unknown error.")
        }
      },
      addPlayer: function() {
        this.groupPlayer.players.push({name: null, walletValue: null })
      },
      removeLastPlayer: function() {
        this.groupPlayer.players.pop()
      }
    }
  }
</script>

<style scoped>
  .player-input-form {
    height: 1.8em;
    margin-top: .4em;
    border: 1.5px solid gray; 
    border-radius: 6px;
  }

  .player-label-form {
    color: black;
    font-size: 1em;
    
  }
</style>
