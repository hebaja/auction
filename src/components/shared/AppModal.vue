<template>
	<modal :name="name"
		height="auto"
		:adaptive="true"
		:scrollable="true">
		<div class="row">
			<div class="col s12 center-align">
				<div class="message">
					<h5>{{ message }}</h5>
				</div>
			</div>
		</div>
		<hr/>
		<body>
			<slot></slot>
		</body>
		<footer v-show="oneButtonFooter" style="margin-right: 2em;">
			<div class="row footer">
				<div class="col s6 offset-s6">
					<AppButton 
						class="col s12"
						label="Cancel"
						category="edit"
						@click.prevent.native="$emit('cancel-click')"
					/>
				</div>
			</div>
		</footer>
		<footer v-show="!oneButtonFooter" style="margin-right: 2em; margin-left: 2em;">
			<div class="row footer">
				<div class="col s6">
					<AppButton
						class="col s12"
						label="Cancel"
						category="cancel"
						@click.prevent.native="$emit('cancel-click')"
					/>
				</div>
				<div class="col s6">
					<AppButton
						class="col s12"
						category="delete"
						@click.prevent.native="$emit('confirm-click')">
							{{ confirmMessage }}
					</AppButton>
				</div>
			</div>
		</footer>
	</modal>
</template>

<script>
import AppButton from './AppButton.vue'
export default {
	name: 'app-modal',
	props: ['name', 'message', 'confirmMessage', 'oneButtonFooter'],
	components: {
		AppButton
	},
}
</script>

<style>
.message {
	padding-top: .5em;
	padding-left: 2em;
	padding-right: 2em;
}

.footer {
	padding-top: 1em;
}

</style>