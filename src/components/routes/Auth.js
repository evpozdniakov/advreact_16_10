import React, { Component } from 'react'
import {Route} from 'react-router-dom'
import {connect} from 'react-redux'
import {signUp, signIn} from '../../ducks/auth'
import SignIn from '../auth/SignIn'
import SignUp from '../auth/SignUp'

class AuthPage extends Component {
    static propTypes = {

    };

    render() {
        return (
            <div>
                <h2>Auth page</h2>
                <Route path = '/auth/signin' render = {() => <SignIn onSubmit = {this.handleSignIn}/>}/>
                <Route path = '/auth/signup' render = {() => <SignUp onSubmit = {this.handleSignUp}/>}/>
            </div>
        )
    }

    handleSignIn = ({email, password}) => this.props.signIn(email, password)
    handleSignUp = ({email, password}) => this.props.signUp(email, password)
}

export default connect(null, { signUp, signIn })(AuthPage)
