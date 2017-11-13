import React, { Component } from 'react'
import {connect} from 'react-redux'
// import {List} from 'react-virtualized'
import { TransitionMotion, spring } from 'react-motion'
import {fetchAll, peopleListSelector} from '../../ducks/people'
import PersonRow from './PersonRow'

class PeopleList extends Component {
    static propTypes = {

    };

    componentDidMount() {
        // this.props.fetchAll()
    }

    getStyles() {
        return this.props.people.map(person => ({
            key: person.uid,
            style: {height: spring(100)},
            data: person,
        }))
    }

    getDefaultStyles() {
        return this.props.people.map(person => ({
            key: person.uid,
            style: {height: 0},
            data: person,
        }))
    }

    render() {
        return (
            <div style={{
                marginTop: '1rem',
                background: '#eee',
                height: 300,
                overflow: 'auto',
            }}>
                <TransitionMotion
                    willEnter={() => ({height: 0})}
                    styles={this.getStyles()}
                    defaultStyles={this.getDefaultStyles()}
                >{
                    interpolated => (
                        <div>
                            {interpolated.map(this.renderPersonRow)}
                        </div>
                    )}
                </TransitionMotion>
            </div>
        )
    }

    renderPersonRow(element) {
        const { key, style, data } = element

        return <PersonRow key={key} person={element.data} style={{...style, overflow: 'hidden'}} />
    }
}

export default connect(state => ({
    people: peopleListSelector(state),
}), { fetchAll })(PeopleList)
