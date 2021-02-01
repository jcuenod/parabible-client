import React from 'react'
// import { List } from 'office-ui-fabric-react/lib/List'
import { DefaultButton, PrimaryButton } from 'office-ui-fabric-react/lib/Button'
import DataFlow from 'util/DataFlow'
import { generateReference, generateURL } from 'util/ReferenceHelper'
import RidView from './RidView'
import Pagination from './Pagination'

const RESULTS_PER_PAGE = 10

// TODO: useHook
// TODO: Performance seems terrible on large sets (e.g. when there are 500 results)
// TODO: Make sure popouts work on firefox and chrome (they don't appear to work on chrome)

class ResultsOverlay extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			page: 0
		}
		DataFlow.bindState(["screenSizeIndex"], this.setState.bind(this))
		this.resultListDomRef = React.createRef()
	}
	selectPage(page) {
		this.setState({ page })
		this.resultListDomRef.current.scrollTop = 0
	}
	render() {
		const searchResults = DataFlow.get("searchResults")
		if (!searchResults || !searchResults.results || !searchResults?.results.length) {
			return null
		}
		const multiline = this.state.screenSizeIndex < 2
		const useAbbreviation = this.state.screenSizeIndex < 4 && !multiline ? true : false

		const truncatedCount = searchResults.truncated || -1
		const trueCount = searchResults.results.length

		const startOffset = this.state.page * RESULTS_PER_PAGE
		const endOffset = this.state.page * RESULTS_PER_PAGE + RESULTS_PER_PAGE
		const pageResults = searchResults.results.slice(startOffset, endOffset)

		return (
			<div style={{
				visibility: this.props.panelIsVisible ? "visible" : "hidden",
				position: "fixed",
				top: 40,
				bottom: 0,
				left: 0,
				right: 0,
				background: "rgba(255, 255, 255, 0.9)",
				userSelect: this.state.screenSizeIndex > 2 ? "text" : "none",
				cursor: "text",
				overflowY: "scroll",
				WebkitOverflowScrolling: "touch"
			}}
				ref={this.resultListDomRef}
			>

				<div style={{
					fontFamily: "Open Sans",
					fontSize: "large",
					fontWeight: "bold",
					textAlign: "center",
					padding: "5px"
				}}>
					Search Results ({truncatedCount > -1 ? `${trueCount}/${truncatedCount}` : trueCount})
				</div>

				<div style={{
					position: "fixed",
					top: 50,
					right: 25
				}}>
					{!multiline ? <DefaultButton
						onClick={this.props.showPopout}
						iconProps={{ iconName: 'Print' }} /> : ""}
					<PrimaryButton
						onClick={this.props.hideOverlay}
						iconProps={{ iconName: 'Close' }} />
				</div>

				<Pagination
					active={this.state.page}
					range={Math.ceil(trueCount / RESULTS_PER_PAGE)}
					selectPage={this.selectPage.bind(this)}
					maxNumbersToShow={this.state.screenSizeIndex <= 2 ? 5 : 11} />

				<div>
					{pageResults.map((item, i) => (
						<div key={i}
							style={{
								display: "flex",
								flexDirection: multiline ? "column" : "row",
								padding: multiline ? "5px" : "5px 15px",
								cursor: "pointer"
							}} className="resultsRow"
						>
							<div style={{
								flexBasis: multiline ? "" : "100px",
								fontFamily: "Open Sans",
								fontSize: "small",
								fontWeight: "bold",
								textTransform: "uppercase"
							}}>
								<a href={generateURL(item.verses[0])} className="verseUrl">
									{generateReference(item.verses, useAbbreviation)}
								</a>
							</div>
							<div style={{ flex: 1 }}>
								{item.text.map((t, j) => (
									<RidView
										key={j}
										ridDataWithRid={t}
										activeWid={-1} />
								))}
							</div>
						</div>
					))}
				</div>

				<Pagination
					active={this.state.page}
					range={Math.ceil(trueCount / RESULTS_PER_PAGE)}
					selectPage={this.selectPage.bind(this)}
					maxNumbersToShow={this.state.screenSizeIndex <= 2 ? 5 : 11} />

			</div>
		)
	}
}
export default ResultsOverlay
