import React, { Component } from 'react'
import { connect } from 'react-redux'
import MemberForm from '../admin/MemberForm'
import { addMember, membersSelector } from '../../ducks/people'

class People extends Component {
    get members() {
        return this.props.members
    }

    get hasMembers() {
        return this.members.length > 0
    }

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
                <div className="members-ui">
                    {this.renderMembers()}
                    {this.renderAddForm()}
                </div>
            </div>
        )
    }

    renderMembers() {
        if (!this.hasMembers) {
            return <p className="no-members">There is no members yet.</p>
        }

        return (
            <ul>
                {this.members.map(this.renderMember.bind(this))}
            </ul>
        )
    }

    renderMember(item) {
        const { firstName, lastName, email } = item

        return (
            <li>
                {firstName} {lastName} <a href={`mailto:${email}`}>{email}</a>
            </li>
        )
    }

    renderAddForm() {
        return <MemberForm onSubmit={this.curryAddMember()} />
    }
}

export default connect(state => {
    return {
        members: membersSelector(state)
    }
}, {
    addMember,
})(People)
