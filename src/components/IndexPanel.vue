<template>
	<div class="row" style="margin-top: 1.5em;">
		<div class="col s12">
			<p id="home-main-text" class="blue-text text-darken-4 center-align">Auctions made fun!</p>
		</div>
		<form v-on:submit.prevent="search" class="col s12" style="margin-top: .5em; margin-left: -.8em;">
				<div class="input-field col s10 l11">
					<i class="material-icons prefix" :class="{ 'icon-input-field-fail-error' : $v.searchQuery.$error}">search</i>
					<input 
						type="text"
						id="autocomplete-text-input"
						class="autocomplete"
						:class="{ 'input-field-fail-error' : $v.searchQuery.$error}"
						v-model="$v.searchQuery.$model"
						@change="$v.searchQuery.$touch()">
					<label for="autocomplete-text-input">Search</label>
					<span v-if="$v.searchQuery.$error" class="red-text helper-text left-align">This field is required</span>
				</div>
				<button 
					class="col s2 l1 waves-effect waves-light btn-small blue darken-4"
					type="submit"
					style="margin-top: 2em;"
					:disabled="disableButton">
						Go
				</button>
		</form>
		<div v-if="searching" class="col s12">
			<div class="row">
				<Pagination title='Results' :searchQuery="searchQuery" :key="componentKey" />
			</div>
		</div>
		<div class="col s12">
			<div class="row">
				<Pagination title='Latest auction' />
			</div>
		</div>
	</div>
</template>

<script>
import Pagination from './shared/AppPagination.vue'
import { required } from 'vuelidate/lib/validators'

export default {
	name: 'index',
	data() {
		return {
			auctions: '',
			disableButton: false,
			searchQuery: '',
			searching: false,
			componentKey: 0,
			overlay: {
				isLoading: false,
				fullPage: true,
				color: '#0d47a1',
				loader: 'dots'
			}
		}
	},
	components: {
		Pagination
	},
	validations() {
		return {
			searchQuery: {required}
		}
	},
	methods: {
		search() {
			if(!this.$v.$invalid) {
				this.searching = true
				this.componentKey++
			} else {
				this.$v.$touch()
			}
		},
	}
}
</script>

<style>
#home-main-text {
	font-size: 3em!important; 
	font-weight: bold!important;
	text-shadow: 2px 2px #808080;
	margin-top: 2px;
	margin-bottom: 2px;
}

@media only screen and (max-width: 576px) {
	#home-main-text {
		font-size: 1.8em!important;
		text-shadow: 1px 1px #808080;
	}
}

.active-page-item {
	background-color: #2196f3;
	pointer-events: none;
}

.active-page-number {
	color: white;
}

.disabled-link {
	pointer-events: none;
}

</style>