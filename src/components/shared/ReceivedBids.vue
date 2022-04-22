<template>
	<div id="received-bids" class="col s12" style="margin-top: 1em;">
		<ul class="collection with-header">
			<li class="collection-header"><h5>{{ header }}</h5></li>
			<li v-for="bid in bidList" :key="bid.id" class="collection-item row">
				<div class="col s6">
					<span class="blue-text text-darken-4" style="font-size: 1.1em;">
						<i class="material-icons inline-icon">person</i>&nbsp;{{ bid.playerName }}
					</span>
				</div>
				<div class="col s6">
					<span class="green-text text-darken-4" style="font-size: 1.1em;">
						<i class="material-icons inline-icon">attach_money</i>{{ bid.value }}
					</span>
				</div>
			</li>
		</ul>
	</div>
</template>

<script>
export default {
    name: 'received-bids',
	props: ['header', 'bidList']

}
</script>

<style>

</style>