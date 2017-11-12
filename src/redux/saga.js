import {all} from 'redux-saga/effects'
import {sagas as peopleSagas} from '../ducks/people'
import {sagas as authSagas} from '../ducks/auth'
import {sagas as eventsSagas} from '../ducks/events'


export default function * () {
    yield all([
        ...peopleSagas,
        ...authSagas,
        ...eventsSagas,
    ])
}