import React, { Component } from 'react'
import Submenu from '../common/Submenu'
import { Route } from 'react-router-dom'
import People from './People'

class Admin extends Component {
    static propTypes = {

    };

    render() {
        const links = [{
            to: '/admin/people',
            title: 'People',
        }, {
            to: '/admin/stats',
            title: 'Stats',
        }, {
            to: '/admin/whatever',
            title: 'Whatever',
        }]

        return (
            <div>
                <h2>Admin Page</h2>
                <Submenu links={links} />
                <Route path="/admin/people" component={People} />
            </div>
        )
    }
}

export default Admin