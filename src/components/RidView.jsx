import { Stylesheet } from '@uifabric/merge-styles'
import React from 'react'
import DataFlow from 'util/DataFlow'
import { generateReference } from 'util/ReferenceHelper'

// const fontSetting = () => {
// 	return `"${DataFlow.get("fontSetting")}", "SBL Biblit", "Open Sans", "Arial"`
// }

const wordOnClick = (wid, module_id) => (event) => {
	DataFlow.set("activeWid", { wid, module_id })
}
const Word = ({ text, wid, moduleId, activeWid }) =>
	<span
		className="wbit"
		onClick={wordOnClick(wid, moduleId)}
		style={{ color: (activeWid.wid === wid && activeWid.module_id === moduleId) ? "#0078d7" : "inherit" }}
	>
		{text}
	</span>
const TextArrayDisplay = ({ moduleId, rid, textArray, activeWid }) =>
	<div style={{ display: "table-cell" }}>
		{textArray.map(({ wid, leader = "", text, trailer = "" }) =>
			[leader, <Word text={text} wid={wid} moduleId={moduleId} activeWid={activeWid} />, trailer]
		)}
	</div>

const TextStringDisplay = ({ rid, textString }) =>
	<div style={{ display: "table-cell" }} dangerouslySetInnerHTML={{ __html: textString }} />


// const textHelper = {
// 	"wlc": {
// 		styles: { display: "table-cell", verticalAlign: "top", direction: "rtl", fontSize: "x-large", padding: "3px 5px", fontFamily: DataFlow.get("fontSetting") },
// 		function: wlcDisplay
// 	},
// 	"sbl": {
// 		styles: { display: "table-cell", verticalAlign: "top", padding: "3px 5px", fontSize: "large", fontFamily: DataFlow.get("fontSetting") },
// 		function: sblDisplay
// 	},
// 	"net": {
// 		styles: { display: "table-cell", verticalAlign: "top", padding: "3px 5px", fontSize: "medium" },
// 		function: netDisplay
// 	},
// 	"lxx": {
// 		styles: { display: "table-cell", verticalAlign: "top", padding: "3px 5px", fontSize: "large", fontFamily: DataFlow.get("fontSetting") },
// 		function: lxxDisplay
// 	}
// }
// TODO: Do something actual with fonts for LXX
const parallelView = ({ rid, activeWid, ridData, thisVerseActive }) => (
	<div className="contiguousrid" data-rid={rid} id={thisVerseActive ? "activeVerse" : ""} style={{ display: "table", tableLayout: "fixed", width: "100%", direction: "ltr", backgroundColor: thisVerseActive ? "rgba(255,255,0,0.3)" : "" }}>
		{ridData.modules.map(({ module_id, rid, text_string, text_array }) =>
			text_string
				? <TextStringDisplay
					key={module_id}
					moduleId={module_id}
					rid={rid}
					textString={text_string} />
				: <TextArrayDisplay
					key={module_id}
					moduleId={module_id}
					rid={rid}
					textArray={text_array}
					activeWid={activeWid} />
		)}
	</div>
)

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
				return <div className="contiguousrid" id={thisVerseActive ? "activeVerse" : ""} style={{
					display: "inline",
					fontFamily: DataFlow.get("fontSetting"),
					fontSize: '80%',
					backgroundColor: thisVerseActive ? "rgba(255,255,0,0.3)" : ""
				}} data-rid={rid}>
					{sblDisplay(rid, ridData.sbl, activeWid)}
				</div>
			case "lxx":
				return <div className="contiguousrid" id={thisVerseActive ? "activeVerse" : ""} style={{
					display: "inline",
					fontFamily: DataFlow.get("fontSetting"),
					fontSize: '80%',
					backgroundColor: thisVerseActive ? "rgba(255,255,0,0.3)" : ""
				}} data-rid={rid}>
					{lxxDisplay(rid, ridData.lxx, activeWid)}
				</div>
			case "net":
				return <div className="contiguousrid" id={thisVerseActive ? "activeVerse" : ""} style={{
					display: "inline",
					fontSize: '80%',
					backgroundColor: thisVerseActive ? "rgba(255,255,0,0.3)" : ""
				}} data-rid={rid}>
					<span dangerouslySetInnerHTML={{ __html: ridData.net }} />
				</div>
			case "wlc":
				return <div className="contiguousrid" id={thisVerseActive ? "activeVerse" : ""} style={{
					display: "inline",
					fontFamily: DataFlow.get("fontSetting"),
					backgroundColor: thisVerseActive ? "rgba(255,255,0,0.3)" : ""
				}} data-rid={rid}>
					{wlcDisplay(rid, ridData.wlc, activeWid)}
				</div>
			default:
				return <div style={{ display: "inline" }} data-rid={rid}>
					{ridData[ridDataKeys[0]]}
				</div>
		}
	}
}
export default RidView