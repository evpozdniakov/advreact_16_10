import React, { Component } from 'react'

class ErrorField extends Component {
    static propTypes = {

    };

    render() {
        const {input, meta, type, label} = this.props
        const {error, touched} = meta || {}
        const errorText = touched && error && <div style = {{color: 'red'}}>{error}</div>
        return (
            <div className="error-field">
                {label}<br/>
                <input {...input} type = {type} />
                {errorText}
            </div>
        )
    }
}

export default ErrorField