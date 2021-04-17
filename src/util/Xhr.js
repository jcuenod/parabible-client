require('abortcontroller-polyfill')

const apiRoot = "https://parabible.com/api"
const apiUrl = {
	"termSearch": "/term-search",
	"collocation": "/collocation",
	"wordSearch": "/word-search",
	"chapterText": "/chapter-text",
	"wordLookup": "/word-lookup"
}
const apiEndpoints = Object.keys(apiUrl)
let cancelController = {}

const Xhr = (api, payload) => {
	return new Promise((resolve, reject) => {
		if (!apiUrl.hasOwnProperty(api)) {
			console.log("api request not found in apiurl object", api)
			reject(null)
		}
		cancelController.hasOwnProperty(api) ? cancelController[api].abort() : null
		cancelController[api] = new AbortController()
		const signal = cancelController[api].signal
		const url = apiRoot + apiUrl[api]
		fetch(url, {
			method: "POST",
			headers: {
				"content-type": "application/json; charset=utf-8"
			},
			body: JSON.stringify(payload),
			signal
		}).then(response => {
			return response.json()
		}).then(response => {

			resolve(response)
			delete cancelController[api]

		}).catch(error => {
			if (error.code === 20) {
				reject("Aborted request (throttling)")
			}
			else {
				console.log(error)
				reject("some kind of error happened in the fetch")
			}
			delete cancelController[api]
		})
	})
}
const XhrGet = (url) => {
	return new Promise((resolve, reject) => {
		// if (!apiUrl.hasOwnProperty(api)) {
		// 	console.log("api request not found in apiurl object", api)
		// 	reject(null)
		// }
		cancelController.hasOwnProperty(url) ? cancelController[url].abort() : null
		cancelController[url] = new AbortController()
		const signal = cancelController[url].signal
		// const url = apiRoot + apiUrl[api]
		fetch(url, {
			method: "GET",
			headers: {
				"content-type": "application/json; charset=utf-8"
			},
			signal
		}).then(response => {
			return response.json()
		}).then(response => {

			resolve(response)
			delete cancelController[url]

		}).catch(error => {
			if (error.code === 20) {
				reject("Aborted request (throttling)")
			}
			else {
				console.log(error)
				reject("some kind of error happened in the fetch")
			}
			delete cancelController[url]
		})
	})
}
export { Xhr, XhrGet, apiEndpoints }