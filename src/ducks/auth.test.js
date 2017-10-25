import firebase from 'firebase'
import {call, put, take} from 'redux-saga/effects'
import { 
    SIGN_IN_START,
    SIGN_IN_SUCCESS,
    SIGN_IN_ERROR,
    signIn,
    signUpSaga,
    signInSaga,
} from './auth'

describe('Sagas', () => {
    test('signInSaga success', () => {
        expect.assertions(4);

        const auth = firebase.auth()
        const email = 'email'
        const password = 'pswd'
        const payload = {email, password}
        const request = signIn(payload)
        const gen = signInSaga(request)
        const user = {the: 'user'}

        expect(gen.next().value).toEqual(take(SIGN_IN_START))

        expect(gen.next({payload}).value).toEqual(call(
            [auth, auth.signInWithEmailAndPassword], email, password))

        expect(gen.next(user).value).toEqual(put({
            type: SIGN_IN_SUCCESS,
            payload: {user},
        }))

        expect(gen.next().value).toEqual(take(SIGN_IN_START))
    })

    test('signInSaga fail', () => {
        expect.assertions(4);

        const auth = firebase.auth()
        const email = 'email'
        const password = 'pswd'
        const payload = {email, password}
        const request = signIn(payload)
        const gen = signInSaga(request)
        const error = new Error('fail')

        expect(gen.next().value).toEqual(take(SIGN_IN_START))

        expect(gen.next({payload}).value).toEqual(call(
            [auth, auth.signInWithEmailAndPassword], email, password))

        expect(gen.throw(error).value).toEqual(put({
            type: SIGN_IN_ERROR,
            payload: {error},
        }))

        expect(gen.next().value).toEqual(take(SIGN_IN_START))
    })
})
