const assert = require('assert')
const api = require('../api')
const ContextStrategy = require('../db/strategies/base/contextStrategy')
const Postgres = require('../db/strategies/postgres/postgres')
const UserSchema = require('../db/strategies/postgres/schemas/userSchemas')
const PasswordHelper = require('../helpers/passwordHelper')


let app = {}
let context = {}
let connection = {}
const USER = {
    username: 'test_user_1',
    password: 'test123'
}
let USER_DB = {}
let userId = {}
describe('Auth test suite', function(){
    this.beforeAll(async function(){
        app = await api
        connection = await Postgres.connect()
        const model = await Postgres.defineModel(connection, UserSchema)
        context = new ContextStrategy(new Postgres(connection, model))
        hash = await PasswordHelper.hashPassword(USER.password)
        USER_DB = {
            ...USER,
            password: hash
        }
        const {id} = await context.create(USER_DB)
        userId = id
    })
    this.afterAll(async function(){
        console.log('stopping hapi server')
        await context.delete(userId)
        await connection.close()
        app.stop({ timeout: 10000 }).then(function (err) {
          console.log('hapi server stopped')
        })
    })
    it('obter token', async function () {
        const result = await app.inject({
            method: 'POST',
            url: '/login',
            payload: USER
        })
        const dados = JSON.parse(result.payload)
        const statusCode = result.statusCode
        assert.deepEqual(statusCode, 200)
        assert.ok(dados.token.length > 10)
    })
    it('obter token - invalid user', async function () {
        const result = await app.inject({
            method: 'POST',
            url: '/login',
            payload: {
                ...USER,
                username: 'invalid username'
            }
        })
        const statusCode = result.statusCode
        assert.deepEqual(statusCode, 401)
    })
    it('obter token - invalid password', async function () {
        const result = await app.inject({
            method: 'POST',
            url: '/login',
            payload: {
                ...USER,
                password: 'invalid'
            }
        })
        const statusCode = result.statusCode
        assert.deepEqual(statusCode, 401)
    })
})