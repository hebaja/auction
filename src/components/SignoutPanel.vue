<template>
  <form v-on:submit="signout" v-show="auctioneerId">
    <button class="waves-effect waves-light btn-small button-activate red" type="submit">Sign out</button>
  </form>  
</template>

<script>

import { getAuth, signOut } from "firebase/auth";

export default {
  name: 'signout',
  props: ['auctioneerId'],
  methods: {
    signout: function() {
      const auth = getAuth();
      signOut(auth).then(() => console.log('signing out')).catch((error) => console.log(error)
      )
    }
  }
}

</script>

<style scoped>

</style>
