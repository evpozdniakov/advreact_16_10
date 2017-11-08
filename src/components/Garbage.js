import React, { Component } from 'react'
import { connect } from 'react-redux'
import {DropTarget} from 'react-dnd'
import { deleteEvent } from '../ducks/events'

const baseStyle = {
  width: 100,
  height: 100,
  background: '#fcc',
  margin: 20,
  borderRadius: 10,
}

class Garbage extends Component {
  render() {
    const { connectDropTarget, canDrop, hovered } = this.props

    const style = {
      ...baseStyle,
      border: `5px dashed ${hovered ? '#f66' : 'transparent'}`,
    }

    return connectDropTarget(
      <div style={style}>Garbage</div>
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