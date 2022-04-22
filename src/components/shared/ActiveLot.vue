<template>
    <div id="active-lot-panel">
        <div class="col s12">
			<i class="material-icons col s1" style="font-size: 1.5em;">shopping_cart</i>
			<span class="col s11" style="font-size: 1.3em">{{ description }}</span>
		</div>
		<div class="col s12">
			<hr/>
		</div>
		<div class="col s12" style="font-size: 1.1em">
			<span class="col s12 l5" style="margin-top: .5em;">
				Starting bid:
				&nbsp;&nbsp;
				<i class="material-icons inline-icon">
					attach_money
				</i>{{ lotStartingBid }}
			</span>
			<span v-if="lastBidPlayerName && lastBidValue" class="col s12 l6" style="margin-top: .5em;">
				Last bid: 
				&nbsp;&nbsp;
				<span class="blue-text text-darken-4">
					<i class="material-icons inline-icon">person</i>{{ lastBidPlayerName }}
				</span>
				&nbsp;&nbsp;
				<span class="green-text text-darken-4">
					<i class="material-icons inline-icon">attach_money</i>{{ lastBidValue }}
				</span>
			</span>
		</div>
		<div class="col s12" style="margin-top: .5em;">
			<hr/>
		</div>
    </div>
</template>

<script>
export default {
    name: 'active-lot-panel',
    props: ['description', 'lotStartingBid', 'lastBidPlayerName', 'lastBidValue']
}
</script>

<style>

</style>