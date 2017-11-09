import React, { Component } from 'react'
import { connect } from 'react-redux'
import {DropTarget} from 'react-dnd'
import { deleteEvent } from '../../ducks/events'

const baseStyle = {
  margin: '20px 0',
  padding: 10,
  display: 'inline-block',
  borderRadius: 10,
  opacity: .5,
}

class Garbage extends Component {
  render() {
    const { connectDropTarget, canDrop, hovered } = this.props

    const style = {
      ...baseStyle,
      border: `5px dashed ${hovered ? '#666' : 'transparent'}`,
    }

    return connectDropTarget(
      <div style={style}>
        <img src="/assets/trash-can.png" width={100} height={100} />
      </div>
    )
  }
}

const spec = {
    drop(props, monitor) {
        const { id } = monitor.getItem()
        props.deleteEvent(id)
    }
}

const collect = (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    canDrop: monitor.canDrop(),
    hovered: monitor.isOver()
})

export default connect(null, {deleteEvent})(
  DropTarget('event', spec, collect)(Garbage)
)