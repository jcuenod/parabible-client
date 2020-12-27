import HighlightManager from 'util/HighlightManager'

const WordBit = ({ wbit, activeWid }) => {
	let styles = "cursor: pointer;"
	if (wbit.hasOwnProperty("temperature")) {
		if (wbit.temperature == 2)
			styles += "color: #ea4300;"
		else if (wbit.temperature == 1)
			styles += "color: #004578;"
	}
	else if (activeWid === wbit.wid) {
		styles += "color: #0078d7;"
	}
	else if (HighlightManager.shouldHighlight(wbit.wid)) {
		styles += `color: ${HighlightManager.getHighlightColor(wbit.wid)};`
	}

	return `<span className="wbit" style="${styles}" data-wid=${wbit.wid}>${wbit.word}</span>` +
		(wbit.trailer.replace("\n", "  ") || "")

}
export default WordBit
