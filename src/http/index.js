import axios from 'axios'
import store from '@/store'

const http = axios.create({
	// baseURL: process.env.VUE_APP_DEFAULT_API_BASE_URL,
	baseURL: "https://auction-api.fly.dev/",
	headers: {
		'Accept': 'application/json',
		'Content': 'application/json'
	}
})

http.interceptors.request.use(function(config) {
	const token = store.state.token
	if(token) {
		config.headers.Authorization = `Bearer ${token}`
	}
	return config
}, function(error) {
	return Promise.reject(error)
})

export default http
