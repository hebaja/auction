<template>
    <div class="row" >
        <ul class="tabs-header col s12">
            <li 
				class="col s4 tab-item" 
				v-for="(tab, index) in tabs"
				:key="tab.title"
				@click.prevent="selectTab(index)"
				:class='{"tab-selected" : (index == selectedIndex)}'>
					<span class="tab-text">{{ tab.title }}</span>
            </li>
        </ul>
        <slot></slot>
    </div>
  
</template>

<script>
export default {
    name: 'tabs',
    props: {
      mode: {
        type: String,
        default: 'light'
      }
    },
    data() {
        return {
            selectedIndex: 0,
            tabs: []
        }
    },
    created() {
        this.tabs = this.$children
    },
    mounted() {
        this.selectTab(0)
    },
    methods: {
        selectTab(i) {
            this.selectedIndex = i
            this.tabs.forEach((tab, index) => {
                tab.isActive = (index === i)
            })
        }
    }
}
</script>

<style>
.tab-item {
	color: #2196f3;
	cursor: pointer;
	display: block;
	border-radius: 3px;
	height: 40px;
	line-height: 40px;
	text-align: center;
}

.tabs-header {
	margin: 0 0 0 0;
}

.tab-selected {
	color: #0d47a1;
	font-weight: bold;
	background-color: #bbdefb;
	font-size: 1.2em;
}

</style>