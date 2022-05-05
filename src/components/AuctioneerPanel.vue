<template>
	<div id="auctioneer">
		<div class="row" style="margin-top: 1em;">
			<div v-if="errorMessage" class="col s12">
				<p class="red-text center-align">{{ errorMessage }}</p>
			</div>
			<Tabs>
				<Tab title="My auctions">
					<div id="auctions" class="auctioneer-collections col s12">
						<ul class="collection with-header">
							<li class="collection-header"><h5>Auctions</h5></li>
							<li 
								v-for="auction in auctioneer.auctions" 
								:key="auction.id"
								class="blue-text text-darken-4 collection-item">
									<a href="" @click.prevent="openAuction(auction)">
										<b>{{ auction.title }}</b> 
									</a>
									<a href="#" class="auctioneer-collections-link secondary-content"
										v-tooltip.top="'Remove this auction'"
										@click.prevent="showDeleteAuctionModal(auction)">
										<i class="red-text text-darken-4 material-icons">delete</i>
									</a>
									<a href="#" class="auctioneer-collections-link secondary-content"
										v-tooltip.top="'Edit this auction'"
										@click.prevent="editAuction(auction)">
											<i class="yellow-text text-darken-4 material-icons secondary-content">edit</i>
									</a>
									<a href=""
										class="auctioneer-collections-link secondary-content" 
										v-tooltip.top="'Open this auction'"
										@click.prevent="openAuction(auction)">
											<i class="blue-text text-darken-4 material-icons secondary-content">gavel</i>
									</a>
									<span v-if="auction.finished" class="secondary-content" v-tooltip.top="'This auction is finished'">
										<i class="grey-text text-darken-1 material-icons">done_all</i>
									</span>
									<span v-if="auction.openLot" class="secondary-content" v-tooltip.top="'There is an open lot'">
										<i class="grey-text text-darken-1 material-icons">warning</i>
									</span>
							</li>
							<AppModal 
								name="confirmDeleteAuctionModal"
								message="Do you really want to remove this auction?"
								confirmMessage="Delete"
								@cancel-click="$modal.hide('confirmDeleteAuctionModal')"
								@confirm-click="removeAuction"
							/>
						</ul>
					</div>
				</Tab>
				<Tab title="My favorites">
					<div class="auctioneer-collections col s12">
						<ul class="collection with-header">
							<li class="collection-header"><h5>Favorites</h5></li>
							<li 
								v-for="auction in auctioneer.favoriteAuctions" 
								:key="auction.id"
								class="blue-text text-darken-4 collection-item">
									<a href="" @click.prevent="openAuction(auction)">
										<b>{{ auction.title }}</b> 
									</a>
									<a href="#" class="auctioneer-collections-link secondary-content"
										v-tooltip.top="'Remove from favorites'"
										@click.prevent="confirmRemoveFavoriteModal(auction)">
										<i class="red-text text-darken-4 material-icons">highlight_off</i>
									</a>
									<a href=""
										class="auctioneer-collections-link secondary-content" 
										v-tooltip.top="'Open this auction'"
										@click.prevent="openAuction(auction)">
											<i class="blue-text text-darken-4 material-icons secondary-content">gavel</i>
									</a>
									<span v-if="auction.finished" class="secondary-content" v-tooltip.top="'This auction is finished'">
										<i class="grey-text text-darken-1 material-icons">done_all</i>
									</span>
									<span v-if="auction.openLot" class="secondary-content" v-tooltip.top="'There is an open lot'">
										<i class="grey-text text-darken-1 material-icons">warning</i>
									</span>
							</li>
							<AppModal 
								name="confirmRemoveFavoriteModal"
								message="Do you really want to unfavorite this auction?"
								confirmMessage="Unfavorite"
								@cancel-click="$modal.hide('confirmRemoveFavoriteModal')"
								@confirm-click="removeFavorite"
							/>
						</ul>
					</div>
				</Tab>
			</Tabs>

			<div class="col s7 m5" style="margin-top: -2em; margin-bottom: 2em;">
				<app-button 
					class="col s12"
					label="Add an auction"
					@click.prevent.native="registerAuction">
						&nbsp;<i class="white-text material-icons secondary-content">add_circle</i>
				</app-button>
			</div>
			<div class="auctioneer-collections col s12">
				<ul class="collection with-header">
					<li class="collection-header"><h5>Group of players</h5></li>
					<li 
						v-for="group in auctioneer.groupPlayers" 
						:key="group.id"
						class="blue-text text-darken-4 collection-item">
						<a href="" @click.prevent="openGroup(group)">
							<b>{{ group.name }}</b>
						</a>
						<a href="#" class="auctioneer-collections-link secondary-content"
							v-tooltip.top="'Remove this group'"
							@click.prevent="showDeleteGroupModal(group.id)">
							<i class="red-text text-darken-4 material-icons">delete</i>
						</a>
						<a href="#" class="auctioneer-collections-link secondary-content"
						v-tooltip.top="'Edit this group'"
							@click.prevent="openGroup(group)">
								<i class="yellow-text text-darken-4 material-icons secondary-content">edit</i>
						</a>
						<a href="#" class="auctioneer-collections-link secondary-content"
							@click.prevent="changeGroupState(group)">
								<i v-if="group.active" v-tooltip.top="'Deactivate this group'" class="blue-text text-darken-4 material-icons">flash_on</i>
								<i v-else v-tooltip.top="'Activate this group'" class="grey-text text-darken-1 material-icons">flash_off</i>
						</a>
						<a v-if="group.active" href="#" class="auctioneer-collections-link secondary-content"
							@click.prevent="openPlayersLinksModal(group.players)">
								<i v-if="group.active" v-tooltip.top="'Get players\' links'" class="blue-text text-darken-4 material-icons">link</i>
						</a>
					</li>
					<AppModal 
						name="confirmDeleteGroupModal"
						message="Do you really want to remove this group?"
						confirmMessage="Delete"
						@cancel-click="$modal.hide('confirmDeleteGroupModal')"
						@confirm-click="removeGroup"
					/>
					<AppModal
						message="Players' links"
						name="playersLinksModal"
						oneButtonFooter="true"
						@cancel-click="$modal.hide('playersLinksModal')"
					>
						<div class="row">
							<div class="col s12 center-align" >
								<a 
									class="blue-text text-darken-4"
									href=""
									@click.prevent="copyAllPlayersLinks">
										<p style="font-size: 1.2em;">
											<b>Copy all links</b>
										</p>
									</a>
							</div>
							<div v-for="player in players" :key="player.id">
								<div class="col s12 center-align">
									<span><b>{{ player.playerName }}:&nbsp;&nbsp;&nbsp;</b></span>
									<span>{{ apiBaseUrl }}/#/player?playerId={{ player.id }}</span>&nbsp;&nbsp;
									<a class="blue-text text-darken-4" href="" @click.prevent="copyPlayerLink(player)" style="margin-left: .5em;"><b>copy</b></a>
								</div>
							</div>
						</div>
					</AppModal>
				</ul>
			</div>
			<div class="col s7 m5" style="margin-top: -.5em;">
				<app-button 
					class="col s12" 
					label="Add a group" 
					@click.prevent.native="registerGroup()">
						&nbsp;<i class="white-text material-icons secondary-content">add_circle</i>
				</app-button>
			</div>
		</div>
		<OverlayLoading :active="overlay.isLoading"
			:can-cancel="false"
			:is-full-page="overlay.fullPage"
			:color="overlay.color"
			:loader="overlay.loader"/>
	</div>
</template>

<script>
import { mapGetters } from 'vuex'
import AppButton from './shared/AppButton.vue'
import AppModal from './shared/AppModal.vue'
import Tab from './shared/Tab.vue'
import Tabs from './shared/Tabs.vue'
import OverlayLoading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';

export default {
	name: 'auctioneer',
    data() {
		return {
			auctioneer: null,
			auctionToBeRemovedId: null,
			groupToBeRemoved: null,
			favoriteAuctionToBeRemoved: null,
			players: {},
			startingBid: [],
			errors: [],
			errorMessage: '',
			overlay: {
				isLoading: false,
				fullPage: true,
				color: '#0d47a1',
				loader: 'dots'
			}
		}
    },
    components: {
		AppButton,
		AppModal,
		OverlayLoading,
		Tab,
		Tabs
    },
    props: ['groupActiveArray', 'accessToken'],
    created() {
		this.auctioneer = this.storedAuctioneer
		this.$http.get('/api/auctioneer/auctions/' + this.auctioneer.id)
		.then((response) => {
			this.auctioneer = response.data
			console.log(response.data)
		})
		.catch((error) => {
			console.log(error)
			this.$store.commit('SIGN_OUT_AUCTIONEER')
			this.$router.push('/signin');
		})
	},

	computed: {
		...mapGetters(['storedAuctioneer']),
		apiBaseUrl() {
			return process.env.VUE_APP_DEFAULT_BASE_URL
		}
    },
	methods: {
		openAuction(receivedAuction) {
			this.$store.commit('DEFINE_OPEN_AUCTION_ID', receivedAuction.id)
			this.$router.push({ name: 'auction', params: { auctionId: receivedAuction.id } })
		},
		editAuction(receivedAuction) {
			this.$store.commit('DEFINE_EDIT_AUCTION', receivedAuction)
			this.$router.push({ name: 'edit-auction', params: { auction: receivedAuction } })
		},
		openGroup(receivedGroup) {
			this.$store.commit('DEFINE_EDIT_GROUP', receivedGroup)
			this.$router.push({ name: 'edit-group', params: { group: receivedGroup } })
		},
		registerAuction() {
			this.$store.commit('RESET_EDIT_AUCTION')
			
			let lots = []
			lots.push({description: '', correct: false})

			let auction = {
				title: '',
				finished: false,
				lots: lots,
				publicAuction: false
			}
			this.$store.commit('DEFINE_EDIT_AUCTION', auction)
			this.$router.push({name: 'edit-auction', params: {auction: auction}})
		},
		registerGroup() {
			this.$store.commit('RESET_EDIT_GROUP')
			
			let players = []
			players.push({playerName: '', walletValue: '0'})

			let group = {
				name: '',
				active: false,
				players: players
			}
			this.$store.commit('DEFINE_EDIT_GROUP', group)
			this.$router.push({name: 'edit-group', params: {group: group}})
		},
		removeAuction() {
			this.overlay.isLoading = true
			this.$modal.hide('confirmDeleteAuctionModal')
			if(this.auctionToBeRemoved != null) {
				this.$http.post('/api/auction/delete', this.auctionToBeRemoved)
				.then((response) => {
					this.auctioneer = response.data
					this.auctionToBeRemoved = null
					this.overlay.isLoading = false
				})
				.catch((error) => {
					console.log(error)
					this.errorMessage = 'There was a problem when removing the auction'
					this.overlay.isLoading = false
				})
			} else {
				this.errorMessage = 'There was a problem when removing the auction'
				this.overlay.isLoading = false
			}
		},
		removeFavorite() {
			this.overlay.isLoading = true
			this.$modal.hide('confirmRemoveFavoriteModal')
			if(this.favoriteAuctionToBeRemoved != null) {
				let auctionForm = {
					auctionId: this.favoriteAuctionToBeRemoved.id,
					auctioneerId: this.storedAuctioneer.id
				}
				this.$http.post('/api/auction/remove-favorite', auctionForm)
				.then((response) => {
					this.auctioneer = response.data
					this.favoriteAuctionToBeRemoved = null
					this.overlay.isLoading = false
				})
				.catch((error) => {
					console.log(error)
					if(error.response) {
						this.$notice['warning']({
							title: 'Attention',
							description: 'This auction has already beed removed from your favorites',
							duration: 6
						})
					} else {
						this.errorMessage = 'There was an error removing the auction from favorites'
					}
					this.overlay.isLoading = false
				})
			} else {
				this.errorMessage = 'There was a problem when removing the auction from favorites'
				this.overlay.isLoading = false
			}
		},
		removeGroup() {
			let removeGroup = {
				auctioneerId: this.auctioneer.id,
				groupPlayerId: this.groupToBeRemovedId,
			}
			this.overlay.isLoading = true
			this.$modal.hide('confirmDeleteGroupModal')
			this.$http.post('/api/group-player/delete', removeGroup)
			.then((response) => {
				this.auctioneer = response.data
				this.groupToBeRemovedId = null
				this.overlay.isLoading = false
			})
			.catch((error) => {
				console.log(error)
				this.errorMessage = 'There was a problem when removing the group'
				this.overlay.isLoading = false
			})
		},
		changeGroupState(group) {
			if(group != null) {
				let groupChange = {
					auctioneerId: this.auctioneer.id,
					groupPlayerId: group.id,
					groupActive: group.active
				}
				this.overlay.isLoading = true
				this.$http.post('/api/group-player/change-state', groupChange)
				.then((respone) => {
					this.auctioneer = respone.data
					this.overlay.isLoading = false
				})
				.catch((error) => {
					console.log(error)
					this.overlay.isLoading = false
					this.errorMessage = 'There was a problem when trying to change group state'
				})
			} else {
				this.errorMessage = 'There was a problem when trying to change group state'
			}
		},
		showDeleteAuctionModal(auction) {
			this.auctionToBeRemoved = auction
            this.$modal.show('confirmDeleteAuctionModal')
        },
		confirmRemoveFavoriteModal(auction) {
			this.favoriteAuctionToBeRemoved = auction
			this.$modal.show('confirmRemoveFavoriteModal')
		},
		showDeleteGroupModal(groupId) {
			this.groupToBeRemovedId = groupId
			this.$modal.show('confirmDeleteGroupModal')
		},
		openPlayersLinksModal(players) {
			this.players = players
			this.$modal.show('playersLinksModal')
		},
		copyPlayerLink: function (player) {
			navigator.clipboard.writeText(process.env.VUE_APP_DEFAULT_BASE_URL + '/#/player?playerId=' + player.id);
			this.$notice['success']({
				title: 'Success',
				description: player.playerName + '\'s link was successfully copied'
			})
		},
		copyAllPlayersLinks() {
			var listOfLinks = []
			this.players.forEach(player => {
				listOfLinks.push(`${player.playerName}: ${process.env.VUE_APP_DEFAULT_BASE_URL}/#/player?playerId=${player.id}`)
			})
			navigator.clipboard.writeText(listOfLinks.join('\r\n'))
			this.$notice['success']({
				title: 'Success',
				description: 'All links have been copied'
			})
			this.$modal.hide('playersLinksModal')
		},
		hideModal() {
            this.$modal.hide('modal');
        },
	}
}

</script>

<style scoped>

.auctioneer-collections-link {
	margin-left: .5em;
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