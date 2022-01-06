<template>

  <a href="" :class="buttonColor" class="app-button waves-effect waves-light btn-small white-text">{{ label }}</a>
    
</template>

<script>

  export default {
    props: ['label', 'category'],
    computed: {
      buttonColor() {
        if(this.category == 'default' || !this.category) return 'blue darken-4'
        if(this.category == 'edit') return 'yellow darken-4'
        if(this.category == 'delete') return 'red darken-4'
        if(this.category == 'open') return 'blue'
        return 'blue darken-4'
      }
    }

  }

</script>

<style scoped>
  .app-button {
    margin-right: .5em;
  }

</style>
