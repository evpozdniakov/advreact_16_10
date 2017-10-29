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
        lastLoadedIndex: -1,
        lastLoadedUid: null,
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
            let lastLoadedIndex = payload.entities.length - 1
            let lastLoadedUid = payload.entities[lastLoadedIndex].uid

            return {
                ...clone(state),
                loading: false,
                entities: payload.entities,
                lastLoadedIndex,
                lastLoadedUid,
            }
        }

        default:
            return state
    }
}


/**
 * Action creators
 * */

export function fetchUpTo(limit, resolve) {
    return (dispatch, getState) => {
        const {
            lastLoadedIndex,
            lastLoadedUid,
        } = getState().events

        const loadedCount = lastLoadedIndex === null ? 0 : lastLoadedIndex + 1

        if (loadedCount >= limit) {
            resolve()
            return
        }

        dispatch({
            type: FETCH_UP_TO,
            payload: {limit, resolve},
        })

        firebase.database().ref('events')
            .orderByKey()
            .limitToFirst(limit - loadedCount)
            .startAt(lastLoadedUid || '')
            .once('value', snapshot => {
                const rawEntities = snapshot.val()

                const newEntities = Object.keys(rawEntities).map(uid => ({
                    uid,
                    ...rawEntities[uid],
                }))

                const entities = getState().events.entities.concat(newEntities)

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
export const eventListSelector = createSelector(stateSelector, state => state.entities)
export const lastLoadedIndexSelector = createSelector(stateSelector, state => state.lastLoadedIndex)
