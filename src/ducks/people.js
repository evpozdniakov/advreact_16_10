import {Record} from 'immutable'
import {reset} from 'redux-form';
import {appName} from '../config'
import {createSelector} from 'reselect'

export const moduleName = 'people'

const prefix = `${appName}/${moduleName}`

/* constants */
export const ADD_MEMBER = `${prefix}/ADD_MEMBER`

/* reducer */
const ReducerRecord = Record({
    items: [],
})

export default function reducer(state = new ReducerRecord(), action) {
    const { type, payload } = action

    switch (type) {
        case ADD_MEMBER:
            return state
                .set('items', state.get('items').concat(payload.user))

        default:
            return state
    }
}

/* action creators */
export function addMember(firstName, lastName, email) {
    const user = {firstName, lastName, email}

    return dispatch => {
        dispatch({
            type: ADD_MEMBER,
            payload: {user},
        })

        dispatch(reset('member'))
    }
}

/* selectors */
export const stateSelector = state => state[moduleName]
export const membersSelector = createSelector(stateSelector, state => state.items)
