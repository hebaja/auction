import Vuex from 'vuex'
import Vue from 'vue'
import http from '@/http'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

const state = {
	auctioneer: {},
	editAuction: null,
	openAuctionId: null,
	editGroup: null,
	activeLotForm: null,
	token: null
}

const mutations = {
	DEFINE_SIGNED_IN_AUCTIONEER(state, {auctioneer, token}) {
		state.auctioneer = auctioneer,
		state.token = token
	},
	SIGN_OUT_AUCTIONEER(state) {
		state.auctioneer = {},
		state.token = null
	},
	DEFINE_EDIT_AUCTION(state, auction) {
		state.editAuction = auction
	},
	DEFINE_OPEN_AUCTION_ID(state, auctionId) {
		state.openAuctionId = auctionId
	},
	DEFINE_EDIT_GROUP(state, group) {
		state.editGroup = group
	},
	DEFINE_ACTIVE_LOT_FORM(state, {activeLotForm}) {
		state.activeLotForm = activeLotForm
	},
	RESET_ACTIVE_LOT_FORM(state) {
		state.activeLotForm = null
	},
	RESET_EDIT_AUCTION(state) {
		state.editAuction = null
	},
	RESET_EDIT_GROUP(state) {
		state.editGroup = null
	}
}

const actions = {
	signin({ commit }, token) {
		return new Promise((resolve, reject) => {
			http.post('/api/firebase-auth', token)
			.then((response) => {
				commit('DEFINE_SIGNED_IN_AUCTIONEER', {
					auctioneer: response.data,
					token: token
				})
				resolve(response.data)
			})
			.catch(error => {
				console.log(error)
				reject(error)
			})
		})
	},
	defineActiveLotForm({ commit }, lotForm) {
		return new Promise((resolve, reject) => {
			http.post('/api/auction/start-lot', lotForm)
			.then((response) => {
				commit('DEFINE_ACTIVE_LOT_FORM', {
					activeLotForm: lotForm
				})
				resolve(response.data)
			})
			.catch((error) => {
				console.log(error)
				reject(error)
			})
		})
	},
	resetActiveLotForm({ commit }, lotId) {
		return new Promise((resolve, reject) => {
			http.get('/api/auction/reset-lot/' + lotId)
			.then((response) => {
				commit('RESET_ACTIVE_LOT_FORM')
				resolve(response.data)
			})
			.catch((error) => {
				console.log(error)
				reject(error)
			})
		})
	}
}

const getters = {
	auctioneerIsSignedIn: state => Boolean(state.token),
	storedAuctioneer: state => state.auctioneer,
	storedEditAuction: state => state.editAuction,
	storedEditGroup: state => state.editGroup,
	storedActiveLotForm: state => state.activeLotForm,
	storedOpenAuctionId: state => state.openAuctionId
}

export default new Vuex.Store({
	state,
	mutations,
	actions,
	getters,
	plugins: [createPersistedState({
		storage: window.sessionStorage
	})]
})