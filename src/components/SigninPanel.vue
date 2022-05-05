<template>
	<div id="signin">
		<div class="row" style="margin-top: 2em;">
			
			<div class="row">
				<div class="col s10 m8 offset-s1 offset-m2"
					@mouseover="mouseOverButton('google')" 
					@mouseleave="mouseLeaveButton('google')">
					<gb-social-button
						network="google"
						theme="dark"
						size="medium"
						:full-width="true"
						:loading="googleButton.loading"
						:disabled="googleButton.disabled"
						:iconTheme="googleButton.iconTheme"
						:class="googleButton.background"
						@click="googleSignIn">
							Continue with Google
					</gb-social-button>
				</div>
				<div class="col s10 m8 offset-s1 offset-m2"
					style="margin-top: .5em;"
					@mouseover="mouseOverButton('facebook')" 
					@mouseleave="mouseLeaveButton('facebook')">
					<gb-social-button
						network="facebook"
						theme="dark"
						size="medium"
						:full-width="true"
						:loading="facebookButton.loading"
						:disabled="facebookButton.disabled"
						:iconTheme="facebookButton.iconTheme"
						:class="facebookButton.background"
						@click="facebookSignin">
							Continue with Facebook
					</gb-social-button>
				</div>
			</div>
			<hr class="col s10 m8 offset-s1 offset-m2"/>
			<div v-show="errorMessage" class="center-align col s12">
				<p class="red-text">{{ errorMessage }}</p> 
			</div>
			<div v-show="message" class="center-align col s12">
				<p class="green-text">{{ message }}</p> 
			</div>
			<h5 class="center-align col s12" v-show="!auctioneerId">Sign in with e-mail</h5>
			<form v-on:submit.prevent="signin">
				<div class="row center-align">
					<div class="input-field col s12 m10 l8 offset-m1 offset-l2">
						<i class="material-icons prefix">mail_outline</i>
						<input type="email" id="autocomplete-email-input" class="autocomplete" v-model="email">
						<label for="autocomplete-email-input">Email</label>
					</div>
					<div class="input-field col s12 m10 l8 offset-m1 offset-l2">
						<i class="material-icons prefix">lock_outline</i>
						<input type="password" id="password-input" v-model="password">
						<label for="password-input">Password</label>
					</div>
					<button 
						class="col s10 m8 l6 offset-s1 offset-m2 offset-l3 waves-effect waves-light btn-small button-activate blue darken-4"
						type="submit"
						:disabled="disableButton">
							Sign in
					</button>
					<div class="col s12" style="margin-top: 1.5em;">
						<router-link to="/signup" style="margin-top: 1em;">Sing up with e-mail</router-link>
					</div>
					<div class="col s12" style="margin-top: 1em;"> 
						<router-link to="/forgot-password" style="margin-top: 1em;">Forgot password?</router-link>
					</div>
				</div>
			</form>
		</div>
		<OverlayLoading :active="overlay.isLoading"
			:can-cancel="false"
			:is-full-page="overlay.fullPage"
			:color="overlay.color"
			:loader="overlay.loader"/>
	</div>
</template>

<script>
import { getAuth,
		signInWithEmailAndPassword,
		signInWithPopup,
		GoogleAuthProvider,
		FacebookAuthProvider,
		signOut } 
	from "firebase/auth"
import OverlayLoading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';

export default {
	name: 'signin',
	data () {
		return {
			color: 'color',
			email: null,
			password: null,
			message: '',
			errorMessage: null,
			disableButton: false,
			overlay: {
				isLoading: false,
				fullPage: true,
				color: '#0d47a1',
				loader: 'dots'
			},
			googleButton: {
				iconTheme: 'color',
				background: '',
				loading: false,
				disabled: false
			},
			facebookButton: {
				iconTheme: 'color',
				background: '',
				loading: false,
				disabled: false
			},
		}
	},
	components: {
		OverlayLoading
	},
	props: ['auctioneerId'],
	methods : {
		signin() {
			this.errorMessage = null
			this.verificationEmailSentMessage = null
			const auth = getAuth()
			this.disableButton = true
			this.overlay.isLoading = true

			signInWithEmailAndPassword(auth, this.email, this.password)
			.then((userCredential) => {
				const user = userCredential.user;
				if(user.emailVerified) {
					user.getIdToken(true)
					.then((idToken) => {
						this.$store.dispatch('signin', idToken)
						.then(() => {
							this.email = null
							this.password = null
							this.redirectAuctioneer()
						})
						.catch((error) => {
							console.log(error)
							this.errorMessage = error
							this.disableButton = false
							this.overlay.isLoading = false
						})
					}).catch(error => {
						this.errorMessage = error
						this.signOut(auth)
						this.disableButton = false
						this.overlay.isLoading = false
					})
				} else {
					console.log('email not verified')
					this.errorMessage = 'You must verify your e-mail to sign in.'
					this.disableButton = false
					this.overlay.isLoading = false						
				}
			}).
			catch((error) => {
				const errorCode = error.code;
				const errorMessage = error.message;

				console.log(errorCode)
				console.log(errorMessage)

				if(errorCode === 'auth/missing-email') {
					this.errorMessage = 'You must inform an e-mail address.'
				}

				if(errorCode === 'auth/internal-error' && !this.password) {
					this.errorMessage = 'You must inform your password.'
				}

				if(errorCode === 'auth/user-not-found') {
					this.errorMessage = 'Auctioneer not found.'
				}

				if(errorCode === 'auth/wrong-password') {
					this.errorMessage = 'Wrong password.'
					
				}
				if(errorCode === 'auth/too-many-requests') {
					this.errorMessage = 'Your account has been temporarily disabled. Please try again later.'
				}
				this.disableButton = false
				this.overlay.isLoading = false
			});
		},
		googleSignIn() {
			const auth = getAuth()
			const provider = new GoogleAuthProvider();
			this.googleButton.loading = true
			this.googleButton.disabled = true
			this.socialSignin(auth, provider, this.googleButton)
		},
		facebookSignin() {
			const auth = getAuth()
			const provider = new FacebookAuthProvider()
			this.facebookButton.loading = true
			this.facebookButton.disabled = true
			this.socialSignin(auth, provider, this.facebookButton)
		},
		socialSignin(auth, provider, button) {
			signInWithPopup(auth, provider)
			.then((result) => {
				const user = result.user
				console.log(user)

				console.log(user.emailVerified)

				user.getIdToken(true)
				.then((idToken) => {
					this.$store.dispatch('signin', idToken)
					.then(() => {
						this.redirectAuctioneer()
					})
					.catch((error) => {
						console.log(error)
						this.errorMessage = error
					})
				})
				.catch((error) => {
					console.log(error)
				})

				button.loading = false
				button.disabled = false

			}).catch((error) => {
				const errorCode = error.code;
				const errorMessage = error.message;
				const email = error.email;
				const credential = GoogleAuthProvider.credentialFromError(error);

				console.log(errorCode)
				console.log(errorMessage)
				console.log(email)
				console.log(credential)
				button.loading = false
				button.disabled = false

				if(errorCode == 'auth/account-exists-with-different-credential') {
					this.errorMessage = 'This account has been registered using another credential'
				} else {
					this.errorMessage = errorMessage
				}
			})
		},
		redirectAuctioneer() {
			if(this.$route.query.redirect) this.$router.push({name: this.$route.query.redirect, params: this.$route.query.params})
			else this.$router.push({name: 'auctioneer'})
			this.disableButton = false
			// this.loader.loading = false
			this.overlay.isLoading = false
		},
		signOut: function(auth) {
			signOut(auth).then(() => console.log('signing out')).catch((error) => console.log(error))
		},
		mouseOverButton(network) {
			switch(network) {
				case 'facebook':
					this.facebookButton.iconTheme = 'white'
					this.facebookButton.background = 'blue darken-4 white-text'
					break
				case 'google':
					this.googleButton.iconTheme = 'white'
					this.googleButton.background = 'red darken-1 white-text'
					break
				case 'twitter':
					this.twitterButton.iconTheme = 'white'
					this.twitterButton.background = 'blue white-text'
			}	
		},
		mouseLeaveButton(network) {
			switch(network) {
				case 'facebook':
					this.facebookButton.iconTheme = 'color'
					this.facebookButton.background = ''
					break
				case 'google':
					this.googleButton.iconTheme = 'color'
					this.googleButton.background = ''
					break
				case 'twitter':
					this.twitterButton.iconTheme = 'color'
					this.twitterButton.background = ''
			}
		}
	}
}
</script>

<style scoped>
</style>
