import {all, takeEvery, put, call, select} from 'redux-saga/effects'
import {Record, OrderedMap, OrderedSet} from 'immutable'
import firebase from 'firebase'
import {createSelector} from 'reselect'
import {appName} from '../config'
import {fbToEntities} from './utils'

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

export const ReducerRecord = Record({
    loading: false,
    loaded: false,
    entities: new OrderedMap({}),
    selected: new OrderedSet([])
})

export const EventRecord = Record({
    uid: null,
    month: null,
    submissionDeadline: null,
    title: null,
    url: null,
    when: null,
    where: null
})

export default function reducer(state=new ReducerRecord(), action) {
    const { type, payload } = action

    switch (type) {
        case FETCH_UP_TO_REQUEST:
            return state.set('loading', true)

        case FETCH_UP_TO_SUCCESS: {
            let newEntities = fbToEntities(payload.entities, EventRecord)

            return state
                .set('loading', false)
                .set('entities', state.get('entities').merge(newEntities))
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
export const loadedEventSelector = createSelector(stateSelector, state => state.get('entities').toArray())
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
    const entities = snapshot.val()

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
