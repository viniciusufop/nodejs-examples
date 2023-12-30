const assert = require('assert')
const api = require('../api')
const ContextStrategy = require('../db/strategies/base/contextStrategy')
const Postgres = require('../db/strategies/postgres/postgres')
const UserSchema = require('../db/strategies/postgres/schemas/userSchemas')
const PasswordHelper = require('../helpers/passwordHelper')


const MOCK_HEROI_CADASTRAR = {
    nome: 'Chapolim Colorado',
    poder: 'Marreta Bionica'
}
const MOCK_HEROI_INICIAL = {
    nome: 'Gavião Negro',
    poder: 'Flexas'
}
const MOCK_HEROI_PARA_DELETAR = {
    nome: 'Batman',
    poder: 'Dinheiro'
}
let MOCK_HEROI_PARA_DELETAR_ID = {}
let MOCK_HEROI_INICIAL_ID = {} 
let headers = {}
let app = {}
const USER = {
    username: 'test_user_' + new Date().getTime(),
    password: 'test123'
}
let USER_DB = {}
let userId = {}
describe('Suite de testes API Heroes', function(){
    this.timeout(Infinity)
    this.beforeAll(async function(){
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

        app = await api
        const authentication = await app.inject({
            method: 'POST',
            url: `/login`,
            payload: USER
        })
        const {token} = JSON.parse(authentication.payload)
        headers = {'Authorization': `Bearer ${token}`}
        const result = await app.inject({
            method: 'POST',
            url: `/heroes`,
            headers,
            payload: MOCK_HEROI_INICIAL
        })
        const statusCode = result.statusCode
        assert.deepEqual(statusCode, 201)
        const payload1 = JSON.parse(result.payload)
        MOCK_HEROI_INICIAL_ID = payload1._id

        const result2 = await app.inject({
            method: 'POST',
            url: `/heroes`,
            headers,
            payload: MOCK_HEROI_PARA_DELETAR
        })
        const statusCode2 = result2.statusCode
        assert.deepEqual(statusCode2, 201)
        const payload2 = JSON.parse(result2.payload)
        MOCK_HEROI_PARA_DELETAR_ID = payload2._id
    })
    this.afterAll(async function(){
        console.log('stopping hapi server')        
        await context.delete(userId)
        await connection.close()
        app.stop({ timeout: 10000 }).then(function (err) {
          console.log('hapi server stopped')
        })
    })
    it('listar heroes', async function () {
        const result = await app.inject({
            method: 'GET',
            url: '/heroes',
            headers
        })
        const dados = JSON.parse(result.payload)
        const statusCode = result.statusCode
        assert.deepEqual(statusCode, 200)
        assert.ok(Array.isArray(dados))
    })
    it('listar heroes - retornar apenas 1 registros', async function () {
        const TAMANHO_LIMITE = 1
        const result = await app.inject({
            method: 'GET',
            url: `/heroes?skip=0&limit=${TAMANHO_LIMITE}`,
            headers
        })
        const dados = JSON.parse(result.payload)
        const statusCode = result.statusCode
        assert.deepEqual(statusCode, 200)
        assert.deepEqual(dados.length, TAMANHO_LIMITE)
    })
    it('listar heroes - invalid limit', async function () {
        const TAMANHO_LIMITE = 'AAAA'
        const result = await app.inject({
            method: 'GET',
            url: `/heroes?skip=0&limit=${TAMANHO_LIMITE}`,
            headers
        })
        const statusCode = result.statusCode
        assert.deepEqual(statusCode, 400)
    })
    it('Cadastrar POST heroes', async function () {
        const result = await app.inject({
            method: 'POST',
            url: `/heroes`,
            headers,
            payload: MOCK_HEROI_CADASTRAR
        })
        const statusCode = result.statusCode
        const {nome, poder} = JSON.parse(result.payload)
        assert.deepEqual(statusCode, 201)
        assert.deepEqual({nome, poder}, MOCK_HEROI_CADASTRAR)
    })
    it('Cadastrar POST heroes - payload invalido', async function () {
        const result = await app.inject({
            method: 'POST',
            url: `/heroes`,
            headers,
            payload: {nome: "heroi"}
        })
        const statusCode = result.statusCode
        assert.deepEqual(statusCode, 400)
        assert.deepEqual(result.payload, JSON.stringify({
            statusCode: 400,
            error: 'Bad Request',
            message: '"poder" is required',
            validation: { source: 'payload', keys: [ 'poder' ] }
          }))
    })
    it('Atualizar Parcialmente - PATCH', async function () {
        const expected = {nome: "heroi test"}
        const result = await app.inject({
            method: 'PATCH',
            url: `/heroes/${MOCK_HEROI_INICIAL_ID}`,
            headers,
            payload: expected
        })
        const statusCode = result.statusCode
        assert.deepEqual(statusCode, 200)
        const {nome} = JSON.parse(result.payload)
        assert.deepEqual(expected, {nome})
    })
    it('Atualizar totalmente - PUT', async function () {
        const expected = {nome: "heroi test", poder:" test"}
        const result = await app.inject({
            method: 'PUT',
            url: `/heroes/${MOCK_HEROI_INICIAL_ID}`,
            headers,
            payload: expected
        })
        const statusCode = result.statusCode
        assert.deepEqual(statusCode, 200)
        const {nome, poder} = JSON.parse(result.payload)
        assert.deepEqual(expected, {nome, poder})
    })
    it('Deletar - DELETE', async function () {
        const result = await app.inject({
            method: 'DELETE',
            url: `/heroes/${MOCK_HEROI_PARA_DELETAR_ID}`,
            headers
        })
        const statusCode = result.statusCode
        assert.deepEqual(statusCode, 204)
    })
})