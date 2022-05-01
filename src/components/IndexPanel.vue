<template>
	<div class="row" style="margin-top: 1.5em;">
		<div class="col s12">
			<p id="home-main-text" class="blue-text text-darken-4 center-align">Auctions made fun!</p>
		</div>

		<form v-on:submit.prevent="search" class="col s12" style="margin-top: .5em; margin-left: -.8em;">
				<div class="input-field col s11">
					<i class="material-icons prefix">search</i>
					<input type="text" id="autocomplete-text-input" class="autocomplete" v-model="searchWord">
					<label for="autocomplete-text-input">Search</label>
				</div>
				
				<button 
					class="col s1 waves-effect waves-light btn-small blue darken-4"
					type="submit"
					style="margin-top: 2em;"
					:disabled="disableButton">
						Go
				</button>
		</form>

		<div class="col s12">
			<div class="row">
				<h5 class="col s12">Latest auctions</h5>
				<ul class="collection col s12">
					<a href="" v-for="auction in auctions" :key="auction.id" class="collection-item avatar" @click.prevent="openAuction(auction.id)">
						<img :src="[auction.auctioneerPictureUrl ? auction.auctioneerPictureUrl : '/images/logo.svg']" alt="" class="circle">
						<span class="title blue-text text-darken-4"><b>{{ auction.title }}</b></span>
						<p class="blue-text text-darken-4">
							Lots: {{ auction.lotsQuantity}}
							<br>
							Created on {{ formatDate(auction.creationDate) }} by {{ auction.auctioneerName }}
						</p>
						<span class="new badge secondary-content blue darken-4"></span>
					</a>
				</ul>
				<ul class="pagination col s12" style="margin-top: -.2em; margin-left: -1.8em;">
					<li 
						:class="paginationPayload.first ? 'disabled disabled-link' : 'waves-effect'">
							<a href="#!" @click.prevent="pageBack">
								<i class="material-icons">chevron_left</i>
							</a>
					</li>
					<li 
						v-for="(item, index) in pagination"
						:key="item.page"
						class="waves-effect"
						:class="item.class">
							<a href="#!" @click.prevent="changePage(index)"><span :class="item.numberClass">{{ item.page }}</span></a>
					</li>
					<li 
						:class="paginationPayload.last ? 'disabled disabled-link' : 'waves-effect'">
							<a href="#!" @click.prevent="pageForward">
								<i class="material-icons">chevron_right</i>
							</a>
					</li>
				</ul>
			</div>
		</div>

		
		<OverlayLoading :active="overlay.isLoading"
			:can-cancel="false"
			:is-full-page="overlay.fullPage"
			:color="overlay.color"
			:loader="overlay.loader"/>	
	</div>
</template>

<script>
import OverlayLoading from 'vue-loading-overlay';

export default {
	name: 'index',
	data() {
		return {
			auctions: '',
			paginationPayload: {},
			pagination: [],
			pageRequest: null,
			pageSize: 10,
			disableButton: false,
			searchWord: '',
			overlay: {
				isLoading: false,
				fullPage: true,
				color: '#0d47a1',
				loader: 'dots'
			}
		}
	},
	components: {
		OverlayLoading
	},
	mounted() {
		this.pageRequest = 0
		this.$http.get('/api/auction/list', {params:{page: this.pageRequest, size: this.pageSize, sort: 'creationDate,desc'}})
		.then((response) => {
			this.paginationPayload = response.data
			this.auctions = this.paginationPayload.content
			this.buildPagination(this.paginationPayload.totalPages, this.paginationPayload.number)
		})
		.catch((error) => console.log(error))
	},
	methods: {
		openAuction(id) {
			this.$router.push({name: 'auction-read', params: {auctionId: id }})
		},
		formatDate(creationDate) {
			const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul","Aug","Sep","Oct","Nov","Dec"];
			let date = new Date(creationDate)
			return ((months[(date.getMonth())] + " " + date.getDate() + " " + date.getFullYear()))
		},
		changePage(index) {
			this.shiftPage(index)
		},
		pageBack() {
			let shift = this.pageRequest - 1
			this.shiftPage(shift)
		},
		pageForward() {
			let shift = this.pageRequest + 1
			this.shiftPage(shift)
		},
		shiftPage(shift) {
			this.overlay.isLoading = true
			this.$http.get('/api/auction/list', {params:{page: shift, size: this.pageSize, sort: 'creationDate,desc'}})
			.then((response) => {
				this.paginationPayload = response.data
				this.auctions = this.paginationPayload.content
				this.pageRequest = this.paginationPayload.number
				this.pagination = []
				this.buildPagination(this.paginationPayload.totalPages, this.paginationPayload.number)
				this.pagination.forEach((item => {
					item.class = ''
					item.numberClass = ''
				}))
				this.pagination[this.paginationPayload.number].class = 'active-page-item'
				this.pagination[this.paginationPayload.number].numberClass = 'active-page-number'
				this.overlay.isLoading = false
		})
		.catch((error) => {
				console.log(error)
				this.overlay.isLoading = false
			})
		},
		buildPagination(totalPages, pageNumber) {
			for(let i = 0; i < totalPages; i++) {
				if(i === pageNumber) {
					this.pagination.push({
						page: i + 1 , class: 'active-page-item', numberClass: 'active-page-number'
					})
				} else {
					this.pagination.push({
						page: i + 1 , class: '', numberClass: ''
					})
				}
			}
		},
		search() {
			console.log(this.searchWord)
		}
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