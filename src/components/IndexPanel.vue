<template>
	<div class="row">
		<h1 class="col s12 center-align">Joy Auction</h1>
		<p id="home-main-text" class="col s12 blue-text text-darken-4 center-align">Auction in classrooms made fun!</p>
	</div>
</template>

<script>
export default {
	name: 'index',
}
</script>

<style>
#home-main-text {
	font-size: 4.5em!important; 
	font-weight: bold!important;
	text-shadow: 2px 2px #808080;
	margin-top: 2px;
	margin-bottom: 2px;
}

@media only screen and (max-width: 576px) {
	#home-main-text {
		font-size: 3em!important;
		text-shadow: 1px 1px #808080;
	}
}

</style>