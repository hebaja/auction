<template>
	<nav class="blue darken-4">
		<div class="nav-wrapper">
			<router-link to="/" class="brand-logo">
				<div class="row">
					<span class="col s12">Joy.auction</span>
				</div>			
			</router-link>
			<a href="#" data-target="mobile-demo" class="sidenav-trigger"><i class="material-icons">menu</i></a>


			<ul v-if="auctioneerIsSignedIn" id="nav-mobile" class="right hide-on-med-and-down">
				<li><router-link to="/profile">{{ storedAuctioneer.name }}</router-link></li>
				<li><router-link to="/auctioneer">Auctions</router-link></li>
				<li><a href="" @click="signout">Sign out</a></li>
			</ul>
			<ul v-else id="nav-mobile" class="right hide-on-med-and-down">
				<li><router-link to="/signin">Sing in</router-link></li>
				<li><router-link to="/signup">Sing up</router-link></li>
				
			</ul>
			<ul v-if="auctioneerIsSignedIn" class="sidenav" id="mobile-demo">
				<li>{{ storedAuctioneer.name }}</li>
				<li><router-link class="sidenav-close" to="/auctioneer">Auctions</router-link></li>
				<li><a class="sidenav-close" href="" @click="signout">Sign out</a></li>
			</ul>
			<ul v-else class="sidenav" id="mobile-demo">
				<li><router-link class="sidenav-close" to="/signin">Sing in</router-link></li>
				<li><router-link class="sidenav-close" to="/signup">Sing up</router-link></li>
			</ul>
		</div>
		
	</nav>
</template>

<script>
import { mapGetters } from 'vuex'
import { getAuth, signOut } from "firebase/auth"
export default {
	name: 'navbar',
	computed: {
		...mapGetters(['auctioneerIsSignedIn']),
		...mapGetters(['storedAuctioneer'])
	},
	methods: {
		signout() {
			const auth = getAuth()
			signOut(auth).then(() => this.$store.commit('SIGN_OUT_AUCTIONEER')).catch((error) => console.log(error))
		}
	},
}
</script>

<style>

</style>