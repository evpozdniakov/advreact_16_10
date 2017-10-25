import React, { Component } from 'react'
import {Route} from 'react-router-dom'
import {connect} from 'react-redux'
import {userAuthorizedSelector} from '../../ducks/auth'

class ProtectedRoute extends Component {
    static propTypes = {

    };

    render() {
        const {component, ...rest} = this.props
        return <Route {...rest} render = {this.renderRoute}/>
    }

    renderRoute = (...args) => {
        const {authorized} = this.props
        const AuthorizedComponent = this.props.component
        return authorized ? <AuthorizedComponent {...args} /> : <h2>UnAuthorized</h2>
    }
}

export default connect(state => ({
    authorized: userAuthorizedSelector(state)
}), null, null, { pure: false })(ProtectedRoute)
