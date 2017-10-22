import React, { Component } from 'react'
import { connect } from 'react-redux'
import MemberForm from '../admin/MemberForm'
import { addMember } from '../../ducks/people'

class People extends Component {
    curryAddMember() {
        return values => {
            const { firstName, lastName, email } = values

            this.props.addMember(firstName, lastName, email)
        }
    }

    render() {
        return (
            <div>
                <h1>People</h1>
                {this.renderExistingPeople()}
                {this.renderAddForm()}
            </div>
        )
    }

    renderExistingPeople() {
        return null
    }

    renderAddForm() {
        return <MemberForm onSubmit={this.curryAddMember()} />
    }
}

export default connect(null, {
    addMember,
})(People)
