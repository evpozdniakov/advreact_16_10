import {appName} from '../config'
import {Record} from 'immutable'
import firebase from 'firebase'
import {createSelector} from 'reselect'

/**
 * Constants
 * */
export const moduleName = 'auth'
const prefix = `${appName}/${moduleName}`

export const SIGN_UP_START = `${prefix}/SIGN_UP_START`
export const SIGN_UP_SUCCESS = `${prefix}/SIGN_UP_SUCCESS`
export const SIGN_UP_ERROR = `${prefix}/SIGN_UP_ERROR`

export const SIGN_IN_START = `${prefix}/SIGN_IN_START`
export const SIGN_IN_SUCCESS = `${prefix}/SIGN_IN_SUCCESS`
export const SIGN_IN_ERROR = `${prefix}/SIGN_IN_ERROR`


/**
 * Reducer
 * */
export const ReducerRecord = Record({
    user: null,
    loading: false,
    error: null
})

export default function reducer(state = new ReducerRecord(), action) {
    const {type, payload} = action

    switch (type) {
        case SIGN_UP_START:
        case SIGN_IN_START:
            return state.set('loading', true)

        case SIGN_UP_SUCCESS:
        case SIGN_IN_SUCCESS:
            return state
                .set('user', payload.user)
                .set('loading', false)

        case SIGN_UP_ERROR:
        case SIGN_IN_ERROR:
            return state
                .set('error', payload.error)
                .set('loading', false)

        default:
            return state
    }
}

/**
 * Selectors
 * */

export const stateSelector = state => state[moduleName]
export const userSelector = createSelector(stateSelector, state => state.user)

/**
 * Action Creators
 * */
export function signUp(email, password) {
    return (dispatch) => {
        dispatch({
            type: SIGN_UP_START
        })

        firebase.auth().createUserWithEmailAndPassword(email, password)
            .then(user => dispatch({
                type: SIGN_UP_SUCCESS,
                payload: { user }
            }))
            .catch(error => dispatch({
                type: SIGN_UP_ERROR,
                payload: { error }
            }))
    }
}

export function signIn(email, password) {
    return (dispatch) => {
        dispatch({
            type: SIGN_IN_START
        })

        firebase.auth().signInWithEmailAndPassword(email, password)
            .then(user => dispatch({
                type: SIGN_IN_SUCCESS,
                payload: { user }
            }))
            .catch(error => dispatch({
                type: SIGN_IN_ERROR,
                payload: { error }
            }))
    }
}

firebase.auth().onAuthStateChanged(user => {
    if (!user) return

    window.store.dispatch({
        type: SIGN_IN_SUCCESS,
        payload: { user }
    })
})