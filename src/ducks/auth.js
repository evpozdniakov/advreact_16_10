import {appName} from '../config'
import {Record} from 'immutable'
import firebase from 'firebase'
import {createSelector} from 'reselect'
import {call, put, all, take} from 'redux-saga/effects'

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
            return state
                .set('loading', true)
                .set('error', null)

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
export const userAuthorized = createSelector(stateSelector, state => !!state.user)
export const errorMessage = createSelector(stateSelector, state => state.error && state.error.message || '')

/**
 * Action Creators
 * */
export function signUp(email, password) {
    return {
        type: SIGN_UP_START,
        payload: { email, password }
    }
}

export function signIn(email, password) {
    return {
        type: SIGN_IN_START,
        payload: { email, password }
    }
}

firebase.auth().onAuthStateChanged(user => {
    if (!user) return

    window.store.dispatch({
        type: SIGN_IN_SUCCESS,
        payload: { user }
    })
})

/**
 * Sagas
 **/

export function * signUpSaga() {
    const auth = firebase.auth()

    while (true) {
        const {payload} = yield take(SIGN_UP_START)

        try {
            const user = yield call([auth, auth.createUserWithEmailAndPassword], payload.email, payload.password)
            //const user = apply(auth, createUserWithEmailAndPassword, [email, password])

            yield put({
                type: SIGN_UP_SUCCESS,
                payload: {user}
            })
        } catch (error) {
            yield put({
                type: SIGN_UP_ERROR,
                payload: {error}
            })
        }
    }
}

export function * signInSaga() {
    const auth = firebase.auth()

    while (true) {
        const action = yield take(SIGN_IN_START)
        const { email, password } = action.payload

        try {
            const user = yield call([auth, auth.signInWithEmailAndPassword], email, password)

            yield put({
                type: SIGN_IN_SUCCESS,
                payload: {user},
            })
        }
        catch (error) {
            yield put({
                type: SIGN_IN_ERROR,
                payload: {error},
            })
        }
    }
}

export function * saga() {
    yield all([
        signUpSaga(),
        signInSaga(),
    ])
}
