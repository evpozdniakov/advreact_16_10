import React, { Component } from 'react'
import {Table, Column, InfiniteLoader} from 'react-virtualized'
import {connect} from 'react-redux'
import {
    fetchUpTo,
    loadedEventCountSelector,
    loadedEventSelector,
} from '../../ducks/events2'
// import Loader from '../common/Loader'
import 'react-virtualized/styles.css'

class EventTableVirtualized extends Component {
    render() {
        const { loadedEventCount } = this.props;

        const props = {
            isRowLoaded: index => index < loadedEventCount,
            loadMoreRows: ({stopIndex}) => {
                return new Promise(resolve => {
                    this.props.fetchUpTo(stopIndex, resolve)
                })
            },
            rowCount: 596,
            // minimumBatchSize: 100,
            // threshold: 100,
        }

        return (
            <InfiniteLoader {...props}>
                {({onRowsRendered, registerChild}) => {
                    return (
                        <Table
                            height={500}
                            width = {600}
                            rowHeight={40}
                            rowHeaderHeight={40}
                            rowGetter={this.rowGetter}
                            // rowCount={this.props.loadedEvents.length}
                            rowCount={596}
                            overscanRowCount={0}
                            onRowClick={({ rowData }) => this.props.selectEvent(rowData.uid)}
                            onRowsRendered={onRowsRendered}
                            ref={registerChild}
                        >
                            <Column
                                dataKey = 'title'
                                width={300}
                                label = 'title'
                            />
                            <Column
                                dataKey = 'where'
                                width={200}
                                label = 'where'
                            />
                            <Column
                                dataKey = 'when'
                                width={200}
                                label = 'when'
                            />
                        </Table>
                    )
                }}
            </InfiniteLoader>
        )
    }

    rowGetter = ({ index }) => {
        const { loadedEvents=[] } = this.props

        if (!loadedEvents[index]) {
            return {}
        }

        return this.props.loadedEvents[index]
    }
}

export default connect(state => ({
    loadedEventCount: loadedEventCountSelector(state),
    loadedEvents: loadedEventSelector(state),
}), {
    fetchUpTo,
})(EventTableVirtualized)
