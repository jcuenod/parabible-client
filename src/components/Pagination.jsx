import React from 'react'
import { IconButton, DefaultButton } from 'office-ui-fabric-react/lib/Button'

const PageNumbers = ({ range, active, selectPage, maxNumbersToShow }) => {
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
    }
    return pages.map(p => (
        <DefaultButton
            key={p}
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

const Pagination = ({ range, active, selectPage, maxNumbersToShow }) => !!range && (
    <div style={{
        display: 'flex',
        margin: '20px',
    }}>
        <div style={{ flexGrow: 1 }} />
        <IconButton
            iconProps={{ iconName: "ChevronsLeft" }}
            onClick={() => selectPage(0)}
            disabled={active === 0}
            style={{ margin: "2px" }} />
        <IconButton
            iconProps={{ iconName: "ChevronLeft" }}
            onClick={() => selectPage(active - 1)}
            disabled={active === 0}
            style={{ margin: "2px" }} />
        <PageNumbers
            range={range}
            active={active}
            selectPage={selectPage}
            maxNumbersToShow={maxNumbersToShow} />
        <IconButton
            iconProps={{ iconName: "ChevronRight" }}
            onClick={() => selectPage(active + 1)}
            disabled={active === (range - 1)}
            style={{ margin: "2px" }} />
        <IconButton
            iconProps={{ iconName: "ChevronsRight" }}
            onClick={() => selectPage(range - 1)}
            disabled={active === (range - 1)}
            style={{ margin: "2px" }} />
        <div style={{ flexGrow: 1 }} />
    </div>
)
export default Pagination
