import {all, takeEvery, put, call, select} from 'redux-saga/effects'
import {appName} from '../config'
import firebase from 'firebase'
import {createSelector} from 'reselect'

/**
 * Constants
 * */
export const moduleName = 'events'
const prefix = `${appName}/${moduleName}`

export const FETCH_UP_TO_REQUEST = `${prefix}/FETCH_UP_TO_REQUEST`
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
        case FETCH_UP_TO_REQUEST:
            return {
                ...clone(state),
                loading: true,
            }

        case FETCH_UP_TO_SUCCESS: {
            let clonedState = clone(state)

            return {
                ...clonedState,
                loading: false,
                entities: clonedState.entities.concat(payload.entities)
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
    return {
        type: FETCH_UP_TO_REQUEST,
        payload: {requestedNumber, resolve},
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

/**
 * Sagas
 * */

export function* fetchUpToSaga(action) {
    const eventsRef = firebase.database().ref('events')
    const loadedCount = yield select(loadedEventCountSelector)
    const lastLoadedEventUid = yield select(lastLoadedEventUidSelector)
    const { requestedNumber, resolve } = action.payload

    if (loadedCount >= requestedNumber) {
        return call(resolve)
    }

    const chunkCount = requestedNumber - loadedCount
    const query1 = yield call([eventsRef, eventsRef.orderByKey])
    const query2 = yield call([query1, query1.limitToFirst], chunkCount)
    const query3 = yield call([query2, query2.startAt], lastLoadedEventUid || '')
    const snapshot = yield call([query3, query3.once], 'value')
    const loadedEventKyes = yield select(loadedEventKyesSelector)
    const entities = yield call(filterEntities, snapshot, loadedEventKyes)

    yield put({
        type: FETCH_UP_TO_SUCCESS,
        payload: {entities},
    })

    return call(resolve)
}

export function* saga() {
    yield all([
        takeEvery(FETCH_UP_TO_REQUEST, fetchUpToSaga),
    ])
}

function filterEntities(snapshot, loadedEventKyes) {
    const rawEntities = snapshot.val()

    return Object.keys(rawEntities)
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
}
