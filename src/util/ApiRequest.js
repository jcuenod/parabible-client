import DataFlow from './DataFlow'
import { Xhr, apiEndpoints } from './Xhr'

DataFlow.watch("reference", () => {
	ApiRequest("chapterText")
}).watch("activeWid", () => {
	ApiRequest("wordLookup")
})

const searchFilterOptions = (filter) => {
	const options = {
		"none": [],
		"current": [DataFlow.get("reference").book],
		"pentateuch": ["Genesis", "Exodus", "Leviticus", "Numbers", "Deuteronomy"],
		"minorProphets": ["Hosea", "Joel", "Amos", "Obadiah", "Jonah", "Micah", "Nahum", "Habakkuk", "Zephaniah", "Haggai", "Zechariah", "Malachi"],
		// "custom": DataFlow.get("customBookFilter")
	}
	return options[filter]
}
const ApiRequest = (endpoint) => {
	let payload = {}
	switch (endpoint) {
		case "wordLookup":
			payload = { "wid": DataFlow.get("activeWid") }
			Xhr(endpoint, payload).then(result => {
				DataFlow.set("worddata", result.results)
			})
			break
		case "chapterText":
			payload = { "reference": DataFlow.get("reference") }
			if (DataFlow.get("highlightTermsSetting") && DataFlow.get("searchTerms").length > 0) {
				payload["search_terms"] = DataFlow.get("searchTerms")
			}
			Xhr(endpoint, payload).then(result => {
				DataFlow.set("searchHighlights", result.highlights)
				DataFlow.set("bibledata", result.text)
				// DataFlow.set("reference", result.reference)
			})
			break
		case "termSearch":
			payload = {
				"query": DataFlow.get("searchTerms"),
				"search_range": DataFlow.get("searchRangeSetting"),
				"search_filter": searchFilterOptions(DataFlow.get("searchFilterSetting")),
			}
			DataFlow.set("lastSearch", payload)
			if (!DataFlow.setWasEqual()) {
				Xhr(endpoint, payload).then(result => {
					DataFlow.set("searchResults", result)
				}).catch(err => {
					console.error(err)
					console.error("oh no")
				})
			}
			else {
				DataFlow.renotify("searchResults")
			}
			break
		default:
			if (apiEndpoints.indexOf(endpoint) !== -1) {
				console.error("strange, we don't seem to handle this endpoint but apparently it's available")
				console.error(endpoint)
			}
			else {
				console.error("sorry, this endpoint is not available")
				console.error(endpoint)
			}
	}
}
export default ApiRequest