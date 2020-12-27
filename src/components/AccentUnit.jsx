import WordBit from './WordBit'

const VerseStyle =
	"color: #ea4300;" +
	"vertical-align: top;" +
	"font-size: 35%;" +
	"font-weight: bold;" +
	"white-space: nowrap;"

const AccentUnit = ({ verseNumber, accentUnit, activeWid }) =>
	(verseNumber !== false ?
		`<span style="${VerseStyle}">${verseNumber} </span>` : "") +
	accentUnit.map((bit, i) =>
		WordBit({
			wbit: bit,
			activeWid: activeWid
		})
	).join("")

export default AccentUnit