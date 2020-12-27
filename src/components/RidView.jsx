import React from 'react'
import AccentUnit from './AccentUnit'
import LXXVerse from './LXXVerse'
import SBLVerse from './SBLVerse'
import DataFlow from 'util/DataFlow'
import { generateReference } from 'util/ReferenceHelper'

const wlcDisplay = (rid, wlc, activeWid) => (
	wlc.map((accentUnit, i) =>
		AccentUnit({
			verseNumber: (i === 0 ? (rid % 1000) : false),
			accentUnit: accentUnit,
			activeWid: activeWid
		})
	).join("")
)
const lxxDisplay = (rid, lxx, activeWid) => (
	lxx ? Object.keys(lxx).map(verseUnit => (
		LXXVerse({
			verseNumber: verseUnit.replace(/^[\d\w]+\s/, ""),
			lxxVerse: lxx[verseUnit],
			activeWid: activeWid
		})
	)) : ""
)
const sblDisplay = (rid, sbl, activeWid) => (
	sbl ? <SBLVerse
		key={rid % 1000}
		verseNumber={rid % 1000}
		text={sbl}
		activeWid={activeWid} />
		: ""
)
const netDisplay = (rid, net, activeWid) => net


const textHelper = {
	"wlc": {
		styles: "display: table-cell; vertical-align: top; padding: 3px 5px; font-size: x-large; font-family: SBL Biblit; direction: rtl;",
		function: wlcDisplay
	},
	"sbl": {
		styles: "display: table-cell; vertical-align: top; padding: 3px 5px; font-size: large; font-family: SBL Biblit;",
		function: sblDisplay
	},
	"net": {
		styles: "display: table-cell; vertical-align: top; padding: 3px 5px; font-size: medium;",
		function: netDisplay
	},
	"lxx": {
		styles: "display: table-cell; vertical-align: top; padding: 3px 5px; font-size: large; font-family: SBL Biblit;",
		function: lxxDisplay
	}
}

const parallelStyle = active =>
	`display: table;` +
	`tableLayout: fixed;` +
	`width: 100%;` +
	`direction: ltr;` +
	`background-color: ${active ? "rgba(255,255,0,0.3)" : ""}`
// TODO: Do something actual with fonts for LXX
const parallelView = ({ rid, activeWid, ridData, thisVerseActive }) => (
	`<div className="contiguousrid"
		data-rid=${rid}
		id=${thisVerseActive ? "activeVerse" : ""}
		style="${parallelStyle}">` +
	DataFlow.get(rid >= 400000000 ? "textsToDisplayMainNT" : "textsToDisplayMainOT").map(text =>
		ridData.hasOwnProperty(text) ?
			`<div style="${textHelper[text].styles}"> ` +
			textHelper[text].function(rid, ridData[text], activeWid) +
			`</div> `
			: `<div style="${textHelper[text].styles}" /> `
	).join("") +
	`</div>`
)

const singleTextStyles = (active, large = false) =>
	`display: inline;` +
	`font-family: SBL Biblit;` +
	(large ? "" : `font-size: 80%;`) +
	`background-color: ${active ? "rgba(255,255,0,0.3)" : ""};`

const isObject = obj => Object.prototype.toString.call(obj).indexOf('Object') !== -1
const RidView = ({ ridDataWithRid, activeWid }) => {
	if (ridDataWithRid === undefined) {
		return <div>The data for this verse looks empty</div>
	}
	const { rid, ...ridData } = ridDataWithRid
	if (!isObject(ridData) || Object.keys(ridData).length === 0) {
		return <div>{generateReference([rid])} -- No texts were returned for this verse, maybe something went wrong. Sorry! Please use the feedback button to let us know.</div>
	}
	const ridDataKeys = Object.keys(ridData)
	const activeVerse = DataFlow.get("activeVerse")
	const thisVerseActive = activeVerse ?
		rid === activeVerse.rid :
		false

	if (ridDataKeys.length === 0) {
		return <div>{generateReference([rid])} -- No texts were returned for this verse, maybe something went wrong. Sorry! Please use the feedback button to let us know.</div>
	}
	if (ridDataKeys.length > 1) {
		// PARALLEL
		return parallelView({ rid, ridData, activeWid, thisVerseActive })
	}
	else {
		// SINGLE TEXT
		switch (ridDataKeys[0]) {
			case "sbl":
				return `<span ` +
					`className="contiguousrid" ` +
					`id=${thisVerseActive ? "activeVerse" : ""} ` +
					`style="${singleTextStyles(thisVerseActive)}" ` +
					`data-rid=${rid}>` +
					sblDisplay(rid, ridData.sbl, activeWid) +
					`</span>`
			case "lxx":
				return `<span ` +
					`className="contiguousrid" ` +
					`id=${thisVerseActive ? "activeVerse" : ""} ` +
					`style="${singleTextStyles(thisVerseActive)}" ` +
					`data-rid=${rid}>` +
					lxxDisplay(rid, ridData.lxx, activeWid) +
					`</span>`
			case "net":
				return `<span ` +
					`className="contiguousrid" ` +
					`id=${thisVerseActive ? "activeVerse" : ""} ` +
					`style="${singleTextStyles(thisVerseActive)}" ` +
					`data-rid=${rid}>` +
					ridData.net +
					`</span>`
			case "wlc":
				return `<span ` +
					`className="contiguousrid" ` +
					`id=${thisVerseActive ? "activeVerse" : ""} ` +
					`style="${singleTextStyles(thisVerseActive, true)}" ` +
					`data-rid=${rid}>` +
					wlcDisplay(rid, ridData.wlc, activeWid) +
					`</span>`
			default:
				return `<span style="display: inline" data-rid=${rid}>${ridData[ridDataKeys[0]]}</span>`
		}
	}
}
export default RidView