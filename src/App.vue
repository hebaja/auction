<template>
	<div id="app">
		<Navbar />
		<div class="container">
			<router-view />
		</div>
	</div>
</template>

<script>
import Navbar from './components/NavbarPanel.vue'
import { initializeApp } from "firebase/app";

const firebaseConfig = {
	apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
	authDomain: process.env.VUE_APP_FIREBASE_AUTH_DOMAIN,
	projectId: process.env.VUE_APP_FIREBASE_PROJECT_ID,
	storageBucket: process.env.VUE_APP_FIREBASE_STORAGE_BUCKET,
	messagingSenderId: process.env.VUE_APP_FIREBASE_MESSAGING_SENDER_ID,
	appId: process.env.VUE_APP_FIREBASE_APP_ID,
	measurementId: process.env.VUE_APP_FIREBASE_MEASUREMENT_ID
}

initializeApp(firebaseConfig);

export default {
	name: 'App',
	components: {
		Navbar,
	},
	created() {
	let uri = window.location.href.split('?')
		if(uri.length == 2) {
		let vars = uri[1].split('&')
		let getVars = {}
		let tmp = ''
		vars.forEach(function(v) {
			tmp = v.split('=')
			if(tmp.length == 2)
			getVars[tmp[0]] = tmp[1]
		})
		this.query = getVars
		}
	},
}
</script>

<style>
table {
	border-collapse: collapse;
	width: 80%;
}

td, th {
	border: 1px solid #dddddd;
	text-align: left;
	padding: 8px;
}

.heading {
	font-family: arial, sans-serif;
}

.dg-btn--ok {
	border-color: red !important;
	background-color: red !important;
	color: white !important;
	box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2), 0 6px 20px 0 rgba(0,0,0,0.19);
}

.dg-btn--ok:active {
	transform: translateY(2px) translateX(2px);
	box-shadow: 0 10px 18px 0 rgba(0,0,0,0.2), 0 6px 20px 0 rgba(0,0,0,0.19);
}

.dg-btn--cancel {
	border-color: green;
	background-color: green !important;
	color: white;
	box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2), 0 6px 20px 0 rgba(0,0,0,0.19);
}

.dg-btn--cancel:active {
	transform: translateY(2px) translateX(2px);
	box-shadow: 0 10px 18px 0 rgba(0,0,0,0.2), 0 6px 20px 0 rgba(0,0,0,0.19);
}

.tooltip {
	display: block !important;
	z-index: 10000;
}

.tooltip .tooltip-inner {
	background: black;
	color: white;
	border-radius: 16px;
	padding: 5px 10px 4px;
	opacity: 0.7;
}

.tooltip .tooltip-arrow {
	width: 0;
	height: 0;
	border-style: solid;
	position: absolute;
	margin: 5px;
	border-color: black;
	opacity: 0.7;
	z-index: 1;
}

.tooltip[x-placement^="top"] {
	margin-bottom: 5px;
}

.tooltip[x-placement^="top"] .tooltip-arrow {
	border-width: 5px 5px 0 5px;
	border-left-color: transparent !important;
	border-right-color: transparent !important;
	border-bottom-color: transparent !important;
	bottom: -5px;
	left: calc(50% - 5px);
	margin-top: 0;
	margin-bottom: 0;
}

.tooltip[x-placement^="bottom"] {
	margin-top: 5px;
}

.tooltip[x-placement^="bottom"] .tooltip-arrow {
	border-width: 0 5px 5px 5px;
	border-left-color: transparent !important;
	border-right-color: transparent !important;
	border-top-color: transparent !important;
	top: -5px;
	left: calc(50% - 5px);
	margin-top: 0;
	margin-bottom: 0;
}

.tooltip[x-placement^="right"] {
	margin-left: 5px;
}

.tooltip[x-placement^="right"] .tooltip-arrow {
	border-width: 5px 5px 5px 0;
	border-left-color: transparent !important;
	border-top-color: transparent !important;
	border-bottom-color: transparent !important;
	left: -5px;
	top: calc(50% - 5px);
	margin-left: 0;
	margin-right: 0;
}

.tooltip[x-placement^="left"] {
	margin-right: 5px;
}

.tooltip[x-placement^="left"] .tooltip-arrow {
	border-width: 5px 0 5px 5px;
	border-top-color: transparent !important;
	border-right-color: transparent !important;
	border-bottom-color: transparent !important;
	right: -5px;
	top: calc(50% - 5px);
	margin-left: 0;
	margin-right: 0;
}

.tooltip.popover .popover-inner {
	background: #f9f9f9;
	color: black;
	padding: 24px;
	border-radius: 5px;
	box-shadow: 0 5px 30px rgba(black, .1);
}

.tooltip.popover .popover-arrow {
	border-color: #f9f9f9;
}

.tooltip[aria-hidden='true'] {
	visibility: hidden;
	opacity: 0;
	transition: opacity .15s, visibility .15s;
}

.tooltip[aria-hidden='false'] {
	visibility: visible;
	opacity: 1;
	transition: opacity .15s;
}

.switch label input[type=checkbox]:checked+.lever {
	background-color: #2196f3 ;
}
.switch label input[type=checkbox]:checked+.lever:after {
	background-color: #0d47a1 ;
}

</style>
