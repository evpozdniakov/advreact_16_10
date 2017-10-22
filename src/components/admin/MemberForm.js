import React, { Component } from 'react'
import { reduxForm, Field } from 'redux-form'
import emailValidator from 'email-validator'
import ErrorField from '../common/ErrorField'

class MemberForm extends Component {
  render() {
    return (
      <form onSubmit={this.props.handleSubmit}>
          <Field component={ErrorField} label="First name" name="firstName" />
          <Field component={ErrorField} label="Last name" name="lastName" />
          <Field component={ErrorField} label="E-mail" name="email" type="email" />
          <button>Add member</button>
      </form>
    )
  }
}

const validate = values => {
    const { firstName, lastName, email } = values
    const errors = {}

    if (!firstName) {
        errors.firstName = 'First name is required.'
    }

    if (!lastName) {
        errors.lastName = 'Last name is required.'
    }

    if (!email) {
        errors.email = 'Email is required.'
    }
    else if (!emailValidator.validate(email)) {
        errors.email = 'Email is invalid.'
    }

    return errors
}

export default reduxForm({
    form: 'member',
    validate,
})(MemberForm)
