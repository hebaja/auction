<template>
	<div id="auctioneer">
    <div v-show="auctioneer.id">

      <p v-if="errors.length">
        <b>Please correct the following error(s):</b>
        <ul class="red-text text-darken-4">
          <li v-for="error of errors" :key="error.id">{{ error }} </li>
        </ul>
      </p>
      
      <div>
        <h3>Auctions</h3>

        <register-auction-panel :auctioneerId="mutableAuctioneer.id" @auctionCreated='auctionCreated($event)'/>
        <div v-show="mutableActiveLot.active">
          <ul class="collapsible">
            <li>
              <div class="collapsible-header">
                <table class="centered">
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
                      <td>{{ mutableActiveLot.title }}</td>
                      <td>{{ mutableActiveLot.description }}</td>
                      <td>
                        <i class="inline-icon-money material-icons">attach_money</i><span style="margin-left: -1.2em;">{{ mutableActiveLot.startingBid }}</span>
                      </td>
                      <td>
                        <span v-show="mutableActiveLot.bids.length > 0">
                          <i class="inline-icon-money material-icons">attach_money</i><span style="margin-left: -1.2em; margin-right: 1em;">{{ lastBidValue }}</span>
                          <i class="inline-icon-money material-icons">person</i><span style="margin-left: -1.2em;">{{ lastBidPlayerName }}</span>
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div class="collapsible-body">
                <ul class="collection">
                  <li class="collection-item" v-for="bid of mutableActiveLot.bids.slice().reverse()" :key="bid.id">
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
            </li>
          </ul>
        </div>

        <div v-show="mutableAuctioneer.auctions.length">
          <ul class="collapsible">
            <li v-for="(auction, auctionIndex) of mutableAuctioneer.auctions" :key="auction.id">

              <div class="collapsible-header">
                <i class="material-icons">gavel</i>
                <span v-if="editMode.state && editMode.position === auctionIndex"><input :id="'auction-title'+auctionIndex" class="browser-default" type="text" style="width: 20em" v-model="auction.title" placeholder="Input auction's title"></span>
                <span v-else>{{ auction.title }}</span>
              </div>
              <div class="collapsible-body">
                <form v-show="!auction.finished" v-on:submit.prevent="update(auction, auctionIndex)">
                  <div class="row">
                    <div>
                      <app-button class="col s3" label="Finish" @click.prevent.native="finishAuction(auction, auctionIndex)"/>
                    </div>
                    <div>
                      <app-button class="col s3" category="edit" :label="editAuctionButton.label" v-if="!editMode.state || editMode.position === auctionIndex" @click.prevent.native="editAuction(auctionIndex)" />
                    </div>
                    <div>
                      <app-button class="col s3" category="delete" label="Delete" @click.prevent.native="deleteAuction(auction, auctionIndex)"/>
                    </div>
                  </div>
                  <div v-for="(lot, lotIndex) in auction.lots" :key="lot.id">
                    <div v-if="editMode.state && editMode.position === auctionIndex">
                      <div class="row">
                        <label class="col l1 xl1 lot-label-form hide-on-med-and-down" :for="'lot-title'+lotIndex" style="margin-right: -2em"><i class="inline-icon material-icons">arrow_forward</i></label>
                        <input :id="'lot-title'+lotIndex" class="col s12 l11 xl3 lot-input-form browser-default" type="text" v-model="lot.title" placeholder="Input lot's title" style="margin-bottom: .3em;">
                        <label class="col l1 xl1 lot-label-form hide-on-med-and-down" :for="'lot-description'+lotIndex" style="margin-right: -2em"><i class="inline-icon material-icons">label_outline</i></label>
                        <input :id="'lot-description'+lotIndex" class="col s12 l11 xl6 lot-input-form browser-default" type="text" v-model="lot.description" placeholder="Input lot's description">
                        <label class="col s12 xl1" v-tooltip.top="'Is it corret?'"><input type="checkbox" v-model="lot.correct" /><span>correct?</span></label>
                      </div>
                    </div>
                    <div v-else>
                      <div class="row">

                        <i v-if="!lot.active && !lot.pricePaid" class="material-icons col s1" style="font-size: 1.5em;">shopping_cart</i>
                        <i v-if="lot.active && !lot.pricePaid" class="material-icons col s1" style="font-size: 1.5em;">add_shopping_cart</i>
                        <i v-if="lot.pricePaid" class="material-icons col s1" style="font-size: 1.5em;">remove_shopping_cart</i>
                        
                        <span class="col s2"><i class="hide-on-small-only inline-icon material-icons" style="margin-left: -1.5em;">arrow_forward</i>{{ lot.title }}</span>
                        <span v-if="!lot.pricePaid" class="col s9 l6"><i class="inline-icon material-icons">label_outline</i>{{ lot.description }}</span>
                        <span v-else class="col s9"><i class="inline-icon material-icons">label_outline</i>{{ lot.description }}</span>
                      </div>

                      <div class="row">

                        <input v-model="startingBid[lot.id]" v-show="!lot.startingBid && !lot.pricePaid" class="col s4 browser-default starting-bid-input" type="text" placeholder="starting bid" style="margin-right: .5em;">
                        <span v-show="lot.startingBid && !lot.pricePaid" class="col s5 m3 browser-default">starting bid: {{ lot.startingBid }} </span>
                        <span v-if="lot.pricePaid" class="col s3 browser-default">sold to {{ lot.bids[lot.bids.length -1].playerName }} for ${{ lot.pricePaid }}</span>  
                          
                        <div v-if="!lot.active && !lot.pricePaid && !thereIsAnActiveLot">
                          <app-button class="col s4" label="Start lot" @click.prevent.native="startLot(auctioneer.id, lot.id, startingBid[lot.id], auctionIndex, lotIndex)"/>
                        </div>
                        <div v-if="lot.active && !lot.pricePaid">
                          <app-button class="col s3" label="Sell" @click.prevent.native="finishLot(auctioneer.id, lot.id)" />
                          <app-button class="col s3" category="delete" label="Reset" @click.prevent.native="cancelLot(auctioneer.id, lot.id, auctionIndex, lotIndex)"/>
                        </div>
                      </div>
                      <hr>
                    </div>

                  </div>
                  <div v-if="editMode.state && editMode.position === auctionIndex" class="row" style="margin-top: 1em;">
                    <div class="col s12">
                      <div class="row">
                        <app-floating-button category="add" v-tooltip.bottom="'Add a lot to the auction'" @click.prevent.native="addNewLot(auctionIndex)"/>
                        <app-floating-button category="remove" v-tooltip.bottom="'Remove last lot from the auction'" @click.prevent.native="removeLastLot(auctionIndex)"/>
                      </div>
                    </div>
                    <div>
                      <button v-if="editMode" class="col s12 m10 offset-m1 l8 offset-l2 btn-small blue darken-4" type="submit">Update Auction</button>
                    </div>
                  </div>
                </form>
                <div v-show="auction.finished" >
                  <a href="" class="waves-effect waves-light btn-small red" @click.prevent="resetAuction(auction.id, auctionIndex)" style="margin-bottom: 1em;">Reset</a>
                  <div v-show="auction.players.length" class="row">
                    <div v-for="player in auction.players" :key="player.id">
                      <div class="row">
                        <span class="col s4"><i class="inline-icon material-icons hide-on-small-only" style="margin-right: .3em;">group</i>{{ player.groupPlayer }}</span> 
                        <span class="col s4"><i class="inline-icon material-icons hide-on-small-only">person</i>{{ player.playerName }}</span>
                        <span class="col s4"><span>score: </span>{{ player.score }}</span>
                      </div>
                    </div>
                  </div>
                  <div class="divider" style="margin-bottom: 1em;"></div>
                  <div v-for="lot in auction.lots" :key="lot.id">
                    <div class="row">
                      <span v-bind:class=" [ lot.correct ? 'blue-text text-darken-4' : 'red-text text-darken-4' ] ">
                        <i v-if="lot.correct" class="col s1 inline-icon material-icons hide-on-med-and-down">done</i>
                        <i v-else class="col s1 inline-icon material-icons hide-on-med-and-down">clear</i>
                        <span class="col s2 hide-on-med-and-down"><i class="inline-icon material-icons hide-on-med-and-down">arrow_forward</i>{{ lot.title }}</span>
                        <span class="col s6 m4"><i class="inline-icon material-icons hide-on-med-and-down">label_outline</i>{{ lot.description }}</span>
                        <span class="col s3"><i class="inline-icon material-icons" style="margin-right: .2em;">monetization_on</i>{{ lot.pricePaid }}</span>
                        <span class="col s2" v-if="lot.bids.length"><i class="col s3 l4 inline-icon-money material-icons hide-on-med-and-down" style="margin-top: .1em;">person</i>{{ lot.bids[lot.bids.length -1].playerName }}</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
	</div>
</template>

<script>
	import axios from 'axios'

  import RegisterAuctionPanel from './RegisterAuctionPanel.vue'
  import AppButton from './shared/AppButton.vue'
  import AppFloatingButton from './shared/AppFloatingButton.vue'

	export default {
		name: 'auctioneer',
    data() {
      return {
        startingBid: [],
        errors: [],
        lastReceivedBid: {
          playerName: null,
          value: null
        },
        startLotObject: {
          auctioneerId: null,
          lotId: null,
          startingBid: null
        },
        sendLotObject: {
          auctioneerId: null,
          lotId: null
        },
        activeLot: {
          id: null,
          title: null,
          description: null,
          active: null,
          startingBid: null,
          bids: []
        },
        auctioneerReceiver: null,
        activeLotReceiver: null,
        thereIsAnActiveLot: null,
        editMode: {
          state: false,
          position: null
        },
        editAuctionButton: {
          label: 'Edit'
        },
        finishAuctionButton: {
          label: 'Finish'
        }
      }
    },

    components: {
      RegisterAuctionPanel, AppButton, AppFloatingButton
    },

    props: ['auctioneer', 'groupActiveArray', 'accessToken'],

    created() {

      setInterval(() => {
        if(this.thereIsAnActiveLot) {
          if(this.auctioneer) {
            axios.get('https://hebaja-auction-api.herokuapp.com/api/auctioneer-auctions/' + this.auctioneer.id)
            .then((response) => {
              var auctioneer = response.data

              if(auctioneer.auctions) {
                auctioneer.auctions.sort((a,b) => (a.title > b.title) ? 1 : ((b.title > a.title) ? -1 : 0))
                this.mutableAuctioneer.auctions.forEach(auction => {
                  auction.lots.forEach(lot => {
                    if(lot.active) {
                      this.thereIsAnActiveLot = true
                      this.mutableActiveLot = lot
                    }
                  })
                })
              }
              this.mutableAuctioneer = auctioneer

              
            })
          }
        }
      }, 5000)
    },
   
    computed: {
      mutableAuctioneer: {
        get: function() {
          let value
          if(this.auctioneerReceiver === null) {
            value = this.auctioneer
          } else {
            value = this.auctioneerReceiver
          }
          return value
        },
        set: function(newValue) {
          this.auctioneerReceiver = newValue
        }
      },

      mutableActiveLot: {
        get: function() {
          let value
          value = this.activeLot
          if(this.activeLotReceiver === null && this.mutableAuctioneer.auctions) {
            if(this.mutableAuctioneer.auctions.length && this.mutableAuctioneer.auctions.length > 0) {
              this.mutableAuctioneer.auctions.forEach(auction => {
								auction.lots.forEach(lot => {
									if(lot.active === true) {
                    this.thereIsAnActiveLot = true
										value = lot
									}
								})
							})
            }
          } else {
            value = this.activeLotReceiver
          }
   
          return value
        },
        set: function(newValue) {
          this.activeLotReceiver = newValue
        }
      },

      lastBidPlayerName: function() {
        var name
        if(this.mutableActiveLot.bids.length > 0) {
          name = this.mutableActiveLot.bids.slice().at(-1).playerName
        }
        return name
      },

      lastBidValue: function() {
        var value
        if(this.mutableActiveLot.bids.length > 0) {
          value = this.mutableActiveLot.bids.slice().at(-1).value
        }
        return value
      }

    },

  methods: {
    startLot: function(auctioneerId, lotId, startingBid, auctionIndex, lotIndex) {
      if(!startingBid) {
        this.errors.push('Starting bid required.')
      } else if(this.groupActiveArray.length === 0) {
        this.errors.push('You must activate a group.')
      } else if(isNaN(startingBid)) {
        this.errors.push('You must input a valid bid.')
      } else {
        this.startLotObject.auctioneerId = auctioneerId
        this.startLotObject.lotId = lotId
        this.startLotObject.startingBid = startingBid
        axios.post('https://hebaja-auction-api.herokuapp.com/api/auction/start-lot', this.startLotObject)
        .then(response => {
          this.errors.splice(0)
          var startedLot = response.data
          this.mutableAuctioneer.auctions[auctionIndex].lots.splice(lotIndex, 1, startedLot)
          if(startedLot.active) {
            this.thereIsAnActiveLot = true
            this.mutableActiveLot = startedLot
          }
        })
        .catch(error => {
          console.log(error)
          if(error == 'Error: Request failed with status code 400') {
              this.errors.push('Invalid value.')
            }
        })
      }
    },

    cancelLot: function(auctioneerId, lotId, auctionIndex, lotIndex) {
      this.sendLotObject.auctioneerId = auctioneerId
      this.sendLotObject.lotId = lotId
      let message = 'Do you want to reset this lot (all bids will be lost)?'
      let options = {
        okText: 'Reset',
        cancelText: 'Cancel'
      }
      this.$dialog.confirm(message, options)
        .then(() => {
          axios.post('https://hebaja-auction-api.herokuapp.com/api/auction/cancel-lot', this.sendLotObject)
          .then(response => {
            this.startingBid[lotId] = null
            this.mutableAuctioneer.auctions[auctionIndex].lots.splice(lotIndex, 1, response.data)
            this.mutableActiveLot = null
            this.thereIsAnActiveLot = false
          }).catch((error) => {
            const errorMessage = error.message
            console.log(errorMessage)
            // this.errors.push('This lot does not have any bid yet.')
          })
        }).catch(message => console.log(message))
    },

    finishLot: function(auctioneerId, lotId) {
      this.sendLotObject.auctioneerId = auctioneerId
      this.sendLotObject.lotId = lotId

      let message = 'Do you want to close and sell this lot?'
      let options = {
        okText: 'Sell',
        cancelText: 'Cancel'
      }

      this.$dialog.confirm(message, options)
        .then(() => {
          axios.post('https://hebaja-auction-api.herokuapp.com/api/auction/finish-lot', this.sendLotObject)
          .then(response => {
            this.mutableAuctioneer = response.data
            this.mutableActiveLot = null
            this.thereIsAnActiveLot = false
            this.errors.splice(0)
            this.$emit("updateGroupActive", this.mutableAuctioneer.groupPlayers);
          }).catch((error) => {
            const errorMessage = error.message
            if(errorMessage == 'Request failed with status code 500') {
              this.errors.push('Server error.')
            } else {
              console.log(errorMessage)
              this.errors.push('This lot does not have any bid yet.')
            }

            
          })
        }).catch(message => console.log(message))
    },

    lotCreated: function(event) {
      console.log(event)
    },

    auctionCreated: function(data) {
      this.mutableAuctioneer = data
    },

    update: function(auctionToUpdate, index) {

      var thereIsNoEmptyLotTitle = true
      var thereIsNoEmptyLotDescription = true

      auctionToUpdate.lots.forEach(lot => {
        if(!lot.title) {
          thereIsNoEmptyLotTitle = false
        }
        if(!lot.description) {
          thereIsNoEmptyLotDescription = false
        }
      })

      if(auctionToUpdate.title && thereIsNoEmptyLotTitle && thereIsNoEmptyLotDescription) {
        axios.post('https://hebaja-auction-api.herokuapp.com/api/auction/update', auctionToUpdate)
        .then(response => {
          if(response.status == 200) {
            this.mutableAuctioneer.auctions[index] = response.data
            this.editMode.state = false
            this.editAuctionButton.label = 'Edit'
            window.location.reload()
          }
        })
        .catch(err => console.log(err))
      } else if(!auctionToUpdate.title) {
        this.errors.push('You must input a title for the auction.')
      } else if(!thereIsNoEmptyLotTitle) {
        this.errors.push("You must not leave a lots's title empty.")
      } else if(!thereIsNoEmptyLotDescription) {
        this.errors.push("You must not leave a lot's description empty.")
      } else {
        this.errors.push("There was an unknown error.")
      } 
    },

    editAuction: function(index) {
      this.editMode.state = !this.editMode.state
      this.editAuctionButton.label = this.editMode.state ? 'Cancel' : 'Edit'
      this.editMode.position = this.editMode.state ? index : null
    },

    deleteAuction: function(auction, index) {
      let message = 'Are you sure?'
      let options = {
        okText: 'Delete',
        cancelText: 'Cancel'
      }

      this.$dialog.confirm(message, options)
        .then(() => {
          axios.post('https://hebaja-auction-api.herokuapp.com/api/auction/delete', auction)
          .then(response => {

            if(response.status === 202) {
              this.mutableAuctioneer.auctions.splice(index, 1)
            }

          }).catch(err => console.log(err))
        }).catch(message => console.log(message))
    },

    finishAuction: function(auction, index) {
      let message = 'Do you want to finish this auction and show the results?'
      let options = {
        okText: 'Finish',
        cancelText: 'Cancel'
      }
      this.$dialog.confirm(message, options)
        .then(() => {
          axios.post('https://hebaja-auction-api.herokuapp.com/api/auction/finish', auction)
            .then(response => {

              var finishedAuction = response.data

              if(finishedAuction.finished) {
                finishedAuction.players.sort((a, b) => b.score - a.score)
              }

              this.mutableAuctioneer.auctions.splice(index, 1, finishedAuction)
              this.mutableActiveLot = null
              this.thereIsAnActiveLot = false
          }).catch(err => console.log(err))
        }).catch(message => console.log(message))
    },

    resetAuction: function(auctionId, index) {
      let message = 'Do you want to reset this auction (all purchases will be deleted)?'
      let options = {
        okText: 'Reset',
        cancelText: 'Cancel'
      }
      this.$dialog.confirm(message, options)
        .then(() => {
          axios.get('https://hebaja-auction-api.herokuapp.com/api/auction/reset/' + auctionId)
          .then(response => {
            this.mutableActiveLot = null
            this.thereIsAnActiveLot = false
            this.mutableAuctioneer.auctions.splice(index, 1, response.data)
            this.mutableAuctioneer.auctions[index].lots.forEach(lot => {
            this.startingBid[lot.id] = null
          })
        }).catch(err => console.log(err))
      }).catch(message => console.log(message))
    },

    addNewLot: function(index) {
      this.mutableAuctioneer.auctions[index].lots.push({title: null, description: null, correct: false, bids: []})
    },
    
    removeLastLot: function(index) {
      this.mutableAuctioneer.auctions[index].lots.pop()
    }
  }
}

</script>

<style scoped>
.starting-bid-input {
  height: 2.2em;
  border: 1.5px solid gray; 
  border-radius: 6px;
}

a {
  color: inherit;
}

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

.custom-button {
  margin-right: .5em;
}

</style>