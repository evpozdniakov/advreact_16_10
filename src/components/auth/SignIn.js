import React, { Component } from 'react'
import {reduxForm, Field} from 'redux-form'

class SignIn extends Component {
    static propTypes = {

    };

    render() {
        return (
            <div>
                <h3>Sign In</h3>
                <form onSubmit = {this.props.handleSubmit}>
                    <div>
                        email: <Field name = 'email' component = 'input' type = 'text'/>
                    </div>
                    <div>
                        password: <Field name = 'password' component = 'input' type = 'password'/>
                    </div>
                    <div>
                        <input type = 'submit'/>
                    </div>
                    {this.renderError()}
                </form>
            </div>
        )
    }

    renderError() {
        const { signInError } = this.props

        if (!signInError) {
            return null
        }

        return <p className="error">{signInError}</p>
    }
}

export default reduxForm({
    form: 'auth'
})(SignIn)
