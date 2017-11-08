import {all, takeEvery, put, call, take, select} from 'redux-saga/effects'
import {appName} from '../config'
import {Record, OrderedMap, OrderedSet} from 'immutable'
import firebase from 'firebase'
import {createSelector} from 'reselect'
import {fbToEntities} from './utils'

/**
 * Constants
 * */
export const moduleName = 'events'
const prefix = `${appName}/${moduleName}`

export const FETCH_ALL_REQUEST = `${prefix}/FETCH_ALL_REQUEST`
export const FETCH_ALL_START = `${prefix}/FETCH_ALL_START`
export const FETCH_ALL_SUCCESS = `${prefix}/FETCH_ALL_SUCCESS`
export const FETCH_LAZY_REQUEST = `${prefix}/FETCH_LAZY_REQUEST`
export const FETCH_LAZY_START = `${prefix}/FETCH_LAZY_START`
export const FETCH_LAZY_SUCCESS = `${prefix}/FETCH_LAZY_SUCCESS`

export const DELETE_EVENT_REQUEST = `${prefix}/DELETE_EVENT_REQUEST`
export const DELETE_EVENT_START = `${prefix}/DELETE_EVENT_START`
export const DELETE_EVENT_SUCCESS = `${prefix}/DELETE_EVENT_SUCCESS`
export const DELETE_EVENT_FAIL = `${prefix}/DELETE_EVENT_FAIL`

export const SELECT_EVENT = `${prefix}/SELECT_EVENT`


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

export default function reducer(state = new ReducerRecord(), action) {
    const {type, payload} = action

    switch (type) {
        case FETCH_ALL_START:
        case FETCH_LAZY_START:
            return state.set('loading', true)

        case FETCH_ALL_SUCCESS:
            return state
                .set('loading', false)
                .set('loaded', true)
                .set('entities', fbToEntities(payload, EventRecord))

        case FETCH_LAZY_SUCCESS:
            return state
                .set('loading', false)
                .mergeIn(['entities'], fbToEntities(payload, EventRecord))
                .set('loaded', Object.keys(payload).length < 10)

        case SELECT_EVENT:
            return state.update('selected', selected => selected.add(payload.uid))

        case DELETE_EVENT_SUCCESS:
            return state
                .set('entities', state.entities.delete(payload.uid))
                .set('selected', state.selected.delete(payload.uid))
                // TODO: clean up selected

        default:
            return state
    }
}

/**
 * Selectors
 * */

export const stateSelector = state => state[moduleName]
export const entitiesSelector = createSelector(stateSelector, state => state.entities)
export const loadingSelector = createSelector(stateSelector, state => state.loading)
export const loadedSelector = createSelector(stateSelector, state => state.loaded)
export const selectionSelector = createSelector(stateSelector, state => state.selected.toArray())
export const eventListSelector = createSelector(entitiesSelector, entities => entities.valueSeq().toArray())
export const selectedEventsSelector = createSelector(entitiesSelector, selectionSelector, (entities, selection) =>
    selection.map(uid => entities.get(uid))
)

/**
 * Action Creators
 * */

export function fetchAllEvents() {
    return {
        type: FETCH_ALL_REQUEST
    }
}

export function selectEvent(uid) {
    return {
        type: SELECT_EVENT,
        payload: { uid }
    }
}

export function fetchLazy() {
    return {
        type: FETCH_LAZY_REQUEST
    }
}

export function deleteEvent(uid) {
    return {
        type: DELETE_EVENT_REQUEST,
        payload: {uid},
    }
}

/**
 * Sagas
 * */

export function* fetchAllSaga() {
    const ref = firebase.database().ref('events')

    yield put({
        type: FETCH_ALL_START
    })

    const snapshot = yield call([ref, ref.once], 'value')

    yield put({
        type: FETCH_ALL_SUCCESS,
        payload: snapshot.val()
    })
}

export const fetchLazySaga = function * () {
    while (true) {
        yield take(FETCH_LAZY_REQUEST)

        const state = yield select(stateSelector)

        if (state.loading || state.loaded) continue
//        if (state.loaded) return

        yield put({
            type: FETCH_LAZY_START
        })

        const lastEvent = state.entities.last()

        const ref = firebase.database().ref('events')
            .orderByKey()
            .limitToFirst(10)
            .startAt(lastEvent ? lastEvent.uid : '')

        const data = yield call([ref, ref.once], 'value')

        yield put({
            type: FETCH_LAZY_SUCCESS,
            payload: data.val()
        })
    }
}

export const deleteEventSaga = function * (action) {
    yield put({
        type: DELETE_EVENT_START,
    })

    const { payload } = action
    const ref = firebase.database().ref(`events/${payload.uid}`)

    try {
        yield call([ref, ref.remove])

        yield put({
            type: DELETE_EVENT_SUCCESS,
            payload,
        })
    }
    catch (error) {
        yield put({
            type: DELETE_EVENT_FAIL,
            payload: {error}
        })
    }
}

//lazy fetch FB
/*
firebase.database().ref('events')
    .orderByKey()
    .limitToFirst(10)
    .startAt(lastUid)

*/
export function* saga() {
    yield all([
        takeEvery(FETCH_ALL_REQUEST, fetchAllSaga),
        takeEvery(DELETE_EVENT_REQUEST, deleteEventSaga),
        fetchLazySaga()
    ])
}