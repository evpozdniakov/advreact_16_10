// import {all, takeEvery, put, call} from 'redux-saga/effects'
import {appName} from '../config'
import firebase from 'firebase'
import {createSelector} from 'reselect'

/**
 * Constants
 * */
export const moduleName = 'events'
const prefix = `${appName}/${moduleName}`

export const FETCH_UP_TO = `${prefix}/FETCH_UP_TO`
export const FETCH_UP_TO_SUCCESS = `${prefix}/FETCH_UP_TO_SUCCESS`

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
        case FETCH_UP_TO:
            return {
                ...clone(state),
                loading: true,
            }

        case FETCH_UP_TO_SUCCESS: {
            return {
                ...clone(state),
                loading: false,
                entities: payload.entities,
            }
        }

        default:
            return state
    }
}


/**
 * Action creators
 * */

export function fetchUpTo(requestedNumber, resolve) {
    return (dispatch, getState) => {
        const state = getState()
        const loadedCount = loadedEventCountSelector(state)
        const lastLoadedEventUid = lastLoadedEventUidSelector(state)

        if (loadedCount >= requestedNumber) {
            resolve()
            return
        }

        dispatch({
            type: FETCH_UP_TO,
            payload: {requestedNumber, resolve},
        })

        const chunkCount = requestedNumber - loadedCount

        firebase.database().ref('events')
            .orderByKey()
            .limitToFirst(chunkCount + 2)
            .startAt(lastLoadedEventUid || '')
            .once('value', snapshot => {
                const state = getState()
                const loadedEventKyes = loadedEventKyesSelector(state)
                const rawEntities = snapshot.val()

                const newEntities = Object.keys(rawEntities)
                    .reduce((uniq, uid) => {
                        if (loadedEventKyes.includes(uid)) {
                            return uniq
                        }

                        if (uniq.includes(uid)) {
                            return uniq
                        }

                        return uniq.concat(uid)
                    }, [])
                    .map(uid => ({
                        uid,
                        ...rawEntities[uid],
                    }))

                const entities = state.events.entities.concat(newEntities)

                dispatch({
                    type: FETCH_UP_TO_SUCCESS,
                    payload: {entities},
                })

                resolve()
            })
    }
}

/**
 * Selectors
 * */

export const stateSelector = state => state[moduleName]
export const loadedEventSelector = createSelector(stateSelector, state => state.entities)
export const loadedEventKyesSelector = createSelector(loadedEventSelector, loadedEvents => loadedEvents.map(item => item.uid))
export const loadedEventCountSelector = createSelector(loadedEventSelector, loadedEvents => loadedEvents.length)
export const lastLoadedEventSelector = createSelector(loadedEventSelector, loadedEventCountSelector, (loadedEvents, loadedEventCount) => loadedEvents[loadedEventCount - 1] || {})
export const lastLoadedEventUidSelector = createSelector(lastLoadedEventSelector, lastLoadedEvent => lastLoadedEvent.uid || '')
