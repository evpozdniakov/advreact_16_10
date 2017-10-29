import React, { Component } from 'react'
import EventsTable2 from '../events/EventTableVirtualized2'

class EventsPage2 extends Component {
    static propTypes = {

    };

    render() {
        return (
            <div>
                {<EventsTable2 />}
            </div>
        )
    }
}

export default EventsPage2