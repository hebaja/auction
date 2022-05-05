<template>
	<div class="row" style="margin-top: 1em;">
		<div v-if="loader.loading">
			<div class="col s1 offset-s6">
				<grid-loader :loading="loader.loading" :color="loader.color" :size="loader.size" />
			</div>
		</div>
		<div v-if="errorMessage" class="col s12">
			<p class="red-text center-align">{{ errorMessage }}</p>
		</div>
		<h4 class="col s12 align-center">{{ auction.title }}</h4>
		<div class="col s12">
			<ul class="collection with-header">
				<li class="collection-header"><h4>Lots</h4></li>
				<li v-for="lot in auction.lots" :key="lot.id" class="collection-item">
					<b class="blue-text text-darken-4">
							{{ lot.description }}
					</b>
				</li>
			</ul>
		</div>

		<div v-show="storedAuctioneer.id != auction.auctioneerId" class="col s7 m5">
			<app-button 
				class="col s12"
				label="Add to my favorites"
				:disabled="disabledButton"
				@click.prevent.native="addToFavorites">
					&nbsp;<i class="white-text material-icons secondary-content">star</i>
			</app-button>
		</div>
		<div class="col s1">
			<grid-loader :loading="buttonLoader.loading" :color="buttonLoader.color" :size="buttonLoader.size" />
		</div>

	</div>
</template>

<script>
import AppButton from './shared/AppButton.vue'
import { mapGetters } from 'vuex'
import GridLoader from "vue-spinner/src/GridLoader.vue";

export default {
	name: 'auction-read',
	props: ['auctionId'],
	components: {
		AppButton,
		GridLoader
	},
	computed: {
		...mapGetters(['storedAuctioneer'])
	},
	data() {
		return {
			auction: '',
			disabledButton: false,
			errorMessage : '',
			loader: {
				color: '#0d47a1',
				size: '12px',
				loading: true
			},
			buttonLoader: {
				color: '#0d47a1',
				size: '7px',
				loading: false
			},
		}
	},
	mounted() {
		if(this.auctionId) {
			let auctionForm = {
				auctionId: this.auctionId,
				auctioneerId: this.storedAuctioneer.id
			}
			this.loader.loading = true
			this.$http.post('/api/auction/', auctionForm)
			.then((response) => {
				this.auction = response.data
				this.loader.loading = false
			})
			.catch((error) => {
				console.log(error)
				this.loader.loading = false
			})		
		} else {
			this.$router.push({name: 'index'})
		}
	},
	methods: {
		addToFavorites() {
			let auctionForm = {
				auctionId: this.auctionId,
				auctioneerId: this.storedAuctioneer.id
			}
			this.disabledButton = true
			this.buttonLoader.loading = true

			this.$http.post('/api/auction/add-favorite', auctionForm)
			.then(() => {
				this.$router.push({name: 'auctioneer'})
				this.disabledButton = false
				this.buttonLoader.loading = false
			})
			.catch((error) => {
				console.log(error)
				if(error.response) {
					if (error.response.status === 409) {
						this.$notice['warning']({
							title: 'Attention',
							description: 'This auction has already beed added to your favorites',
							duration: 6
						})
						
					}
				} else {
					this.errorMessage = 'There was an error loading the auction'
				}
				this.disabledButton = false
				this.buttonLoader.loading = false
			})
		}
	}
}
</script>

<style>

</style>