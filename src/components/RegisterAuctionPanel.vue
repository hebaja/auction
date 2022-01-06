<template>
  <div id="register-auction">
    <ul class="collapsible">
      <li>
        <div class="collapsible-header">
          <b>Register an auction</b>
        </div>
        <div class="collapsible-body" style="margin-top: -2em;">
          <form id="auction-form" v-on:submit.prevent="register">

            <p v-if="errors.length">
            <b>Please, correct the following error(s):</b>
              <ul class="red-text text-darken-4">
                <li v-for="error in errors" :key="error.id">{{ error }}</li>
              </ul>
            </p>

            <div class="row">

              <div class="section">
                <div class="col s12 input-field" >
                  <input id="auction-title" type="text" v-model="auction.title">
                  <label for="auction-title">Auction's title</label>
                </div>
                
                <div class="section" >
                  <div class="col s12" style="margin-top: -1em;">
                    <div v-for="(lot, index) in auction.lots" :key="lot.id">
                      <div class="row">
                        
                        <label class="col l1 hide-on-med-and-down lot-label-form" :for="'lot-title'+index" style="margin-top: .5em; margin-right: -1.8em;"><i class="inline-icon material-icons">arrow_forward</i></label>
                        <input :id="'lot-title'+index" class="col s12 l2 lot-input-form browser-default" type="text" v-model="lot.title" placeholder="Input lot's title">
                                                
                        <label class="col l1 hide-on-med-and-down lot-label-form" :for="'lot-description'+index" style="margin-top: .5em; margin-right: -1.8em;"><i class="inline-icon material-icons">label_outline</i></label>
                        <input :id="'lot-description'+index" class="col s12 l7 lot-input-form browser-default" type="text" v-model="lot.description" placeholder="Input lot's description">
                        
                        <label class="col s12 l1 right-align" style="margin-top: .6em;" v-tooltip.top="'Is it correct?'"><input type="checkbox" v-model="lot.correct" /><span>correct?</span></label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col s12">
                <div class="row">
                  <app-floating-button category="add" v-tooltip.top="'Add a lot to the auction'" @click.prevent.native="addLot" />
                  <app-floating-button category="remove" v-tooltip.top="'Remove last lot from the auction'" @click.prevent.native="removeLastLot"/>
                </div>
              </div>
              <button class="col s12 m8 l6 offset-m2 offset-l3 btn-small blue darken-4 waves-effect" type="submit">Register auction</button>
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

    name: 'register-auction',
    props: ['auctioneerId'],
    components: {
      AppFloatingButton
    },
    data () {
      return {
        auction: {
          auctioneerId: null,
          title: null,
          lots: []
        },
        errors: []
      }
    },
    created() {
      this.auction.lots.push({title: null, description: null, correct: false })
    },
    methods: {
      register: function() {

        var thereIsNoEmptyLotTitle = true
        var thereIsNoEmptyLotDescription = true

        this.auction.lots.forEach(lot => {
          if(!lot.title) {
            thereIsNoEmptyLotTitle = false
          }
          if(!lot.description) {
            thereIsNoEmptyLotDescription = false
          }
        })

        if(this.auction.title && thereIsNoEmptyLotTitle && thereIsNoEmptyLotDescription) {
          this.auction.auctioneerId = this.auctioneerId
          axios.post('https://hebaja-auction-api.herokuapp.com/api/auction/register', this.auction)
					.then(response => {
            this.$emit('auctionCreated', response.data)
            this.errors.splice(0)
            this.auction.title = null
            this.auction.auctioneerId = null
            this.auction.lots = []
            this.auction.lots.push({title: null, description: null, correct: false })
            document.location.reload(true)
          }).catch(err => console.log(err))
        } else if(!this.auction.title) {
          this.errors.push('You must input a title for the auction.')
        } else if(!thereIsNoEmptyLotTitle) {
          this.errors.push("You must not leave a lots's title empty.")
        } else if(!thereIsNoEmptyLotDescription) {
          this.errors.push("You must not leave a lot's description empty.")
        } else {
          this.errors.push("There was an unknown error.")
        }
      },
      addLot: function() {
        this.auction.lots.push({title: null, description: null, correct: false })
      },
      removeLastLot: function() {
        this.auction.lots.pop()
      }
    }
  }
</script>

<style scoped>
  .lot-input-form {
    height: 1.8em;
    margin-top: .4em;
    border: 1.5px solid gray; 
    border-radius: 6px;
  }

  .lot-label-form {
    color: black;
    font-size: 1em;
  }
</style>
