<template>

  <a href="" :class="buttonColor" class="app-button waves-effect waves-light btn-small btn-floating"><i class="material-icons">{{ icon }}</i></a>
    
</template>

<script>

  export default {
    props: ['category'],
    computed: {
      buttonColor() {
        if(this.category == 'default' || this.category == 'add' || !this.category) return 'green darken-4'
        if(this.category == 'remove') return 'red darken-4'
        return 'green darken-4'
      },
      icon() {
        if(this.category == 'default' || this.category == 'add' || !this.category) return 'add'
        if(this.category == 'remove') return 'remove'
        return 'add'
      }
    }

  }

</script>

<style scoped>
  .app-button {
    margin-right: .5em;
  }

</style>
