<template>
	<div id="forgot-password">
		<div class="row">
			<h4 class="center-align col s12">Recover Password</h4>      
		</div>
		<div v-if="errorMessage" class="col s12">
			<p class="red-text text-darken-4 center-align">{{ errorMessage }}</p>
		</div>
		<div v-if="message" class="col s12">
			<p class="green-text text-darken-4 center-align">{{ message }}</p>
		</div>
		<form v-on:submit.prevent='send'>
			<div class="row center-align">
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
				<div class="col s1">
					<grid-loader :loading="loader.loading" :color="loader.color" :size="loader.size" />
				</div>
				<div class="col s12" style="margin-top: 1.5em;">
					<router-link to="/signin">Back to sign in</router-link>
				</div>
			</div>
		</form>
	</div>
</template>

<script>
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import GridLoader from "vue-spinner/src/GridLoader.vue";

export default {
	name: 'forgot-password',
	data() {
		return {
			email: null,
			message: '',
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
		GridLoader
	},
	methods: {
		send() {
			this.disableButton = true
			this.loader.loading = true
			if(!this.email) {
				this.message = ''
				this.errorMessage = 'You must insert an e-mail.'
				this.disableButton = false
				this.loader.loading = false
			} else {
				const auth = getAuth();
				sendPasswordResetEmail(auth, this.email)
				.then(() => {
					this.message = 'An e-mail has been sent to ' + this.email + '. Check your inbox to reset your password.'
					this.disableButton = false
					this.loader.loading = false
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
					this.loader.loading = false
				})	
			}
		}
	}
}
</script>

<style scoped>

</style>