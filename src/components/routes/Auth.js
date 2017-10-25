import React, { Component } from 'react'
import {Route, NavLink} from 'react-router-dom'
import {connect} from 'react-redux'
import {signUp, signIn, errorMessage} from '../../ducks/auth'
import SignIn from '../auth/SignIn'
import SignUp from '../auth/SignUp'

class AuthPage extends Component {
    static propTypes = {

    };

    render() {
        return (
            <div>
                <h2>Auth page</h2>
                <Route path = '/auth/signin' render = {this.renderSignIn.bind(this)}/>
                <Route path = '/auth/signup' render = {() => <SignUp onSubmit = {this.handleSignUp}/>}/>
            </div>
        )
    }

    renderSignIn() {
        const props = {
            onSubmit: this.handleSignIn,
            signInError: this.props.error,
        }

        return <SignIn {...props} />
    }

    handleSignIn = ({email, password}) => this.props.signIn(email, password)
    handleSignUp = ({email, password}) => this.props.signUp(email, password)
}

export default connect(state => ({
    error: errorMessage(state)
}), { signIn, signUp, errorMessage })(AuthPage)
