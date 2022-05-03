<template>
	<div class="row">
	<form class="col s12 center" v-on:submit.prevent="save">
		<div class="row">
			<div v-if="errorMessage" class="col s12">
				<p class="red-text">{{ errorMessage }}</p>
			</div>
			<div class="input-field col s12">
				<i class="material-icons prefix" :class="{ 'icon-input-field-fail-error' : $v.auction.title.$error}">gavel</i>
				<input
					v-model.lazy="$v.auction.title.$model"
					type="text"
					placeholder="Input title of auction"
					:class="{ 'input-field-fail-error' : $v.auction.title.$error}"
					@change="$v.auction.title.$touch()" />
				<span v-if="$v.auction.title.$error" class="red-text helper-text left-align">This field is required</span>
			</div>
			<div class="col s4 offset-s3" style="margin-top: .5em;">
				<div class="switch">
					<label>
						<span style="font-size: 1.3em;"><b>Private</b></span>
						<input type="checkbox" v-model="auction.publicAuction">
						<span class="lever"></span>
						<span style="font-size: 1.3em;"><b>Public</b></span>
					</label>
				</div>	
			</div>
			<div class="col s1" style="margin-bottom: 1.2em;">
				<button class="btn-floating waves-effect waves-light blue darken-4" @click.prevent="addLot" v-tooltip.top="'Add a lot to the auction'">
					<i class="material-icons">add</i>
				</button>
			</div>
			<div v-for="(lot, index) in auction.lots" :key="lot.id">
				<div class="input-field col s9" style="margin-top: -.5em;">
					<i class="material-icons prefix" :class="{ 'icon-input-field-fail-error' : $v.auction.lots.$each[index].description.$error}">shopping_cart</i>
					<input
						v-model.lazy="$v.auction.lots.$each[index].description.$model"
						type="text"
						placeholder="Input sentence of lot"
						:class="{ 'input-field-fail-error' : $v.auction.lots.$each[index].description.$error }"
						@change="$v.auction.lots.$each[index].description.$touch()"/>
						<span v-if="$v.auction.lots.$each[index].description.$error" class="red-text helper-text left-align">This field is required</span>
				</div>
				<div class="col s2" style="margin-top: 1em;">
					<div class="switch" v-tooltip.top="'Is it right?'">
						<label>
						<input type="checkbox" v-model="lot.correct">
						<span class="lever"></span>
						<span style="margin-left: -.7em">right</span>
						</label>
					</div>
				</div>
				<div class="col s1" style="margin-top: 1em;">
					<a v-tooltip.top="'Remove this lot from the auction'" href="#" @click.prevent="remove(index)">
						<i class="red-text text-darken-4 material-icons">delete</i>
					</a>
				</div>
			</div>
		</div>
		<div class="row">
			<button 
				class="col s10 m8 l6 offset-s1 offset-m2 offset-l3 waves-effect waves-light btn-small button-activate blue darken-4" 
				type="submit"
				:disabled="disableButton">
					Save
			</button> 
			<div class="col s1">
				<grid-loader :loading="loader.loading" :color="loader.color" :size="loader.size" />
			</div>	
		</div>
	</form>
	</div>
</template>

<script>
import { mapGetters } from 'vuex'
import { required } from 'vuelidate/lib/validators'
import GridLoader from "vue-spinner/src/GridLoader.vue";

export default {
	name: 'edit-auction',
	props: ['receivedAuction'],
	data() {
		return {
			auction: {},
			errorMessage: '',
			disableButton: false,
			loader: {
				color: '#0d47a1',
				size: '7px',
				loading: false
			}
		}
	},
	components: {
		GridLoader,
	},
	computed: {
		...mapGetters(['storedEditAuction']),
		...mapGetters(['storedAuctioneer'])
	},
	validations() {
		return {
			auction: {
				title: {required},
				lots: {
					$each: {
						description: {required}
					}
				}
			}
		}
	},
	mounted() {
		if(!this.receivedAuction && !this.storedEditAuction) {
			console.log('here')
			this.errorMessage = 'There was a problem loading the auction'
		} else if(this.receivedAuction) {
			this.auction = this.receivedAuction
			console.log(this.auction)
		} else if(this.storedEditAuction) {
			this.auction = this.storedEditAuction
			console.log(this.auction)
		}
	},
	methods: {
		save() {
			if(!this.$v.$invalid) {
				this.loader.loading = true
				this.disableButton = true

				if(this.auction.id) {
					this.update()
				} else {
					this.register()
				}
				console.log(this.auction)
			} else {
				this.$v.$touch()
			}
		},
		update() {
			this.$http.put('/api/auction', this.auction)
			.then(() => {
				this.loader.loading = false
				this.disableButton = false
				this.$store.commit('RESET_EDIT_AUCTION')
				this.$router.push({name: 'auctioneer'})
			})
			.catch((error) => {
				console.log(error)
				this.loader.loading = false
				this.disableButton = false
				this.errorMessage = 'There was a problem when trying to save auction'
			})
		},
		register() {
			console.log(this.auction)
			let registerForm = {
				auctioneerId: this.storedAuctioneer.id,
				title: this.auction.title,
				lots: this.auction.lots,
				publicAuction: this.auction.publicAuction
			}
			this.$http.post('/api/auction/register', registerForm)
			.then(() => {
				this.loader.loading = false
				this.disableButton = false
				this.$store.commit('RESET_EDIT_AUCTION')
				this.$router.push({name: 'auctioneer'})
			})
			.catch((error) => {
				console.log(error)
				this.loader.loading = false
				this.disableButton = false
				this.errorMessage = 'There was a problem when trying to save auction'
			}) 
		},
		remove(index) {
			if(this.auction.lots.length > 1) {
				this.auction.lots.splice(index, 1)
			} else {
				this.$notice['error']({
					title: 'Attention',
					description: 'An auction must have a lot at least'
				})
			}
		},
		addLot() {
			if(this.auction.lots.length < 10) {
				this.auction.lots.push({description: '', correct: false})
			} else {
				this.$notice['error']({
					title: 'Attention',
					description: 'An auction cannot have more than 10 lots'
				})
			}
		}
	}
}
</script>

<style scoped>

</style>