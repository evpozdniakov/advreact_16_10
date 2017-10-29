// import {all, takeEvery, put, call} from 'redux-saga/effects'
import {appName} from '../config'
import firebase from 'firebase'
// import {createSelector} from 'reselect'

/**
 * Constants
 * */
export const moduleName = 'events'
const prefix = `${appName}/${moduleName}`

export const FETCH_FIRST_20 = `${prefix}/FETCH_FIRST_20`
export const FETCH_FIRST_20_SUCCESS = `${prefix}/FETCH_FIRST_20_SUCCESS`
export const FETCH_FROM_21_TO_40 = `${prefix}/FETCH_FROM_21_TO_40`
export const FETCH_FROM_21_TO_40_SUCCESS = `${prefix}/FETCH_FROM_21_TO_40_SUCCESS`
export const FETCH_FROM_TO = `${prefix}/FETCH_FROM_TO`

/**
 * Reducer
 * */

function getInitState() {
    return {
        loading: false,
        entities: [],
    }
}

function clone(state) {
    return {
        ...state,
        entities: state.entities.map(item => ({...item})),
    }
}

export default function reducer(state=getInitState(), action) {
    const { type, payload } = action

    switch (type) {
        case FETCH_FIRST_20:
        case FETCH_FROM_21_TO_40:
            return {
                ...clone(state),
                loading: true,
            }

        case FETCH_FIRST_20_SUCCESS:
            return {
                ...clone(state),
                loading: false,
                entities: payload.entities,
            }

        case FETCH_FROM_21_TO_40_SUCCESS: {
            let clonedState = clone(state)
            let { entities } = clonedState

            payload.entities.forEach((item, index) => {
                entities[20 + index] = item
            })

            return {
                ...clone(state),
                loading: false,
                entities,
            }
        }

        default:
            return state
    }
}


/**
 * Action creators
 * */

export function fetchFirst20() {
    return dispatch => {
        dispatch({type: FETCH_FIRST_20})

        firebase.database().ref('events')
            .orderByKey()
            .limitToFirst(20)
            .once('value', snapshot => {
                const rawEntities = Object.keys(snapshot.val())

                const entities = rawEntities.map(key => ({
                    key,
                    ...rawEntities[key],
                }))

                dispatch({
                    type: FETCH_FIRST_20_SUCCESS,
                    payload: {entities}
                })
            })

    }
}

export function fetchFrom21to40() {
    return (dispatch, getState) => {
        dispatch({type: FETCH_FIRST_20})

        debugger
        const { entities=[] } = getState().events
        debugger
        const keyAtInde19 = entities[19].key



        firebase.database().ref('events')
            .orderByKey()
            .limitToFirst(20)
            .startAt(keyAtInde19)
            .once('value', snapshot => {
                const rawEntities = Object.keys(snapshot.val())

                const entities = rawEntities.map(key => ({
                    key,
                    ...rawEntities[key],
                }))

                dispatch({
                    type: FETCH_FROM_21_TO_40_SUCCESS,
                    payload: {entities}
                })
            })

    }
}
