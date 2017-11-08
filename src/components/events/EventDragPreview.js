import React, { Component } from 'react'
import { connect } from 'react-redux'
import { eventSelector } from '../../ducks/events'

class EventDragPreview extends Component {
    render() {
        const style = {
            display: 'inline-block',
            border: '1px solid #ccc',
            borderRadius: 5,
            background: '#eee',
            transform: 'translate(-30px, -40px)',
            padding: 10,
        }

        const { event } = this.props

        return (
            <div style={style}>
                <h4 style={{margin:0}}>{event.title}</h4>
                <div>{event.where}</div>
                <div>{event.when}</div>
            </div>
        )
    }
}

export default connect((state, props) => ({
    event: eventSelector(state, props)
}))(EventDragPreview)
