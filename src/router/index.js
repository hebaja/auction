import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'

import Signin from '../components/SigninPanel'
import Index from '../components/IndexPanel'
import Signup from '../components/SignupPanel'
import ForgotPassword from '../components/ForgotPasswordPanel'
import Auctioneer from '../components/AuctioneerPanel'
import Auction from '../components/AuctionPanel'
import EditAuction from '../components/EditAuctionPanel'
import EditGroup from '../components/EditGroupPanel'
import ActiveLot from '../components/ActiveLotPanel'
import Player from '../components/PlayerPanel'
import AuctionRead from '../components/AuctionReadPanel'
import Profile from '../components/ProfilePanel' 

Vue.use(VueRouter)

const routes = [
	{
		path: "/",
		name: "index",
		component: Index,
		meta: {
			public: true
		}
	},
	{
		path: "/signin",
		name: "signin",
		component: Signin,
		meta: {
			public: true
		}
	},
	{
		path: "/signup",
		name: "signup",
		component: Signup,
		meta: {
			public: true
		}
	},
	{
		path: "/forgot-password",
		name: "forgot-password",
		component: ForgotPassword,
		meta: {
			public: true
		}
	},
	{
		path: "/player",
		name: "player",
		component: Player,
		meta: {
			public: true
		}
	},
	{
		path: "/auctioneer",
		name: "auctioneer",
		component: Auctioneer
	},
	{
		path: "/profile",
		name: "profile",
		component: Profile
	},
	{
		path: "/auction",
		name: "auction",
		component: Auction,
		props: true
	},
	{
		path: "/edit-auction",
		name: "edit-auction",
		component: EditAuction,
		props: true
	},
	{
		path: "/edit-group",
		name: "edit-group",
		component: EditGroup,
		props: true
	},
	{
		path: "/active-lot",
		name: "active-lot",
		component: ActiveLot,
		props: true
	},
	{
		path: "/auction-read",
		name: "auction-read",
		component: AuctionRead,
		props: true
	}
]

const router = new VueRouter({
	routes
})

router.beforeEach((routeTo, routeFrom, next) => {
	if(!routeTo.meta.public && !store.state.token) {
		console.log(routeFrom)
		console.log(routeTo)
		next({path: '/signin', query: { redirect: routeTo.name, params: routeTo.params }})
	} else {
		next()
	}
})

export default router