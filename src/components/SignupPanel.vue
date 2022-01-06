<template>
  <div id="signup">
    <div class="row">
      <h4 class="center-align col s12">Sign up</h4>
    </div>
    <form v-on:submit.prevent="signup" style="margin-top: -1.5em">
      <p class="center-align col s12" v-if="errors.length">
        <b>Please, correct the following error(s):</b>
        <ul>
          <li v-for="error in errors" :key="error.id"><p class="red-text">{{ error }}</p></li>
        </ul>
      </p>
      <div class="row center-align">
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
        
        <button class="col s10 m8 l6 offset-s1 offset-m2 offset-l3 waves-effect waves-light btn-small button-activate blue darken-4" type="submit">Sign up</button>
        <div class="col s12" style="margin-top: 1.5em;">
          <a href="">Back to sign in</a>
        </div>
        
      </div>
    </form>
  </div>
  
</template>

<script>
  import { getAuth, createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";

  export default {
    name: 'signup',
    data() {
      return {
        email: null,
        emailConfirm: null,
        password: null,
        passwordConfirm: null,
        errors: []
      }
    },
    methods: {
      signup: function() {
        const auth = getAuth()
        this.errors.splice(0)

        if(!this.email) {
          this.errors.push('You must inform a valid e-mail.')
        } else if(!this.emailConfirm) {
          this.errors.push('You must confirm your e-mail.')
        } else if(!(this.email === this.emailConfirm)) {
          this.errors.push('Emails are different.')
        } else if(!this.password) {
          this.errors.push('You must input a password.')
        } else if(!this.passwordConfirm) {
          this.errors.push('You must confirm your password')
        } else if(!(this.password === this.passwordConfirm)) {
          this.errors.push('Passwords are different.')
        } else {
          createUserWithEmailAndPassword(auth, this.email, this.password)
            .then((userCredential) => {
              const user = userCredential.user
              sendEmailVerification(user)
                .then(() => {
                  console.log('sending email registration')
                  this.$emit('verifyEmailSent', user.email)
                })
            }).catch((error) => {
              if(error.code === 'auth/weak-password') {
                console.log(error)
                this.errors.push('Password should be at least 6 characters.')
              }
            })
        }
      },
    }

    
  }

</script>

<style scoped>

</style>
