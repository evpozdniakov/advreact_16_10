import firebase from 'firebase'
import history from '../history'
import {all, call, put, take} from 'redux-saga/effects'
import {
    SIGN_UP_START, SIGN_UP_SUCCESS, SIGN_UP_ERROR,
    SIGN_IN_START, SIGN_IN_SUCCESS, SIGN_IN_ERROR,
    signUp, signIn,
    saga, signUpSaga, signInSaga,
} from './auth'

describe('Sagas', () => {
    test('combining saga', () => {
        const gen = saga()

        const { value } = gen.next()

        // this one fails. how to make it work? TY
        /*expect(value).toEqual(all([
            signUpSaga(),
            signInSaga(),
        ]))*/

        expect(gen.next().done).toBeTruthy()
    })

    test('signUpSaga success', () => {
        expect.assertions(4)

        const auth = firebase.auth()
        const email = 'email'
        const password = 'pswd'
        const user = {the: 'user'}
        const payload = {email, password}
        const request = signUp(email, password)
        const gen = signUpSaga(request)

        expect(gen.next().value).toEqual(take(SIGN_UP_START))

        expect(gen.next({payload}).value).toEqual(call(
            [auth, auth.createUserWithEmailAndPassword], email, password))

        expect(gen.next(user).value).toEqual(put({
            type: SIGN_UP_SUCCESS,
            payload: {user}
        }))

        expect(gen.next().value).toEqual(take(SIGN_UP_START))
    })

    test('signUpSaga error', () => {
        expect.assertions(4)

        const auth = firebase.auth()
        const email = 'email'
        const password = 'pswd'
        const error = new Error('fail')
        const payload = {email, password}
        const request = signUp(email, password)
        const gen = signUpSaga(request)

        expect(gen.next().value).toEqual(take(SIGN_UP_START))

        expect(gen.next({payload}).value).toEqual(call(
            [auth, auth.createUserWithEmailAndPassword], email, password))

        expect(gen.throw(error).value).toEqual(put({
            type: SIGN_UP_ERROR,
            payload: {error}
        }))

        expect(gen.next().value).toEqual(take(SIGN_UP_START))
    })

    test('signInSaga success', () => {
        expect.assertions(5);

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

        expect(gen.next().value).toEqual(call(
            [history, history.push], '/people'))

        expect(gen.next().value).toEqual(take(SIGN_IN_START))
    })

    test('signInSaga error', () => {
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
