<template>
	<div id="signup" style="margin-top: 1em;">
		<div class="row">
			<h5 class="center-align col s12">Sign up with an e-mail account</h5>
		</div>
		<div v-if="errorMessage" class="col s12">
			<p class="red-text text-darken-4 center-align">{{ errorMessage }}</p>
		</div>
		<div v-if="message" class="col s12">
			<p class="green-text text-darken-4 center-align">{{ message }}</p>
		</div>			
		<form v-on:submit.prevent="signup">
			<div class="row center-align" style="margin-top: -1em;">
				<div class="input-field col s12 m10 l8 offset-m1 offset-l2">
					<i class="material-icons prefix">mail_outline</i>
					<input type="email" id="email-input" v-model="email">
					<label for="email-input">Email</label>
				</div>
				<div class="input-field col s12 m10 l8 offset-m1 offset-l2">
					<i class="material-icons prefix">mail_outline</i>
					<input type="email" id="repeat-email-input" v-model="emailConfirm">
					<label for="repeat-email-input">Confirm Email</label>
				</div>
				<div class="input-field col s12 m10 l8 offset-m1 offset-l2">
					<i class="material-icons prefix">lock_outline</i>
					<input type="password" id="password-input" v-model="password">
					<label for="password-input">Password</label>
				</div>
				<div class="input-field col s12 m10 l8 offset-m1 offset-l2">
					<i class="material-icons prefix">lock_outline</i>
					<input type="password" id="repeat-password-input" v-model="passwordConfirm">
					<label for="repeat-password-input">Confirm password</label>
				</div>
				<button 
					class="col s10 m8 l6 offset-s1 offset-m2 offset-l3 waves-effect waves-light btn-small button-activate blue darken-4"
					type="submit"
					:disabled="disableButton">
						Sign up
				</button>
				<div class="col s12" style="margin-top: 1.5em;">
					<router-link to="/sigin">Back to sign in</router-link>
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
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import OverlayLoading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';

export default {
name: 'signup',
	data() {
		return {
			email: null,
			emailConfirm: null,
			password: null,
			passwordConfirm: null,
			errorMessage: '',
			message: '',
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
		signup() {
			const auth = getAuth()
			this.disableButton = true
			this.overlay.isLoading = true

			this.message = ''
			if(!this.email) {
				this.errorMessage = 'You must inform a valid e-mail.'
				this.disableButton = false
				this.overlay.isLoading = false

			} else if(!this.emailConfirm) {
				this.errorMessage = 'You must confirm your e-mail.'
				this.disableButton = false
				this.overlay.isLoading = false
			} else if(!(this.email === this.emailConfirm)) {
				this.errorMessage = 'Emails are different.'
				this.disableButton = false
				this.overlay.isLoading = false
			} else if(!this.password) {
				this.errorMessage = 'You must input a password.'
				this.disableButton = false
				this.overlay.isLoading = false
			} else if(!this.passwordConfirm) {
				this.errorMessage = 'You must confirm your password'
				this.disableButton = false
				this.overlay.isLoading = false
			} else if(!(this.password === this.passwordConfirm)) {
				this.errorMessage = 'Passwords are different.'
				this.disableButton = false
				this.overlay.isLoading = false
			} else {
				createUserWithEmailAndPassword(auth, this.email, this.password)
				.then((userCredential) => {
					const user = userCredential.user
					sendEmailVerification(user)
					.then(() => {
						this.message = 'An e-mail has been sent to ' + this.email + '. Check your inbox to complete registration.'
						this.disableButton = false
						this.overlay.isLoading = false
						this.errorMessage = ''
						this.email = null
						this.emailConfirm = null
						this.password = null
						this.passwordConfirm = null
					})
					.catch((error) => {
						console.log(error)
						this.errorMessage = 'There was an error trying to sign up. Please try again.'
					})
				})
				.catch((error) => {
					console.log(error)
					if(error.code === 'auth/weak-password') {
						console.log(error)
						this.errorMessage = 'Password should be at least 6 characters.'
						this.disableButton = false
						this.overlay.isLoading = false
					}
					if(error.code === 'auth/email-already-in-use') {
						console.log(error)
						this.errorMessage = 'This e-mail has already been registered.'
						this.disableButton = false
						this.overlay.isLoading = false
					}
					this.disableButton = false
					this.overlay.isLoading = false
				})
			}
		},
	}
}
</script>

<style scoped>

</style>
