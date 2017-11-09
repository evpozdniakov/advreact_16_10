import React, { Component } from 'react'
import EventsTable from '../events/VirtualizedLazyTable'
import Garbage from '../common/Garbage'

class EventsPage extends Component {
    static propTypes = {

    };

    render() {
        return (
            <div>
                <EventsTable />
                <Garbage />
            </div>
        )
    }
}

export default EventsPage