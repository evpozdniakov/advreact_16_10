import React, { Component } from 'react'
import {Table, Column, InfiniteLoader} from 'react-virtualized'
import {connect} from 'react-redux'
import {
    fetchUpTo,
    lastLoadedIndexSelector,
    eventListSelector,
} from '../../ducks/events2'
// import Loader from '../common/Loader'
import 'react-virtualized/styles.css'

class EventTableVirtualized extends Component {
    renderTest() {
        return (
            <div>
                <p>
                    <button onClick={() => {this.props.fetchUpTo(12, ()=>{console.log('done 12')})}}>
                        Fetch first 12
                    </button>
                </p>
                <p>
                    <button onClick={() => {this.props.fetchUpTo(20, ()=>{console.log('done 20')})}}>
                        Fetch up to 20
                    </button>
                </p>
                <p>
                    <button onClick={() => {this.props.fetchUpTo(40, ()=>{console.log('done 40')})}}>
                        Fetch up to 40
                    </button>
                </p>
                <p>
                    <button onClick={() => {this.props.fetchUpTo(100, ()=>{console.log('done 100')})}}>
                        Fetch up to 100
                    </button>
                </p>
            </div>
        )
    }


    render() {
        // return <div>Event page 2</div>
        // if (this.props.loading) return <Loader />

        const { lastLoadedIndexSelector } = this.props;

        const props = {
            isRowLoaded: index => (index <= lastLoadedIndexSelector),
            loadMoreRows: ({stopIndex}) => {
                return new Promise(resolve => {
                    this.props.fetchUpTo(stopIndex, resolve)
                })
            },
            rowCount: 1000,
            // minimumBatchSize
            // threshold

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
                            // rowCount={this.props.events.length}
                            rowCount={1000}
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
        const { events=[] } = this.props

        if (!events[index]) {
            return {
                title: 'title',
                where: 'where',
                when: 'when',
            }
        }

        return this.props.events[index]
    }
}

export default connect(state => ({
    lastLoadedIndexSelector: lastLoadedIndexSelector(state),
    events: eventListSelector(state),
}), {
    fetchUpTo,
})(EventTableVirtualized)
