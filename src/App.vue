<template>
  <div id="app">
    
    <nav class="blue darken-4">
      <div class="nav-wrapper">
        <a href="https://joy-auction.herokuapp.com" class="brand-logo">
          <div class="row">
            <span class="col s12">Joy.auction</span>
          </div>
        </a>
        <ul id="nav-mobile" class="right hide-on-med-and-down">
          <li v-show="!thereIsNoUser"><a>{{ auctioneer.name }}</a></li>
          <li v-show="!thereIsNoUser && !query.playerId" style="margin-bottom: 2em;"><a href="" @click="signOut">Signout</a></li>
          <li v-show="!thereIsNoUser && !query.playerId" style="margin-bottom: 2em;"><a href="" @click.prevent="deleteAccount">Delete</a></li>
        </ul>
      </div>
    </nav>

    <div class="container">

      <div v-show="!thereIsNoUser && !query.playerId">
        <auctioneer-panel :auctioneer="auctioneer" :groupActiveArray="groupActiveArray" :accessToken="accessToken" @updateGroupActive="updateGroupActive($event)"/>
        <group-player-panel :groupPlayers="auctioneer.groupPlayers" :auctioneerId="auctioneer.id" :groupActiveArray="groupActiveArray" @changeGroupActive="groupActiveArray = $event"/>  
      </div>

      <div v-show="thereIsNoUser && !query.playerId">
        <signin-panel :auctioneerId="auctioneer.id"/>
      </div>

      <div v-show="query.playerId">
        <player-panel :playerId="query.playerId"/>
      </div>

    </div>

  </div>
</template>

<script>
import AuctioneerPanel from './components/AuctioneerPanel.vue'
import GroupPlayerPanel from './components/GroupPlayersPanel.vue'
import SigninPanel from './components/SigninPanel.vue'
import PlayerPanel from './components/PlayerPanel.vue'

import axios from 'axios';

import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";


console.log(process.env.VUE_APP_NAME)

const firebaseConfig = {
  apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
  authDomain: process.env.VUE_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VUE_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VUE_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VUE_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VUE_APP_FIREBASE_APP_ID,
  measurementId: process.env.VUE_APP_FIREBASE_MEASUREMENT_ID
}

initializeApp(firebaseConfig);

export default {
  name: 'App',
  components: {
    AuctioneerPanel, 
    GroupPlayerPanel,
    SigninPanel,
    PlayerPanel,
  },
  data() {
    return {
      auctioneerId: null,
      playerId: null,
      auctioneer: {
        id: null,
        name: null,
        auctions: [],
        groupPlayers: []
      },
      player: {
        id: null,
        playerName: null,
        walletValue: null
      },
      query: {
        playerId: null,
      },
      groupActiveArray: [],
      accessToken: null,
      thereIsNoUser: false,
      connectionError: false,
      deleteAuctioneer: {
        id: null,
        uid: null,
      }
    }
  },

  created() {
    let uri = window.location.href.split('?')
      if(uri.length == 2) {
        let vars = uri[1].split('&')
        let getVars = {}
        let tmp = ''
        vars.forEach(function(v) {
          tmp = v.split('=')
          if(tmp.length == 2)
            getVars[tmp[0]] = tmp[1]
        })
        this.query = getVars
      }

      const auth = getAuth();
      onAuthStateChanged(auth, (user) => {
        
        if(user) {
          if(user.emailVerified) {
            axios.post('https://hebaja-auction-api.herokuapp.com/api/firebase-auth', user.accessToken)
            .then((response) => {
              this.connectionError = false
              this.auctioneer = response.data
              this.thereIsNoUser = false
              this.email = null
              this.password = null
              this.accessToken = user.accessToken

              if(!this.groupActiveArray.length && this.auctioneer.groupPlayers) {
                this.auctioneer.groupPlayers.forEach(groupPlayer => {
                  if(groupPlayer.active === true) {
                    this.groupActiveArray.push(groupPlayer.id)
                  }
                })
              }
            })
            .catch(err => {
              console.log("showing error -> " + err)
              this.signOut(auth)
            } )
          } else {
            console.log('email not verified')
            this.signOut(auth)
          }
        } else {
          console.log('no user present')
          this.thereIsNoUser = true
          this.signOut(auth)
        }
      })
  },
  computed: {
    activeLots: function() {
      let activeLots = []
      if(this.auctioneer) {
        this.auctioneer.auctions.forEach(auction => {
          auction.lots.forEach(lot => {
            if(lot.active) {
              activeLots.push(lot)
            }
          })
        })
      }
      return activeLots
    }
  }, 
  methods: {
    updateGroupActive(event) {
      this.auctioneer.groupPlayers = event
    },
  
    methodToRunOnSelect(payload) {
      this.object = payload;
    },

    signOut: function() {
      signOut(getAuth()).then(() => console.log('siging out')).catch(err => console.log(err))
    },

    deleteAccount: function() {
      let message = 'Do you really want to delete your account?'
      let options = {
        okText: 'Delete',
        cancelText: 'Cancel'
      }
      this.$dialog.confirm(message, options)
        .then(() => {
          this.deleteAccountConfirm()
        }).catch(message => console.log(message))
    },

    deleteAccountConfirm: function() {
    let message = 'If you delete your account, all your data will be lost.'
    let options = {
      okText: 'Delete my account',
      cancelText: 'Cancel'
    }
    this.$dialog.confirm(message, options)
      .then(() => {
        const auth = getAuth()
        onAuthStateChanged(auth, (user) => {
          if(user) {
            this.deleteAuctioneer.id = this.auctioneer.id
            this.deleteAuctioneer.uid = user.uid
            axios.post('https://hebaja-auction-api.herokuapp.com/api/auctioneer/delete', this.deleteAuctioneer)
            .then(response => {
              if(response.status == 200) {
                this.signOut()
                document.location.reload(true)
              } else {
                console.log('unexpected response status ' + response.status)
              }
            }).catch((error) => {
              console.log(error)
              if(error == 'Error: Request failed with status code 400') {
                this.errors.push('There was a problem when trying to delete user.')
              }
              if(error == 'Error: Network Error') {
                this.errors.push('Could not connect to server. Please check your internet connection.')
              }
            })
          } 
        })
      }).catch(message => console.log(message))
    }

  }

}
</script>

<style>
table {
    border-collapse: collapse;
    width: 80%;
  }

  td, th {
    border: 1px solid #dddddd;
    text-align: left;
    padding: 8px;
  }

  .heading {
    font-family: arial, sans-serif;
  }

  .dg-btn--ok {
    border-color: red !important;
    background-color: red !important;
    color: white !important;
    box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2), 0 6px 20px 0 rgba(0,0,0,0.19);
  }
 
  .dg-btn--ok:active {
    transform: translateY(2px) translateX(2px);
    box-shadow: 0 10px 18px 0 rgba(0,0,0,0.2), 0 6px 20px 0 rgba(0,0,0,0.19);
  }

  .dg-btn--cancel {
    border-color: green;
    background-color: green !important;
    color: white;
    box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2), 0 6px 20px 0 rgba(0,0,0,0.19);
  }

  .dg-btn--cancel:active {
    transform: translateY(2px) translateX(2px);
    box-shadow: 0 10px 18px 0 rgba(0,0,0,0.2), 0 6px 20px 0 rgba(0,0,0,0.19);
  }

  .tooltip {
    display: block !important;
    z-index: 10000;
  }

  .tooltip .tooltip-inner {
    background: black;
    color: white;
    border-radius: 16px;
    padding: 5px 10px 4px;
    opacity: 0.7;
  }

  .tooltip .tooltip-arrow {
    width: 0;
    height: 0;
    border-style: solid;
    position: absolute;
    margin: 5px;
    border-color: black;
    opacity: 0.7;
    z-index: 1;
  }

  .tooltip[x-placement^="top"] {
    margin-bottom: 5px;
  }

  .tooltip[x-placement^="top"] .tooltip-arrow {
    border-width: 5px 5px 0 5px;
    border-left-color: transparent !important;
    border-right-color: transparent !important;
    border-bottom-color: transparent !important;
    bottom: -5px;
    left: calc(50% - 5px);
    margin-top: 0;
    margin-bottom: 0;
  }

  .tooltip[x-placement^="bottom"] {
    margin-top: 5px;
  }

  .tooltip[x-placement^="bottom"] .tooltip-arrow {
    border-width: 0 5px 5px 5px;
    border-left-color: transparent !important;
    border-right-color: transparent !important;
    border-top-color: transparent !important;
    top: -5px;
    left: calc(50% - 5px);
    margin-top: 0;
    margin-bottom: 0;
  }

  .tooltip[x-placement^="right"] {
    margin-left: 5px;
  }

  .tooltip[x-placement^="right"] .tooltip-arrow {
    border-width: 5px 5px 5px 0;
    border-left-color: transparent !important;
    border-top-color: transparent !important;
    border-bottom-color: transparent !important;
    left: -5px;
    top: calc(50% - 5px);
    margin-left: 0;
    margin-right: 0;
  }

  .tooltip[x-placement^="left"] {
    margin-right: 5px;
  }

  .tooltip[x-placement^="left"] .tooltip-arrow {
    border-width: 5px 0 5px 5px;
    border-top-color: transparent !important;
    border-right-color: transparent !important;
    border-bottom-color: transparent !important;
    right: -5px;
    top: calc(50% - 5px);
    margin-left: 0;
    margin-right: 0;
  }

  .tooltip.popover .popover-inner {
    background: #f9f9f9;
    color: black;
    padding: 24px;
    border-radius: 5px;
    box-shadow: 0 5px 30px rgba(black, .1);
  }

  .tooltip.popover .popover-arrow {
    border-color: #f9f9f9;
  }

  .tooltip[aria-hidden='true'] {
    visibility: hidden;
    opacity: 0;
    transition: opacity .15s, visibility .15s;
  }

  .tooltip[aria-hidden='false'] {
    visibility: visible;
    opacity: 1;
    transition: opacity .15s;
  }

</style>
