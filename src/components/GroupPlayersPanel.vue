<template>
  	<div id="group-player">
		<div v-show="auctioneerId">
			<h3>Groups</h3>
			<register-player-panel :auctioneerId="auctioneerId" @groupCreated="groupCreated($event)"/>
			<p v-if="errors.length">
				<b>Please, correct the following error(s):</b>
				<ul class="red-text text-darken-4">
					<li v-for="error in errors" :key="error.id">{{ error }}</li>
				</ul>
			</p>

			<div v-show="mutableGroupPlayers.length">
				<ul class="collapsible">
					<li v-for="(groupPlayer, groupIndex) of mutableGroupPlayers" :key="groupPlayer.id">
						<div class="collapsible-header">
							<i class="material-icons">group</i>
							<span v-if="editMode.state && editMode.position === groupIndex"><input class="browser-default" type="text" v-model="groupPlayer.name" style="width: 15em;" placeholder="Input group's name"></span>	
							<span v-else>{{ groupPlayer.name }}</span>
						</div>
						<div class="collapsible-body">
							<div class="row">
							
								<i v-if="!groupPlayer.active" class="col s12 m12 l1 icon-active material-icons">flash_off</i>
								<i v-else class="col s12 m1 icon-active material-icons">flash_on</i>

								<app-button class="col s5 m3 l2" label="Activate" v-show="!groupPlayer.active && !editMode.state" @click.prevent.native="activateGroup(auctioneerId, groupPlayer.id, groupActiveArray)"/>
								<app-button class="col s5 m3 l2" label="Deactivate" category="delete" v-show="groupPlayer.active && !editMode.state" @click.prevent.native="deactivateGroup(auctioneerId, groupPlayer.id, groupActiveArray)"/>
								<app-button class="col s5 m3 l2" :label="editGroupButton.label" category="edit" v-if="!groupPlayer.active && !editMode.state || editMode.position === groupIndex" @click.prevent.native="editGroup(groupIndex)" />
								<app-button class="col s5 m3 l2" label="Delete" category="delete" v-show="!groupPlayer.active" @click.prevent.native="deleteGroup(auctioneerId, groupPlayer.id)" />
								<app-button class="col s5 m3 l2" label="Links" category="open" @click.prevent.native="showLinkList" />
							</div>

							<modal name="players-link"
								:scrollable="true"
								@closed="hideModal">
								<div class="row" style="margin: 1.5em;">
									<a href="" class="waves-effect waves-light btn-small blue" @click.prevent="copyAllPlayersLinks(groupPlayer.players)" style="margin-left: .9em; margin-bottom: 1em;">Copy all players's links</a>
									<div v-for="player of groupPlayer.players" :key="player.id">
										<span class="col s12"><b>{{ player.playerName }}</b></span>
										<div class="col s12" style="margin-bottom: .5em;">
											<span>https://joy-auction.herokuapp.com/?playerId={{ player.id }}</span>
											<a href="" @click.prevent="copyPlayerLink(player.id)" style="margin-left: .5em;">copy</a>
										</div>
									</div>
								</div>
							</modal>

							<form v-on:submit.prevent="update($event, groupPlayer.id, groupPlayer.players, groupIndex)">
								<div v-for="(player, playerIndex) of groupPlayer.players" :key="player.id">
									<div class="row" v-if="editMode.state && editMode.position === groupIndex ">
										<label class="player-label-form" :for="'player-name'+playerIndex"><i class="col s1 inline-icon material-icons">person</i></label>
										<input :id="'player-name'+playerIndex" class="col s6 player-input-form browser-default" type="text" v-model="player.playerName" placeholder="Input player's name">
										<label class="player-label-form" :for="'wallet-value'+playerIndex" style="margin-left: 1.5em;"><i class="col s1 inline-icon material-icons">account_balance_wallet</i></label>
										<input :id="'wallet-value'+playerIndex" class="col s3 player-input-form browser-default" type="text" step="10" v-model="player.walletValue" placeholder="Value in wallet">
									</div>
									<div class="row" v-else>
										<span class="col s6"><i class="inline-icon material-icons">person</i>{{ player.playerName }}</span>
										<span class="col s6"><i class="inline-icon material-icons">account_balance_wallet</i>{{ player.walletValue }}</span>
									</div>
								</div>
								<div v-if="editMode.state" class="row">
									<div class="col s12">
										<div class="row">
											<app-floating-button category="add" v-tooltip.bottom="'Add a player to the group'" @click.prevent.native="addNewPlayer(groupIndex)" />
											<app-floating-button category="remove" v-tooltip.bottom="'Remove last player from the group'" @click.prevent.native="removeLastPlayer(groupIndex)" />
										</div>
									</div>
								<div>
									<button v-if="editMode.state" class="col s12 m10 offset-m1 l8 offset-l2 btn-small blue darken-4" type="submit">Update Group</button>
								</div>
								</div>
							</form>
						</div>
					</li>
				</ul>
			</div>
		</div>
  	</div>
</template>

<script>
import RegisterPlayerPanel from "./RegisterPlayerPanel.vue"
import AppButton from "./shared/AppButton.vue"
import AppFloatingButton from "./shared/AppFloatingButton.vue"

import axios from "axios"

export default {
	name: "group-player",
	data() {
		return {
			activateGroupPlayer: {
				groupPlayerId: null,
				auctioneerId: null,
			},
			updateGroupPlayer: {
				groupPlayerId: null,
				groupPlayerName: null,
				auctioneerId: null,
				players: [],
			},
			deleteGroupPlayer: {
				groupPlayerId: null,
				auctioneerId: null,
			},
			editGroupButton: {
				label: "Edit",
			},
			group: null,
			editMode: {
				state: false,
				position: null,
			},
			errors: [],
		}
	},

	components: {
		RegisterPlayerPanel, AppButton, AppFloatingButton
	},

	props: ["groupPlayers", "auctioneerId", "groupActiveArray"],

	methods: {
		activateGroup: function (auctioneerId, groupPlayerId, groupActiveArray) {
			this.activateGroupPlayer.groupPlayerId = groupPlayerId;
			this.activateGroupPlayer.auctioneerId = auctioneerId;

			const index = groupActiveArray.indexOf(groupPlayerId);
			if (index === -1) {
				groupActiveArray.push(groupPlayerId);
			}

			this.$emit("changeGroupActive", groupActiveArray);

			axios
			.post("https://hebaja-auction-api.herokuapp.com/api/group-player/activate",this.activateGroupPlayer)
			.then((response) => {
				var group = response.data
				group.sort((a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0))
				this.mutableGroupPlayers = group
			})
			.catch((err) => console.log(err));
		},
		deactivateGroup: function (auctioneerId, groupPlayerId, groupActiveArray) {
			this.activateGroupPlayer.groupPlayerId = groupPlayerId;
			this.activateGroupPlayer.auctioneerId = auctioneerId;

			const index = this.groupActiveArray.indexOf(groupPlayerId);

			if (index > -1) {
				this.groupActiveArray.splice(index, 1);
			}

			this.$emit("changeGroupActive", groupActiveArray);

			axios
			.post("https://hebaja-auction-api.herokuapp.com/api/group-player/deactivate",this.activateGroupPlayer)
			.then((response) => {
				var group = response.data
				group.sort((a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0))
				this.mutableGroupPlayers = group
			})
			.catch((err) => console.log(err));
		},
		groupCreated: function (data) {
			this.mutableGroupPlayers.push(data);
		},
		editGroup: function (index) {
			this.editMode.state = !this.editMode.state;
			this.editGroupButton.label = this.editMode.state ? "Cancel" : "Edit";
			this.editMode.position = this.editMode.state ? index : null;
		},
		update: function (event, groupPlayerId, players, index) {
			var thereIsNoEmptyName = true;
			var thereIsNoEmptyWalletValue = true;

			this.updateGroupPlayer.auctioneerId = this.auctioneerId;
			this.updateGroupPlayer.groupPlayerName =
			this.mutableGroupPlayers[index].name;
			this.updateGroupPlayer.groupPlayerId = groupPlayerId;
			this.updateGroupPlayer.players = players;

			this.updateGroupPlayer.players.forEach((player) => {
				if (!player.playerName) {
					thereIsNoEmptyName = false;
				}
				if (!player.walletValue) {
					thereIsNoEmptyWalletValue = false;
				}
			});

			if (
				this.updateGroupPlayer.groupPlayerName &&
				thereIsNoEmptyName &&
				thereIsNoEmptyWalletValue
			) {
			axios
				.post(
				"https://hebaja-auction-api.herokuapp.com/api/group-player/update",
				this.updateGroupPlayer
				)
				.then((response) => {
				this.mutableGroupPlayers[index] = response.data;
				this.editMode = false;
				this.editGroupButton.label = "Edit";
				this.errors.splice(0);
				window.location.reload()
				})
				.catch((err) => console.log(err));
			} else if (!this.updateGroupPlayer.groupPlayerName) {
				this.errors.push("You must input a name for the group.");
				event.preventDefault();
			} else if (!thereIsNoEmptyName) {
				this.errors.push("You must not leave a player's name empty.");
				event.preventDefault();
			} else if (!thereIsNoEmptyWalletValue) {
				this.errors.push("You must not leave a player's wallet empty.");
				event.preventDefault();
			} else {
				this.errors.push("There was an unknown error.");
				event.preventDefault();
			}
		},

		deleteGroup(auctioneerId, groupPlayerId) {
			let message = "Are you sure?";
			let options = {
			okText: "Delete",
			cancelText: "Cancel",
		};

			this.$dialog
			.confirm(message, options)
			.then(() => {
				this.deleteGroupPlayer.auctioneerId = auctioneerId;
				this.deleteGroupPlayer.groupPlayerId = groupPlayerId;
				axios
				.post(
					"https://hebaja-auction-api.herokuapp.com/api/group-player/delete",
					this.deleteGroupPlayer
				)
				.then((response) => (this.mutableGroupPlayers = response.data))
				.catch((err) => console.log(err));
			})
			.catch((message) => console.log(message));
		},
		addNewPlayer: function (index) {
			this.mutableGroupPlayers[index].players.push({
			playerName: null,
			walletValue: null,
			});
		},
		removeLastPlayer: function (index) {
			this.mutableGroupPlayers[index].players.pop();
		},
		showLinkList: function () {
			this.$modal.show("players-link");
		},
		copyPlayerLink: function (playerId) {
			navigator.clipboard.writeText('https://joy-auction.herokuapp.com/?playerId=' + playerId);
		},
		copyAllPlayersLinks: function (players) {
			var listOfLinks = []
			players.forEach(player => {
				listOfLinks.push(`${player.playerName}: https://joy-auction.herokuapp.com/?playerId=${player.id}`)
			})
			navigator.clipboard.writeText(listOfLinks.join('\r\n'))
		},
		hideModal: function() {
			this.$modal.hide("players-link");
		}
	}
}
</script>

<style scoped>
.icon-active {
	vertical-align: bottom;
	height: 28px;
}

.button-activate {
	width: 10em;
	transition: all 0.5s ease;
}

.custom-button {
 	margin-right: .5em;
}

</style>
