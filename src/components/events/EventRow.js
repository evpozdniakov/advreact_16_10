import React, { Component } from 'react'
import {DragSource} from 'react-dnd'
import { defaultTableRowRenderer as DefaultTableRowRenderer } from 'react-virtualized'
import {getEmptyImage} from 'react-dnd-html5-backend'
import DragPreview from './EventDragPreview'

class EventRow extends Component {
    componentDidMount() {
        this.props.connectPreview(getEmptyImage())
    }

    render() {
        const { key, connectDragSource } = this.props

        return connectDragSource(
            <div key={key}>
                <DefaultTableRowRenderer {...this.props} />
            </div>
        )
    }
}

const spec = {
    beginDrag(props) {
        return {
            id: props.rowData.uid,
            DragPreview
        }
    },

    /*endDrag() {
        console.log('---', 'endDrag')
    }*/
}

const collect = (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    connectPreview: connect.dragPreview(),
    // isDragging: monitor.isDragging(),
    // canDrag: monitor.canDrag(),
})

export default DragSource('event', spec, collect)(EventRow)
