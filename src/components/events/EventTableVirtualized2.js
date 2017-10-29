import React, { Component } from 'react'
import {Table, Column, InfiniteLoader} from 'react-virtualized'
import {connect} from 'react-redux'
import {
    fetchUpTo,
} from '../../ducks/events2'
// import Loader from '../common/Loader'
import 'react-virtualized/styles.css'

class EventTableVirtualized extends Component {
    render() {
        return (
            <div>
                <p>
                    <button onClick={() => {this.props.fetchUpTo(12)}}>
                        Fetch first 12
                    </button>
                </p>
                <p>
                    <button onClick={() => {this.props.fetchUpTo(20)}}>
                        Fetch up to 20
                    </button>
                </p>
                <p>
                    <button onClick={() => {this.props.fetchUpTo(40)}}>
                        Fetch up to 40
                    </button>
                </p>
                <p>
                    <button onClick={() => {this.props.fetchUpTo(100)}}>
                        Fetch up to 100
                    </button>
                </p>
            </div>
        )
    }


    renderBla() {
        return <div>Event page 2</div>
        // if (this.props.loading) return <Loader />

        const { testRowLoaded } = this.props;

        const props = {
            isRowLoaded: index => {
                // return false
                console.log('--- call isRowLoaded', index)
                const loaded = testRowLoaded(index)
                console.log('--- loaded?', loaded)
                return loaded
            },
            loadMoreRows: ({startIndex, stopIndex}) => {
                return this.props.loadMoreEvents(startIndex, stopIndex);
            },
            rowCount: 100,
            // minimumBatchSize
            // threshold

        }

        return (
            <InfiniteLoader {...props}>
                {({onRowsRendered, registerChild}) => {
                    // debugger;

                    return (
                        <Table
                            height={500}
                            width = {600}
                            rowHeight={40}
                            rowHeaderHeight={40}
                            rowGetter={this.rowGetter}
                            // rowCount={this.props.events.length}
                            rowCount={100}
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

    // renderTable(onRowsRendered, registerChild) {
    //     debugger
    //     // if (this.props.loading) return <Loader />

    //     return (
            
    //     )
    // }

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

export default connect((state, props) => ({
}), {
    fetchUpTo,
})(EventTableVirtualized)
