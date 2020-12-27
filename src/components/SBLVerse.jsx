import WordBit from './WordBit'

const VerseStyle =
	"color: #ea4300;" +
	"vertical-align: top;" +
	"font-size: 35%;" +
	"font-weight: bold;" +
	"white-space: nowrap;"

const SBLVerse = ({ verseNumber, text, activeWid }) => (
	`<span className="sblVerse">` +
	(verseNumber !== false ?
		`<span style="${VerseStyle}">${verseNumber} </span>`
		: "") +
	(text ? text.map((word, i) =>
		WordBit({
			wbit: word,
			activeWid: activeWid
		})).join("")
		: "") +
	`</span>`
)
export default SBLVerse