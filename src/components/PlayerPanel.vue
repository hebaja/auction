<template>
	<div id="playerPanel" class="row" style="margin-top: 2em;">
		<div v-if="loader.loading">
			<div class="col s1 offset-s6">
				<grid-loader :loading="loader.loading" :color="loader.color" :size="loader.size" />
			</div>
		</div>
		<div v-else>
			<div v-if="errorMessage" class="col s12">
				<p class="red-text center-align">{{ errorMessage }}</p>
			</div>
			<div class="col s12 l6 blue-text text-darken-4">
				<i class="material-icons col s1" style="font-size: 1.9em;">person</i>
				<span class="col s5" style="font-size: 1.2em">&nbsp;{{ player.playerName }}</span>
			</div>
			<div class="col s12 l6 green-text text-darken-4">
				<i class="material-icons col s1" style="font-size: 1.9em;">wallet</i>
				<span class="col s5" style="font-size: 1.2em">&nbsp;&nbsp;{{ player.walletValue }}</span>
			</div>
			<div class="col s12" style="margin-top: 1em;">
				<hr/>
			</div>
			<ul class="collection with-header" v-if="playerAcquiredLots">
				<li class="collection-header"><h6>Acquired lots</h6></li>
				<li v-for="lot in player.acquiredLots" :key="lot.id" class="collection-item">
					{{ lot.description }}
					&nbsp;&nbsp;
					<span class="red-text text-darken-4">
						<i class="material-icons inline-icon">attach_money</i>{{ lot.pricePaid }}
					</span>
				</li>
			</ul>
			<div v-if="player.activeLot">
				<ActiveLot 
					:description="player.activeLot.description"
					:lotStartingBid="player.activeLot.startingBid"
					:lastBidPlayerName="lastBid ? lastBid.playerName : ''"
					:lastBidValue="lastBid ? lastBid.value : ''"
				/>
				<form v-on:submit.prevent="makeBid">
					<div class="row center-align">
						<div class="input-field col s6 l4 offset-l2">
							<i class="material-icons prefix">attach_money</i>
							<input 
								v-model="bidValue"
								type="number"
								id="bid-input"
								min="0"
								step="any">
							<label for="bid-input">Your bid here</label>
						</div>
						<button 
							class="col s6 l4 waves-effect waves-light btn button-activate blue darken-4"
							type="submit"
							style="margin-top: 1.5em;"
							:disabled="disabledButton">
								Make bid
						</button>
						<div class="col s1" style="margin-top: 1.5em;">
							<grid-loader :loading="buttonLoader.loading" :color="buttonLoader.color" :size="buttonLoader.size" />
						</div>
					</div>
				</form>
				<div style="margin-top: -2em;">
					<ReceivedBids 
						header="Bids made"
						:bidList="invertedBidList"
					/>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import ActiveLot from './shared/ActiveLot.vue'
import ReceivedBids from './shared/ReceivedBids.vue'
import GridLoader from "vue-spinner/src/GridLoader.vue";

export default {
	name: 'player',
	data() {
		return {
			player: {},
			errorMessage: '',
			requestInterval: null,
			bid: {
				playerId: null,
				playerName: null,
				value: null,
				lotId: null
			},
			loader: {
				color: '#0d47a1',
				size: '12px',
				loading: false
			},
			buttonLoader: {
				color: '#0d47a1',
				size: '7px',
				loading: false
			},
			bidValue: null,
			disabledButton: false
		}
	},
	props: ['playerId'],
	components: {
		ActiveLot,
		ReceivedBids,
		GridLoader
	},
	computed: {
		lastBid() {
			if(this.player.activeLot.bids) {
				return this.player.activeLot.bids[this.player.activeLot.bids.length - 1]
			} else {
				return ''
			}
		},
		invertedBidList() {
			if(this.player.activeLot.bids) {
				return this.player.activeLot.bids.slice().reverse()
			} else {
				return ''
			}
		},
		playerAcquiredLots() {
			if(this.player.acquiredLots.length > 0) {
				return true
			}
			return false
		}
	},

	mounted() {
		if(this.$route.query.playerId) {
			this.loader.loading = true
			let playerId = this.$route.query.playerId
			this.$http.get('/api/player/' + playerId)
			.then((response) => {
				this.player = response.data
				this.loader.loading = false
				this.requestInterval = setInterval(() => {
					this.$http.get('/api/player/' + playerId)
					.then((response) => {
						this.player = response.data
					})
					.catch((error) => {
						console.log(error)
						this.loader.loading = false
						this.errorMessage = 'It wasn\'t possible to update player\'s panel.'
					})
				}, 5000)
			})
			.catch(error => {
				console.log(error)
				this.loader.loading = false
				this.errorMessage = 'It wasn\'t possible to load player\'s panel. Please try again'
		})
		} else {
			this.errorMessage = 'There was a problem with the link'
		}
	},
	beforeDestroy() {
		clearInterval(this.requestInterval)
	},
	methods: {
		makeBid() {
			this.bid.playerId = this.player.id
			this.bid.playerName = this.player.playerName
			this.bid.value = this.bidValue
			this.bid.lotId = this.player.activeLot.id
			var parsedBidValue = parseFloat(this.bid.value)
			var parsedWalletValue = parseFloat(this.player.walletValue)
			if(!this.bid.value) {
				this.errorMessage = 'You must insert a value in bid.'
			} else if(isNaN(this.bid.value)) {
				this.errorMessage  = 'You must input a valid bid.'
			} else if(this.bid.value <= this.lastBidValue) {
				this.errorMessage = 'Your bid must be greater than the last bid.'
			} else if(parsedBidValue > parsedWalletValue) {
				this.errorMessage = "You don't have enough money for such bid."
			} else {
				this.disabledButton = true
				this.buttonLoader.loading = true
				this.$http.post(process.env.VUE_APP_DEFAULT_API_BASE_URL + '/api/player/make-bid', this.bid)
				.then(response => {
					if(response.status === 200) {
						this.errorMessage = ''
						this.player = response.data
						this.bidValue = null
					} else {
						this.errorMessage = 'Your bid is invalid.'
					}
					this.disabledButton = false
					this.buttonLoader.loading = false
				})
				.catch(error => {
					console.log(error)

					if(error.response) {
						switch(error.response.status) {
							case 409:
								console.log(error)
								this.errorMessage = 'Your bid must be higher than last bid'
								break
							case 417:
								console.log(error)
								this.errorMessage = 'Your bid must be higher than starting bid'
								break
							case 401:
								console.log(error)
								this.errorMessage = 'Your group is not active'
								break
							case 411:
								console.log(error)
								this.errorMessage = 'This lot has not been started'
								break
							case 400:
								console.log(error)
								this.errorMessage = 'Your bid is invalid'
								break
							default:
								console.log(error)
								this.errorMessage = 'There was an unknown error'
						}
					}
					
					if(error == 'Error: Network Error') {
						this.errorMessage = 'Could not connect to server. Please check your internet connection.'
					}
					this.disabledButton = false
					this.buttonLoader.loading = false
				})
			}
		}
	}
}
</script>

<style scoped>
</style>