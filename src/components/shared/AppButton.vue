<template>
	<a id="app-button" href="" :class="buttonColor" class="app-button waves-effect waves-light btn-small white-text">{{ label }}<slot></slot></a>
</template>

<script>
export default {
	name: 'app-button',
    props: ['label', 'category'],
    computed: {
		buttonColor() {
			if(this.category == 'default' || !this.category) return 'blue darken-4'
			if(this.category == 'edit') return 'yellow darken-4'
			if(this.category == 'delete') return 'red darken-4'
			if(this.category == 'open') return 'blue'
			if(this.category == 'cancel') return 'green darken-4'
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
