import React, { Component } from 'react'
import {Route, NavLink} from 'react-router-dom'
import {connect} from 'react-redux'
import firebase from 'firebase'
import ProtectedRoute from './common/ProtectedRoute'
import AdminPage from './routes/Admin'
import AuthPage from './routes/Auth'
import PersonPage from './routes/PersonPage'
import Submenu from './common/Submenu'
import {userAuthorized} from '../ducks/auth'

class App extends Component {
    static propTypes = {

    };

    render() {
        return (
            <div>
                <h1>Hello world</h1>
                {this.renderSubmenu()}
                <ProtectedRoute path = '/admin' component = {AdminPage}/>
                <ProtectedRoute path = '/people' component={PersonPage}/>
                <Route path = '/auth' component = {AuthPage}/>
            </div>
        )
    }

    renderSubmenu() {
        const links = []

        if (this.props.authorized) {
            links.push({
                to: '/admin',
                title: 'Admin',
            }, {
                to: '/people',
                title: 'People',
            }, {
                to: '/logout',
                title: 'Logout',
            })
        }
        else {
            links.push({
                to: '/auth/signin',
                title: 'Sign in',
            }, {
                to: '/auth/signup',
                title: 'Sign up',
            })
        }

        const props = {
            links,
        }

        return <Submenu {...props} />
    }
}

export default connect(state => ({
    authorized: userAuthorized(state)
}), null, null, { pure: false })(App)
