import React from 'react'
// import { List } from 'office-ui-fabric-react/lib/List'
import { IconButton, DefaultButton, PrimaryButton } from 'office-ui-fabric-react/lib/Button'
import DataFlow from 'util/DataFlow'
import { generateReference, generateURL } from 'util/ReferenceHelper'
import RidView from './RidView'

const RESULTS_PER_PAGE = 10

const PageNumbers = ({range, active, selectPage, maxNumbersToShow}) => {
	const halfMaxNumbersToShow = ((maxNumbersToShow - 1) / 2)
	let startingIndex
	let pages = [...Array(range).keys()]
	if (range > maxNumbersToShow) {
		if (active - halfMaxNumbersToShow < 0) {
			startingIndex = 0
		}
		else if (active + halfMaxNumbersToShow >= range) {
			startingIndex = range - maxNumbersToShow
		}
		else {
			startingIndex = active - halfMaxNumbersToShow
		}

		pages = pages.slice(startingIndex, startingIndex + maxNumbersToShow)
		console.log(startingIndex)
		console.log(pages)
	}
	return pages.map(p => (
		<DefaultButton
			disabled={p === active}
			style={{
				verticalAlign: 'middle',
				borderRadius: '2px',
				border: 'none',
				minWidth: '32px',
				minHeight: '32px',
				alignItems: 'center',
				margin: "2px"
			}}
			onClick={() => selectPage(p)}
		>
			{p + 1}
		</DefaultButton>
	))
}

const Pagination = ({range, active, selectPage, maxNumbersToShow}) => !!range && (
	<div style={{
		display: 'flex',
		margin: '20px',
	}}>
		<div style={{flexGrow: 1}}/>
		<IconButton
			iconProps={{iconName: "ChevronsLeft"}}
			onClick={() => selectPage(0)}
			disabled={active === 0}
			style={{margin: "2px"}} />
		<IconButton
			iconProps={{iconName: "ChevronLeft"}}
			onClick={() => selectPage(active - 1)}
			disabled={active === 0}
			style={{margin: "2px"}} />
		<PageNumbers
			range={range}
			active={active}
			selectPage={selectPage}
			maxNumbersToShow={maxNumbersToShow} />
		<IconButton
			iconProps={{iconName: "ChevronRight"}}
			onClick={() => selectPage(active + 1)}
			disabled={active === (range - 1)}
			style={{margin: "2px"}} />
		<IconButton
			iconProps={{iconName: "ChevronsRight"}}
			onClick={() => selectPage(range - 1)}
			disabled={active === (range - 1)}
			style={{margin: "2px"}} />
		<div style={{flexGrow: 1}}/>
	</div>
)

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
		this.setState({page})
		this.resultListDomRef.current.scrollTop = 0
	}
	render() {
		console.log(this.state.screenSizeIndex)
		const searchResults = DataFlow.get("searchResults")
		const multiline = this.state.screenSizeIndex < 2
		const useAbbreviation = this.state.screenSizeIndex < 4 && !multiline ? true : false
		const resultCount = searchResults && Object.keys(searchResults).length > 0 ?
			(searchResults.truncated ? searchResults.truncated : searchResults.results.length) : "?"
		const pageResults = DataFlow.get("searchResults").results
							.slice(this.state.page * RESULTS_PER_PAGE,
								   this.state.page * RESULTS_PER_PAGE + RESULTS_PER_PAGE)
		
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
					Search Results ({resultCount})
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
					range={Math.ceil(resultCount / RESULTS_PER_PAGE)}
					selectPage={this.selectPage.bind(this)}
					maxNumbersToShow={this.state.screenSizeIndex <= 2 ? 5 : 11} />

				<div>
					{pageResults.map(item => (
						<div style={{
							display: "flex",
							flexDirection: multiline ? "column" : "row",
							padding: multiline ? "5px" : "5px 15px",
							cursor: "pointer"
						}} className="resultsRow">
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
								{item.text.map(t => (
									<RidView
										ridDataWithRid={t}
										activeWid={-1} />
								))}
							</div>
						</div>
					))}
				</div>

				<Pagination
					active={this.state.page}
					range={Math.ceil(resultCount / RESULTS_PER_PAGE)}
					selectPage={this.selectPage.bind(this)}
					maxNumbersToShow={this.state.screenSizeIndex <= 2 ? 5 : 11} />

				{/*<List
					items={DataFlow.get("searchResults").results}
					onRenderCell={(item, index) => (
						<div style={{
							display: "flex",
							flexDirection: multiline ? "column" : "row",
							padding: multiline ? "5px" : "5px 15px",
							cursor: "pointer"
						}} className="resultsRow">
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
								{item.text.map(t => (
									<RidView
										ridDataWithRid={t}
										activeWid={-1} />
								))}
							</div>
						</div>
					)}
				/>*/}

			</div>
		)
	}
}
export default ResultsOverlay
