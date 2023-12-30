const assert = require('assert')
const api = require('../api')

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
let app = {}
describe.only('Suite de testes API Heroes', function(){
    this.beforeAll(async function(){
        app = await api
        const result = await app.inject({
            method: 'POST',
            url: `/heroes`,
            payload: MOCK_HEROI_INICIAL
        })
        const statusCode = result.statusCode
        assert.deepEqual(statusCode, 201)
        const payload1 = JSON.parse(result.payload)
        MOCK_HEROI_INICIAL_ID = payload1._id

        const result2 = await app.inject({
            method: 'POST',
            url: `/heroes`,
            payload: MOCK_HEROI_PARA_DELETAR
        })
        const statusCode2 = result2.statusCode
        assert.deepEqual(statusCode2, 201)
        const payload2 = JSON.parse(result2.payload)
        MOCK_HEROI_PARA_DELETAR_ID = payload2._id
    })
    // this.afterAll(async function(){
    //     await app.close()
    // })
    it('listar heroes', async function () {
        const result = await app.inject({
            method: 'GET',
            url: '/heroes'
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
            url: `/heroes?skip=0&limit=${TAMANHO_LIMITE}`
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
            url: `/heroes?skip=0&limit=${TAMANHO_LIMITE}`
        })
        const statusCode = result.statusCode
        assert.deepEqual(statusCode, 400)
    })
    it('Cadastrar POST heroes', async function () {
        const result = await app.inject({
            method: 'POST',
            url: `/heroes`,
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
            url: `/heroes/${MOCK_HEROI_PARA_DELETAR_ID}`
        })
        const statusCode = result.statusCode
        assert.deepEqual(statusCode, 204)
    })
})