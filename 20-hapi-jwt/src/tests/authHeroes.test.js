const assert = require('assert')
const api = require('../api')

let app = {}
describe('Auth test suite', function(){
    this.beforeAll(async function(){
        app = await api

    })
    this.afterAll(async function(){
        console.log('stopping hapi server')

        app.stop({ timeout: 10000 }).then(function (err) {
          console.log('hapi server stopped')
        })
    })
    it('obter token', async function () {
        const result = await app.inject({
            method: 'POST',
            url: '/login',
            payload: {
                username: 'test',
                password: 'test123'
            }
        })
        const dados = JSON.parse(result.payload)
        const statusCode = result.statusCode
        assert.deepEqual(statusCode, 200)
        assert.ok(dados.token.length > 10)
    })
    it('obter token - invalid', async function () {
        const result = await app.inject({
            method: 'POST',
            url: '/login',
            payload: {
                username: 'invalid username',
                password: 'test123'
            }
        })
        const statusCode = result.statusCode
        assert.deepEqual(statusCode, 401)
    })
})