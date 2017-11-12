import React, { Component } from 'react'
import {connect} from 'react-redux'
import {List} from 'react-virtualized'
import {fetchAll, peopleListSelector} from '../../ducks/people'
import PersonRow from './PersonRow'

class PeopleList extends Component {
    static propTypes = {

    };

    componentDidMount() {
        // this.props.fetchAll()
    }

    render() {
        return (
            <List
                rowCount={this.props.people.length}
                height={200}
                width={500}
                rowHeight={100}
                rowRenderer={this.rowRenderer}
            />
        )
    }

    rowRenderer = ({ index, key, style }) => <PersonRow person = {this.props.people[index]} key = {key} style = {style}/>
}

export default connect(state => ({
    people: peopleListSelector(state)
}), { fetchAll })(PeopleList)