<template>
	<div class="row" style="margin-top: 1.5em;">
		<div v-if="loader.loading">
			<div class="col s1 offset-s6">
				<grid-loader :loading="loader.loading" :color="loader.color" :size="loader.size" />
			</div>
		</div>
		<div v-else>
			<div v-if="errorMessage" class="col s12 center-align">
				<p class="red-text">{{ errorMessage }}</p>
			</div>
			<form v-show="!auction.finished" v-on:submit.prevent="update(auction, auctionIndex)">
				<div class="row" style="margin-bottom: -.5em;">
					<div class="col s12 m9 ">
						<h5><i class="material-icons" style="vertical-align: -.2em; margin-right: .3em">gavel</i>{{ auction.title }}</h5>
					</div>
					<div class="col s4" style="margin-top: 1em;">
						<AppButton class="col s12" label="Finish" @click.prevent.native="finish(auction.id)"/>
					</div>
					<div v-show="!auction.favorite" class="col s4" style="margin-top: 1em;">
						<AppButton class="col s12" category="edit" label="edit" @click.prevent.native="editAuction" />
					</div>
					<div class="col s4" style="margin-top: 1em;">
						<AppButton class="col s12" category="delete" :label="auction.favorite ? 'Remove' : 'Delete'" @click.prevent.native="$modal.show('confirmDeleteAuctionModal')"/>
					</div>
					<hr class="col s12" style="margin-top: 2em;"/>
					<div class="col s12" style="margin-top: 1em;">
						<div class="switch">
							<label v-tooltip.top="'Show/hide wrong and right'">
								<span style="font-size: 1.3em;"><b>Hide</b></span>
								<input type="checkbox" v-model="showRightWrong">
								<span class="lever"></span>
								<span style="font-size: 1.3em;"><b>Show</b></span>
							</label>
						</div>	
					</div>
				</div>
				<AppModal 
					name="confirmDeleteAuctionModal"
					message="Do you really want to delete this auction?"
					confirmMessage="Delete"
					@cancel-click="$modal.hide('confirmDeleteAuctionModal')"
					@confirm-click="deleteAuction"
				/>
				
				<div class="row">
					<div class="col s12">
						<h5>Lots:</h5>
					</div>
					<div v-for="lot in auction.lots" :key="lot.id">
						<div class="row">
							<i v-if="!lot.active && !lot.pricePaid" class="material-icons col s1" style="font-size: 1.5em;">shopping_cart</i>
							<i v-if="lot.active && !lot.pricePaid" class="material-icons col s1" style="font-size: 1.5em;">add_shopping_cart</i>
							<i v-if="lot.pricePaid" class="material-icons col s1" style="font-size: 1.5em;">remove_shopping_cart</i>
							<span v-if="!lot.pricePaid" class="col s9 l6">
								<span 
									style="font-size: 1.3em"
									:class="[ showRightWrong ? [ lot.correct ? 'blue-text text-darken-4' : 'red-text text-darken-4' ] : '' ]">
										{{ lot.description }}
								</span>
							</span>
							<span v-else class="col s9" style="font-size: 1.3em">{{ lot.description }}</span>
						</div>

						<div class="row">
							<div class="col s4 m3" v-show="!lot.startingBid && !lot.pricePaid" >
								<input 
									v-model="startingBid[lot.id]" 
									class="col s12 browser-default starting-bid-input"
									placeholder="starting bid"
									type="number"
									min="0"
									step="any"
									style="margin-right: .5em;">
							</div>

							<div v-show="lot.startingBid && !lot.pricePaid" class="col s4">
								<span style="font-size: 1.2em">Starting bid: ${{ lot.startingBid }}</span>
							</div>
							<span 
								v-if="lot.pricePaid"
								class="col s12 browser-default"
								style="font-size: 1.2em;"
								>
									Sold to {{ lot.bids[lot.bids.length -1].playerName }} for ${{ lot.pricePaid }}
							</span>  
								
							<div v-if="!lot.active && !lot.pricePaid && !thereIsAnActiveLot" class="col s8 m6">
								<AppButton 
									class="col s12"
									label="Start lot"
									@click.prevent.native="startLot(lot)"
								/>
							</div>
							<div v-if="lot.active && !lot.pricePaid">
								<div class="col s4">
									<AppButton class="col s12" label="Open" @click.prevent.native="open()" />
								</div>
								<div class="col s4">
									<AppButton class="col s12" category="delete" label="Reset" @click.prevent.native="showResetLotModal(lot.id)"/>
								</div>
							</div>
						</div>
						<hr>
					</div>
					<AppModal 
						name="confirmResetLotModal"
						message="Do you really want to reset this lot? All bids made so far will be erased."
						confirmMessage="Reset"
						@cancel-click="$modal.hide('confirmResetLotModal')"
						@confirm-click="resetLot"
					/>
					<AppModal 
						name="thereIsAnOpenLotModal"
						message="There is an open lot. Do you want to open this lot and close the previous one?"
						confirmMessage="Open"
						@cancel-click="$modal.hide('thereIsAnOpenLotModal')"
						@confirm-click="resetAndOpenLot"
					/>
					
				</div>
			</form>
			<div v-if="auction.finished" style="margin-top: 2em;">
				<div v-show="auction.players.length" class="row">
					<h6>Final result</h6>
					<table class="col s12">
						<thead>
							<tr>
								<th>Group</th>
								<th>Player</th>
								<th>Score</th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="player in auction.players" :key="player.id">
								<td>
									<i class="inline-icon material-icons hide-on-small-only" style="margin-right: .3em;">group</i>{{ player.groupPlayer }}
								</td>
								<td>
									<span class="blue-text text-darken-4"><i class="inline-icon material-icons hide-on-small-only">person</i>{{ player.playerName }}</span>
								</td>
								<td>
									<span class="green-text text-darken-4"><i class="inline-icon material-icons hide-on-small-only" style="margin-right: .3em;">report</i>{{ player.score }}</span>
								</td>
							</tr>
						</tbody>
					</table>
				</div>
				<div v-show="auction.lots.length" class="row">
					<h6>Sold lots</h6>
					<table class="col s12">
						<thead>
							<tr>
								<th></th>
								<th>Description</th>
								<th>Price</th>
								<th>Player</th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="lot in auction.lots" :key="lot.id" v-bind:class="lot.correct ? 'blue-text text-darken-4' : 'red-text text-darken-4'">
								<td>
									<i v-if="lot.correct" class="inline-icon material-icons">done</i>
									<i v-else class="inline-icon material-icons">clear</i>
								</td>
								<td>
									<i class="inline-icon material-icons hide-on-med-and-down">label_outline</i>{{ lot.description }}
								</td>
								<td>
									<i class="inline-icon material-icons" style="margin-right: .2em;">monetization_on</i>{{ lot.pricePaid }}
								</td>
								<td>
									<span v-if="lot.bids.length"><i class="material-icons inline-icon hide-on-small-only">person</i>{{ lot.bids[lot.bids.length -1].playerName }}</span>
								</td>
							</tr>
						</tbody>
					</table>
				</div>
				<div class="row">
					<div class="col s7 offset-s3">
						<AppButton
							class="col s12"
							label="Reset auction"
							@click.prevent.native="$modal.show('confirmResetAuctionModal')"
						/>
					</div>
				</div>
				<AppModal 
					name="confirmResetAuctionModal"
					message="Do you really want to reset this auction? The final result will be erased."
					confirmMessage="Reset"
					@cancel-click="$modal.hide('confirmResetAuctionModal')"
					@confirm-click="resetAuction"
				/>
			</div>
		</div>
	</div>
</template>

<script>
import AppButton from './shared/AppButton.vue'
import AppModal from './shared/AppModal.vue'
import { mapGetters } from 'vuex'
import GridLoader from "vue-spinner/src/GridLoader.vue";

export default {
	name: 'auction',
	props: ['auctionId'],
	data() {
		return {
			auction: {},
			overrideLot: {},
			startingBid: [],
			thereIsAnActiveLot: null,
			resetLotId: null,
			errorMessage: '',
			showRightWrong: false,
			loader: {
				color: '#0d47a1',
				size: '12px',
				loading: false
			}
		}
	},
	components: {
		AppButton,
		AppModal,
		GridLoader
	},
	computed: {
		...mapGetters(['storedOpenAuctionId']),
		...mapGetters(['storedActiveLotForm']),
		...mapGetters(['storedAuctioneer'])
	},
	mounted() {
		this.loader.loading = true
		if(!this.auctionId && !this.storedOpenAuctionId) {
			this.errorMessage = 'There was a problem loading auction'
			this.loader.loading = false
		} else if(this.auctionId) {
			let auctionForm = this.buildAuctionForm()
			this.$http.post('/api/auction/', auctionForm)
			.then((response) => {
				this.auction = response.data
				this.loader.loading = false
			})
			.catch((error) => {
				console.log(error)
				this.loader.loading = false
				this.errorMessage = 'There was a problem loading auction'
			})			
		} else if(this.storedOpenAuctionId) {
			let auctionForm = this.buildAuctionForm()
			this.$http.post('/api/auction/', auctionForm)
			.then((response) => {
				this.auction = response.data
				this.loader.loading = false
				console.log(response.data)
			})
			.catch((error) => {
				console.log(error)
				this.loader.loading = false
				this.errorMessage = 'There was a problem loading auction'
			})			
		} else {
			this.errorMessage = 'There was a problem loading auction'
			this.loader.loading = false
		}
		
	},
	methods: {
		editAuction() {
			this.$store.commit('DEFINE_OPEN_AUCTION_ID', this.auction.id)
			this.$router.push({name: 'edit-auction', params: {auction: this.auction}})
		},
		startLot(lot) {
			if(this.storedActiveLotForm && this.storedActiveLotForm.lotId != lot.id) {
				this.$modal.show('thereIsAnOpenLotModal')
				this.overrideLot = lot
			} else {
				let activeLotForm = {
					lotId: lot.id,
					startingBid: this.startingBid[lot.id],
					auctioneerId: this.storedAuctioneer.id
				}
				this.$router.push({name: 'active-lot', params: { activeLotForm: activeLotForm }})
			}
		},
		open() {
			this.$router.push({name: 'active-lot' })
		},
		showResetLotModal(lotId) {
			this.resetLotId = lotId
			this.$modal.show('confirmResetLotModal')
		},
		resetLot() {
			this.$store.dispatch('resetActiveLotForm', this.resetLotId)
			.then((data) => {
				this.auction = data
				this.$store.commit('RESET_ACTIVE_LOT_FORM')
				this.$modal.hide('confirmResetLotModal')
			})
			.catch((error) => {
				console.log(error)
				this.errorMessage = 'There was a problem when trying to reset auction.'
			})
		},
		finish(auctionId) {
			let auctionForm = {
				auctionId: auctionId,
				auctioneerId: this.storedAuctioneer.id
			}
			this.$http.post('/api/auction/finish', auctionForm)
			.then((response) => {
				console.log(response)
				this.auction = response.data
				console.log(this.auction.players)
			})
			.catch((error) => {
				console.log(error)
				this.errorMessage = 'It wasn\'t possible to finish the auction'
			})
		},
		resetAuction() {
			this.$http.get('/api/auction/reset/' + this.auction.id)
			.then((response) => {
				console.log(response)
				this.auction = response.data
			})
			.catch((error) => {
				console.log(error)
				this.errorMessage = 'It wasn\'t possible to reset the auction'
			})
		},
		deleteAuction() {
			this.$http.post('/api/auction/delete', this.auction)
			.then(() => {
				this.$modal.hide('confirmDeleteAuctionModal')
				this.$router.push({name: 'auctioneer'})
			})
			.catch((error) => {
				console.log(error)
				this.errorMessage = 'There was a problem when removing the auction'
			})
		},
		resetAndOpenLot() {
			this.$store.dispatch('resetActiveLotForm', this.storedActiveLotForm.lotId)
			.then(() => {
				let activeLotForm = {
					lotId: this.overrideLot.id,
					auctioneerId: this.storedAuctioneer.id,
					startingBid: this.startingBid[this.overrideLot.id]
				}
				this.$router.push({name: 'active-lot', params: { activeLotForm: activeLotForm }})
			})
			.catch((error) => {
				console.log(error)

			})

		},
		buildAuctionForm() {
			if(this.auctionId) {
				return {
					auctioneerId: this.storedAuctioneer.id,
					auctionId: this.auctionId
				}
			} else {
				return {
					auctioneerId: this.storedAuctioneer.id,
					auctionId: this.storedOpenAuctionId
				}
			}
		},
	}
}
</script>

<style>
.starting-bid-input {
  height: 2.2em;
  border: 1.5px solid gray; 
  border-radius: 6px;
}

.inline-icon {
	/* vertical-align: ; */
	font-size: 1.5;
}

</style>