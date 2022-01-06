<template>
  <div id="signin">
    <div v-show="signInMode">
      <div class="row">
        <h4 class="center-align col s12" v-show="!auctioneerId">Sign in</h4>
        <div v-show="errorMessage" class="center-align col s12">
          <p class="red-text">{{ errorMessage }}</p> 
        </div>
        <div v-show="verificationEmailSentMessage" class="center-align col s12">
          <p class="green-text">{{ verificationEmailSentMessage }}</p>
        </div>
        <div v-show="recoverPasswordEmailSentMessage" class="center-align col s12">
          <p class="green-text">{{ recoverPasswordEmailSentMessage }}</p>
        </div>
      </div>
      <form v-on:submit.prevent="signin" v-show="!auctioneerId" style="margin-top: -1.5em;">
        <div class="row center-align">
          <div class="input-field col s12 m10 l8 offset-m1 offset-l2">
            <i class="material-icons prefix">mail_outline</i>
            <input type="email" id="autocomplete-email-input" class="autocomplete" v-model="email">
            <label for="autocomplete-email-input">Email</label>
          </div>
          <div class="input-field col s12 m10 l8 offset-m1 offset-l2">
            <i class="material-icons prefix">lock_outline</i>
            <input type="password" v-model="password">
            <label>Password</label>
          </div>
          <button class="col s10 m8 l6 offset-s1 offset-m2 offset-l3 waves-effect waves-light btn-small button-activate blue darken-4" type="submit">Sign in</button> 
          <div class="col s12" style="margin-top: 1.5em;">
            <a href="" @click.prevent="changeToSignUpMode" style="margin-top: 1em;">Sign up</a>
          </div>
          <div class="col s12" style="margin-top: 1em;"> 
            <a href="" @click.prevent="changeToForgotPasswordMode"  style="margin-top: 1em;">Forgot password?</a>
          </div>
        </div>
      </form>
    </div>
    <signup-panel v-show="signUpMode" @verifyEmailSent='verifyEmailSent($event)'/>    
    <forgot-password-panel v-show="forgotPasswordMode" @recoverPasswordEmailSent='recoverPasswordEmailSent($event)' />
  </div>
</template>

<script>
  
  import axios from 'axios'
  import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth"

  import SignupPanel from './SignupPanel.vue'
  import ForgotPasswordPanel from './ForgotPasswordPanel.vue'

  export default {

    name: 'signin',
    data () {
      return {
        email: null,
        password: null,
        errorMessage: null,
        signInMode: true,
        signUpMode: false,
        forgotPasswordMode: false,
        verificationEmailSentMessage: null,
        recoverPasswordEmailSentMessage: null
      }
    },
    components: { 
      'signup-panel': SignupPanel, 
      'forgot-password-panel': ForgotPasswordPanel
    },
    props: ['auctioneerId'],
    methods : {
      signin: function() {
        this.errorMessage = null
        this.verificationEmailSentMessage = null
        const auth = getAuth()

        signInWithEmailAndPassword(auth, this.email, this.password)
        .then((userCredential) => {

          const user = userCredential.user;

          if(user.emailVerified) {
            user.getIdToken(true).then(idToken => {

            axios.post('https://hebaja-auction-api.herokuapp.com/api/firebase-auth', idToken)
              .then((response) => {
                this.auctioneer = response.data
                this.email = null
                this.password = null
              }).catch(error => {
                this.errorMessage = error
                this.signOut(auth)
              })

            }).catch(error => {
              this.errorMessage = error
              this.signOut(auth)
            })

          } else {
            console.log('email not verified')
            this.errorMessage = 'You must verify your e-mail to sign in.'
          }

        }).catch((error) => {
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
        });
      },
      modeChanged: function(data) {
        this.signUpMode = data
      },
      verifyEmailSent: function(data) {
        this.email = null
        this.password = null
        this.errorMessage = null
        this.signInMode = true
        this.signUpMode = false
        this.recoverPasswordEmailSentMessage = null
        this.verificationEmailSentMessage = 'An e-mail has been sent to ' + data + '. Check your inbox to complete register.'
      },
      recoverPasswordEmailSent: function(data) {
        this.email = null
        this.password = null
        this.errorMessage = null
        this.signInMode = true
        this.forgotPasswordMode = false
        this.verificationEmailSentMessage = null
        this.recoverPasswordEmailSentMessage = 'An e-mail has been sent to ' + data + '. Check your inbox to recover your password.'
      },
      changeToSignUpMode: function() {
        this.signInMode = false
        this.signUpMode = true
      },
      changeToForgotPasswordMode: function() {
        this.signInMode = false
        this.forgotPasswordMode = true
      },
      signOut: function(auth) {
        signOut(auth).then(() => console.log('signing out')).catch((error) => console.log(error))
      }
    }
  }
</script>

<style scoped>

</style>
