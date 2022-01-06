<template>
  <div id="forgot-password">
    <div class="row">
      <h4 class="center-align col s12">Recover Password</h4>      
    </div>
    <form v-on:submit.prevent='send' style="margin-top: -1.5em">
      <div class="row center-align">
        <p class="col s12" v-if="errors.length">
          <b>Please, correct the following error(s):</b>
          <ul>
            <li v-for="error in errors" :key="error.id"><p class="red-text">{{ error }}</p></li>
          </ul>
        </p>
        <div class="input-field col col s12 m10 l8 offset-m1 offset-l2">
          <i class="material-icons prefix">email</i>
          <input id="email-input" type="email" v-model="email">
          <label for="email-input">Input your e-mail</label>
        </div>
        <button class="col s10 m8 l6 offset-s1 offset-m2 offset-l3 waves-effect btn btn-small waves-light blue darken-4" type="submit">Recover password</button>
        <div class="col s12" style="margin-top: 1.5em;">
          <a href="">Back to sign in</a>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import { getAuth, sendPasswordResetEmail } from "firebase/auth";

export default {
  name: 'forgot-password',
  data() {
    return {
      email: null,
      errors: []
    }
  },
  methods: {
    send: function() {
      if(!this.email) {
        this.errors.push('You must insert an e-mail.')
      } else {
        const auth = getAuth();
      sendPasswordResetEmail(auth, this.email)
        .then(() => {
          this.errors.splice(0)
          this.$emit('recoverPasswordEmailSent', this.email)
        })
        .catch(err => {
          console.log(err) 
          this.errors.push('There was an error.')
        })
      }
    }
  }
  
}
</script>

<style scoped>

</style>