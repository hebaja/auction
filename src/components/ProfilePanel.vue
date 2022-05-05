<template>
	<div id="profile" class="row" style="margin-top: 2em;">
		<div v-if="errorMessage" class="col s12">
			<p class="red-text center-align">{{ errorMessage }}</p>
		</div>
		<div class="col s12 center-align">
			<img :src="[auctioneer.pictureUrl ? auctioneer.pictureUrl : '/images/logo.svg']" alt="user profile picture" class="circle">
		</div>
		<div class="col s12">
			<p class="center-align"><b>{{ auctioneer.name }}</b></p>
		</div>
		<div class="col s12">
			<p class="center-align"><b>{{ auctioneer.email }}</b></p>
		</div>
		<div class="col s12 center-align" style="margin-top: 2em;">
			<a class="red-text" href="#" @click="$modal.show('openDeleteAccountModal')">Delete my account</a>
		</div>
		<AppModal 
			name="openDeleteAccountModal"
			message="Do you really want to delete your account?"
			confirmMessage="Delete"
			@cancel-click="$modal.hide('openDeleteAccountModal')"
			@confirm-click="$modal.hide('openDeleteAccountModal'); $modal.show('confirmDeleteAccountModal')"
		/>
		<AppModal 
			name="confirmDeleteAccountModal"
			message="You will lose all your data. This cannot be undone."
			confirmMessage="Delete my account"
			@cancel-click="$modal.hide('confirmDeleteAccountModal')"
			@confirm-click="deleteAccount"
		/>
	</div>
</template>

<script>
import { mapGetters } from 'vuex'
import AppModal from './shared/AppModal.vue'
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";

export default {
	name: 'profile',
	data() {
		return {
			auctioneer: '',
			errorMessage: ''
		}
	},
	components: {
		AppModal
	},
	computed: {
		...mapGetters(['storedAuctioneer']),
	},
	mounted() {
		this.$http.get('/api/auctioneer/' + this.storedAuctioneer.id)
		.then((response) => this.auctioneer = response.data)
		.catch((error) => {
			console.log(error)
			console.log(error.response)
			console.log(error.code)
			this.errorMessage = 'It was not possible to load profile data'
		})
	},
	methods: {
		deleteAccount() {
			const auth = getAuth();
			onAuthStateChanged(auth, (user) => {
				if (user) {
					let deleteAuctioneerForm = {
						id: this.auctioneer.id,
						uid: user.uid
					}
					this.$http.post('/api/auctioneer/delete', deleteAuctioneerForm)
					.then(response => {
						if(response.status == 200) {
							this.signout()
							document.location.reload(true)
						} else {
							console.log('unexpected response status ' + response.status)
						}
						this.$modal.hide('confirmDeleteAccountModal')
					})
					.catch((error) => {
						console.log(error)
						if(error == 'Error: Request failed with status code 400') {
							this.errors.push('There was a problem when trying to delete user.')
						}
						if(error == 'Error: Network Error') {
							this.errors.push('Could not connect to server. Please check your internet connection.')
						}
						this.$modal.hide('confirmDeleteAccountModal')
					})
				} else {
					console.log('no user')
					this.errorMessage = 'It was not possible to delete your account. Please try again.'
					this.$modal.hide('confirmDeleteAccountModal')
				}
			})
		},
		signout() {
			const auth = getAuth()
			signOut(auth).then(() => this.$store.commit('SIGN_OUT_AUCTIONEER')).catch((error) => console.log(error))
		}
	}
	
}
</script>

<style>

</style>