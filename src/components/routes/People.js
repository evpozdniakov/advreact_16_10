import React, { Component } from 'react'
import { connect } from 'react-redux'
import MemberForm from '../admin/MemberForm'

class People extends Component {
    curryAddMember() {
        return values => {
            console.log('--- values:', values)
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

export default People
