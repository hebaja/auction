<template>
	<div class="row" style="margin-top: 2em;">
		<div v-if="loader.loading">
			<div class="col s1 offset-s5">
				<grid-loader :loading="loader.loading" :color="loader.color" :size="loader.size" />
			</div>
		</div>
		<div v-else>
			<div v-if="errorMessage" class="col s12 center-align">
				<p class="red-text">{{ errorMessage }}</p>
			</div>
			<ActiveLot 
				:description="lot.description"
				:lotStartingBid="lot.startingBid"
				:lastBidPlayerName="lastBid ? lastBid.playerName : ''"
				:lastBidValue="lastBid ? lastBid.value : ''"
			/>
			<div class="col s12" style="margin-top: 1em;">
				<div class="col s6">
					<AppButton class="col s12" label="Sell" @click.prevent.native="$modal.show('confirmSellLotModal')" />
				</div>
				<div class="col s6">
					<AppButton class="col s12" category="delete" label="Reset" @click.prevent.native="$modal.show('confirmResetLotModal')"/>
				</div>
			</div>
			<AppModal 
				name="confirmResetLotModal"
				message="Do you really want to reset this lot? All bids made so far will be erased."
				confirmMessage="Reset"
				@cancel-click="$modal.hide('confirmResetLotModal')"
				@confirm-click="reset"
			/>
			<AppModal 
				name="confirmSellLotModal"
				message="Are you going to sell this lot to the player who gave the highest bid?"
				confirmMessage="Sell"
				@cancel-click="$modal.hide('confirmSellLotModal')"
				@confirm-click="sell"
			/>
			<ReceivedBids
				header="Received bids"
				:bidList="invertedBidList"
			/>
		</div>
	</div>
</template>

<script>
import { mapGetters } from 'vuex'
import AppButton from './shared/AppButton.vue'
import AppModal from './shared/AppModal.vue'
import ActiveLot from './shared/ActiveLot.vue'
import ReceivedBids from './shared/ReceivedBids'
import GridLoader from "vue-spinner/src/GridLoader.vue";

export default {
	name: 'active-lot',
	props: ['activeLotForm'],
	components: {
		AppButton,
		AppModal,
		ActiveLot,
		ReceivedBids,
		GridLoader
	},
	data() {
		return {
			lot: {},
			requestInterval: null,
			errorMessage: '',
			loader: {
				color: '#0d47a1',
				size: '12px',
				loading: false
			}
		}
	},
	computed: {
		...mapGetters(['storedActiveLotForm']),
		invertedBidList() {
			if(this.lot.bids) {
				return this.lot.bids.slice().reverse()
			} else {
				return ''
			}
		},
		lastBid() {
			if(this.lot.bids) {
				return this.lot.bids[this.lot.bids.length - 1]
			} else {
				return this.lot.bids
			}
		}
	},
	mounted() {
		if(!this.activeLotForm && !this.storedActiveLotForm) {
			this.errorMessage = 'There was a problem when loading the lot'
		} else if(this.activeLotForm) {
			this.loader.loading = true
			this.$store.dispatch('defineActiveLotForm', this.activeLotForm)
			.then((data) => {
				this.lot = data
				this.interval(this.lot.id)
				this.loader.loading = false
				if(!this.lot.existActiveGroup) {
					this.errorMessage = 'You must activate a group of players'
				}
			})
			.catch((error) => {
				console.log(error)
				this.errorMessage = 'There was a problem when loading the lot'
				this.loader.loading = false
			})
		} else if(this.storedActiveLotForm) {
			this.loader.loading = true
			this.$store.dispatch('defineActiveLotForm', this.storedActiveLotForm)
			.then((data) => {
				this.lot = data
				this.interval(this.lot.id)
				this.loader.loading = false
				if(!this.lot.existActiveGroup) {
					this.errorMessage = 'You must activate a group of players'
				}
			})
			.catch(() => {
				this.errorMessage = 'There was a problem when loading the lot'
			})
		}
	},
	beforeDestroy() {
		clearInterval(this.requestInterval)
	},
	methods: {
		reset() {
			this.$store.dispatch('resetActiveLotForm', this.lot.id)
			.then(() => {
				this.$modal.hide('confirmResetLotModal')
				this.$store.commit('RESET_ACTIVE_LOT_FORM')
				this.$router.push({name: 'auction', params: {auctionId: this.lot.id }})
			})
			.catch((error) => {
				console.log(error)
				this.errorMessage = 'There was a problem when trying to reset auction.'
			})
		},
		interval(lotId) {
			this.requestInterval = setInterval(() => {
			this.$http.get('/api/auction/lot/' + lotId)
			.then((response) => {
				this.lot = response.data
			})
			.catch((error) => {
				this.errorMessage = 'It wasn\'t possible to update lot'
				console.log(error)
			})
			}, 5000)
		},
		sell() {
			let finishLotForm = {
				lotId: this.lot.id
			}
			this.$http.post('/api/auction/finish-lot', finishLotForm)
			.then((response) => {
				this.$store.commit('RESET_ACTIVE_LOT_FORM')
				this.$router.push({name: 'auction', params: {auctionId: response.data.id }})
			})
			.catch((error) => {
				console.log(error)
			})

		}
	}
}
</script>

<style>

</style>