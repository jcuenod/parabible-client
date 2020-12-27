import React from 'react'
import WordBit from './WordBit'


const VerseStyles =
	"color: #ea4300;" +
	"vertical-align: top;" +
	"font-size: 8px;" +
	"font-weight: bold;" +
	"white-space: nowrap;"

const v = verseNumber => verseNumber.replace(/\d+:/, "")

const LXXVerse = ({ verseNumber, lxxVerse, activeWid }) => (
	`<span className="lxxVerse">` +
	(verseNumber !== false ?
		`<span style="${VerseStyles}" title="${verseNumber}">${v(verseNumber)} </span>`
		: "") +
	(lxxVerse ? lxxVerse.map((lword, i) =>
		WordBit({
			wbit: {
				wid: lword.wid,
				word: lword.text,
				trailer: " "
			},
			activeWid: activeWid
		})).join("")
		: "") +
	"</span>"
)
export default LXXVerse