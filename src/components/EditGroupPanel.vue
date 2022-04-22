<template>
	<form class="col s12 center" style="margin-top: 1em;" v-on:submit.prevent="save">
		<div v-if="errorMessage" class="col s12">
			<p class="red-text">{{ errorMessage }}</p>
		</div>
		<div class="row">
			<div class="input-field col s11">
				<i class="material-icons prefix" :class="{ 'icon-input-field-fail-error' : $v.group.name.$error}">people</i>
				<input
					v-model.lazy="$v.group.name.$model"
					type="text"
					placeholder="Input name of group"
					:class="{ 'input-field-fail-error' : $v.group.name.$error}"
					@change="$v.group.name.$touch()" />
				<span v-if="$v.group.name.$error" class="red-text helper-text left-align">This field is required</span>
			</div>
			<div class="col s1" style="margin-top: 2em;">
				<a href="#" v-tooltip.top="'Add a player to the group'" @click.prevent="addPlayer">
					<i class="blue-text text-darken-4 material-icons">add_circle</i>
				</a>
			</div>
			<div v-for="(player, index) in group.players" :key="player.id">
				<div class="input-field col s7 m8 l6 xl7 offset-l1 offset-xl1" style="margin-top: -.5em;">
					<i class="material-icons prefix" :class="{ 'icon-input-field-fail-error' : $v.group.players.$each[index].playerName.$error}">person</i>
					<input
						v-model.lazy="$v.group.players.$each[index].playerName.$model"
						type="text"
						placeholder="Input name of player"
						:class="{ 'input-field-fail-error' : $v.group.players.$each[index].playerName.$error}"
						@change="$v.group.players.$each[index].playerName.$touch()"/>
						<span v-if="$v.group.players.$each[index].playerName.$error" class="red-text helper-text left-align">This field is required</span>
				</div>
				<div class="input-field col s4 m3 l3 xl2" style="margin-top: -.5em;">
					<i class="material-icons prefix" :class="{ 'icon-input-field-fail-error' : $v.group.players.$each[index].walletValue.$error}">wallet</i>
					<input
						v-model.lazy="$v.group.players.$each[index].walletValue.$model"
						type="number"
						placeholder="Input money"
						:class="{ 'input-field-fail-error' : $v.group.players.$each[index].walletValue.$error}"
						@change="$v.group.players.$each[index].walletValue.$touch()"/>
						<span v-if="$v.group.players.$each[index].walletValue.$error" class="red-text helper-text left-align">This field is required</span>
				</div>
				<div class="col s1" style="margin-top: 1em;">
					<a v-tooltip.top="'Remove this player from the group'" href="#" @click.prevent="remove(index)">
						<i class="red-text text-darken-4 material-icons">delete</i>
					</a>
				</div>
			</div>
		</div>
		<div class="row">
			<button 
				class="col s12 m8 l6 offset-m2 offset-l3 waves-effect waves-light btn-small button-activate blue darken-4" 
				type="submit"
				:disabled="disableButton">
					Save
			</button>
			<div class="col s1">
				<grid-loader :loading="loader.loading" :color="loader.color" :size="loader.size" />
			</div>
		</div>
	</form>
</template>

<script>
import { mapGetters } from 'vuex'
import { required } from 'vuelidate/lib/validators'
import GridLoader from "vue-spinner/src/GridLoader.vue";

export default {
	name: 'edit-group',
	props: ['receivedGroup'],
	data() {
		return {
			group: {},
			errorMessage: '',
			disableButton: false,
			loader: {
				color: '#0d47a1',
				size: '7px',
				loading: false
			}
		}
	},
	components: {
		GridLoader
	},
	computed: {
		...mapGetters(['storedEditGroup']),
		...mapGetters(['storedAuctioneer'])
	},
	validations() {
		return {
			group: {
				name: {required},
				players: {
					$each: {
						playerName: {required},
						walletValue: {required}
					}
				}
			}
		}
	},
	mounted() {
		if(!this.receivedGroup && !this.storedEditGroup) {
			this.errorMessage = 'There was a problem loading the group of players'
		} else if(this.receivedGroup) {
			this.group = this.receivedGroup
		} else if(this.storedEditGroup) {
			this.group = this.storedEditGroup
		}
	},
	methods: {
		save() {
			if(!this.$v.$invalid) {
				let groupSave = {
					groupPlayerId: this.group.id,
					auctioneerId: this.group.auctioneerId,
					groupPlayerName: this.group.name,
					players: this.group.players
				}
				this.disableButton = true
				this.loader.loading = true

				if(groupSave.groupPlayerId) {
					this.update(groupSave)
				} else {
					this.register()
				}
			} else {
				this.$v.$touch()
			}
		},
		update(group) {
			this.$http.put('/api/group-player', group)
			.then(() => {
				this.$store.commit('RESET_EDIT_GROUP')
				this.$router.push({name: 'auctioneer'})
				this.disableButton = false
				this.loader.loading = false
			})
			.catch((error) => {
				console.log(error)
				this.disableButton = false
				this.loader.loading = false
				this.errorMessage = 'There was a problem when trying to save the group'
			})
		},
		register() {
			let register = {
				auctioneerId: this.storedAuctioneer.id,
				name: this.group.name,
				players: this.group.players
			}
			this.$http.post('/api/group-player/register', register)
			.then(() => {
				this.$store.commit('RESET_EDIT_GROUP')
				this.$router.push({name: 'auctioneer'})
				this.disableButton = false
				this.loader.loading = false
			})
			.catch((error) => {
				console.log(error)
				this.disableButton = false
				this.loader.loading = false
				this.errorMessage = 'There was a problem when trying to save the group'
			})
		},
		remove(index) {
			if(this.group.players.length > 1) {
				this.group.players.splice(index, 1)
			} else {
				this.$notice['error']({
					title: 'Attention',
					description: 'A group must have a player at least'
				})
			}
		},
		addPlayer() {
			if(this.group.players.length < 25) {
				this.group.players.push({playerName: '', walletValue: '0'})
			} else {
				this.$notice['error']({
					title: 'Attention',
					description: 'A group cannot have more than 25 players'
				})
			}
		}
	}
}
</script>

<style>

</style>