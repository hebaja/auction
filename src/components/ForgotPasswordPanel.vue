<template>
	<div id="forgot-password" style="margin-top: 1em;">
		<div class="row">
			<h5 class="center-align col s12">Recover password</h5>
		</div>
		<div v-if="errorMessage" class="col s12">
			<p class="red-text text-darken-4 center-align">{{ errorMessage }}</p>
		</div>
		<div v-if="message" class="col s12">
			<p class="green-text text-darken-4 center-align">{{ message }}</p>
		</div>
		<form v-on:submit.prevent='send'>
			<div class="row center-align" style="margin-top: -1em;">
				<div class="input-field col col s12 m10 l8 offset-m1 offset-l2">
					<i class="material-icons prefix">email</i>
					<input id="email-input" type="email" v-model="email">
					<label for="email-input">Input your e-mail</label>
				</div>
				<button 
					class="col s10 m8 l6 offset-s1 offset-m2 offset-l3 waves-effect btn btn-small waves-light blue darken-4" 
					type="submit"
					:disabled="disableButton">
						Recover password
				</button>
				<div class="col s12" style="margin-top: 1.5em;">
					<router-link to="/signin">Back to sign in</router-link>
				</div>
			</div>
		</form>
		<OverlayLoading :active="overlay.isLoading"
			:can-cancel="false"
			:is-full-page="overlay.fullPage"
			:color="overlay.color"
			:loader="overlay.loader"/>
	</div>
</template>

<script>
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import OverlayLoading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';

export default {
	name: 'forgot-password',
	data() {
		return {
			email: null,
			message: '',
			errorMessage: '',
			disableButton: false,
			overlay: {
				isLoading: false,
				fullPage: true,
				color: '#0d47a1',
				loader: 'dots'
			}
		}
	},
	components: {
		OverlayLoading
	},
	methods: {
		send() {
			this.disableButton = true
			this.overlay.isLoading = true
			if(!this.email) {
				this.message = ''
				this.errorMessage = 'You must insert an e-mail.'
				this.disableButton = false
				this.overlay.isLoading = false
			} else {
				const auth = getAuth();
				sendPasswordResetEmail(auth, this.email)
				.then(() => {
					this.message = 'An e-mail has been sent to ' + this.email + '. Check your inbox to reset your password.'
					this.disableButton = false
					this.overlay.isLoading = false
					this.errorMessage = ''
					this.email = null
				})
				.catch(error => {
					console.log(error)
					this.message = ''
					if(error.code === 'auth/invalid-email') {
						this.errorMessage = 'Invalid e-mail.'
					} else if(error.code === 'auth/user-not-found')
						this.errorMessage = 'This e-mail has not been registered yet.'
					else {
						this.errorMessage = 'There was an error.'
					}
					this.disableButton = false
					this.overlay.isLoading = false
				})	
			}
		}
	}
}
</script>

<style scoped>

</style>