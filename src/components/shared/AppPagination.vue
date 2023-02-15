<template>
	<div id="pagination">
		<div v-if="loader.loading">
			<div class="col s1 offset-s5">
				<grid-loader :loading="loader.loading" :color="loader.color" :size="loader.size" />
			</div>
		</div>
		<div v-else>
			<h5 class="col s12">{{ title }}</h5>
			<div v-if="message" class="col s12">
				<p class="red-text center-align">{{ message }}</p>
			</div>
			<ul class="collection col s12">
				<a href="" v-for="auction in auctions" :key="auction.id" class="collection-item avatar" @click.prevent="openAuction(auction.id)">
					<img :src="[auction.auctioneerPictureUrl ? auction.auctioneerPictureUrl : '/images/logo.svg']" alt="user profile picture" class="circle">
					<span class="title blue-text text-darken-4"><b>{{ auction.title }}</b></span>
					<p class="blue-text text-darken-4">
						Lots: {{ auction.lotsQuantity}}
						<br>
						Created on {{ formatDate(auction.creationDate) }} by {{ auction.auctioneerName }}
					</p>
					<span class="new badge secondary-content blue darken-4"></span>
				</a>
			</ul>
			<ul v-if="!payload.empty" class="pagination col s12" style="margin-top: -.2em; margin-left: -1.8em;">
				<li 
					:class="payload.first ? 'disabled disabled-link' : 'waves-effect'">
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
					:class="payload.last ? 'disabled disabled-link' : 'waves-effect'">
						<a href="#!" @click.prevent="pageForward">
							<i class="material-icons">chevron_right</i>
						</a>
				</li>
			</ul>
		</div>
	</div>
</template>

<script>
import GridLoader from "vue-spinner/src/GridLoader.vue"

export default {
	name: 'pagination',
	props: ['title', 'searchQuery'],
	components: {
		GridLoader
	},
	data() {
		return {
			auctions: '',
			pageSize: 8,
			pageRequest: null,
			payload: {},
			pagination: [],
			message: '',
			loader: {
				color: '#0d47a1',
				size: '12px',
				loading: false
			}
		}
	},
	mounted() {
		this.pageRequest = 0
		this.loader.loading = true
		this.$http.get('/api/auction/list', {params:{page: this.pageRequest, size: this.pageSize, sort: 'creationDate,desc', query: this.searchQuery}})
		.then((response) => {
			this.payload = response.data
			if(this.payload.empty) {
				this.message = 'No results were found'
				this.loader.loading = false
				this.auctions = {}
				this.pagination = []
			} else {
				this.auctions = this.payload.content
				this.loader.loading = false
				this.buildPagination(this.payload.totalPages, this.payload.number)
			}
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
			console.log(this.searchQuery)
			let shift = this.pageRequest - 1
			this.shiftPage(shift)
		},
		pageForward() {
			console.log(this.searchQuery)
			let shift = this.pageRequest + 1
			this.shiftPage(shift)
		},
		shiftPage(shift) {
			this.loader.loading = true
			this.$http.get('/api/auction/list', {params:{page: shift, size: this.pageSize, sort: 'creationDate,desc', query: this.searchQuery}})
			.then((response) => {
				this.payload = response.data
				if(this.payload.empty) {
					this.message = 'No results were found'
					this.loader.loading = false
					this.auctions = {}
					this.pagination = []
				} else {
					this.auctions = this.payload.content
					this.pageRequest = this.payload.number
					this.pagination = []
					this.buildPagination(this.payload.totalPages, this.payload.number)
					this.pagination.forEach((item => {
						item.class = ''
						item.numberClass = ''
					}))
					this.pagination[this.payload.number].class = 'active-page-item'
					this.pagination[this.payload.number].numberClass = 'active-page-number'
					this.loader.loading = false
				}
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