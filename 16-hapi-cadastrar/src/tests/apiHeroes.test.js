const assert = require('assert')
const api = require('../api')

const MOCK_HEROI_CADASTRAR = {
    nome: 'Chapolim Colorado',
    poder: 'Marreta Bionica'
}
let app = {}
describe('Suite de testes API Heroes', function(){
    // this.timeout(Infinity)
    this.beforeAll(async function(){
        try {
            app = await api
        } catch (error) {
            console.log('error', error)
            throw error
        }
        
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
        const payload = JSON.parse(result.payload)
        assert.deepEqual(statusCode, 400)
        assert.deepEqual(result.payload, JSON.stringify({
            statusCode: 400,
            error: 'Bad Request',
            message: '"poder" is required',
            validation: { source: 'payload', keys: [ 'poder' ] }
          }))
    })
    // it('MongoDB Listar', async function () {
    //     const [{nome, poder}] = await context.read({nome: MOCK_HEROI_DEFAULT.nome})
    //     assert.deepEqual({nome, poder}, MOCK_HEROI_DEFAULT)
    // })
    // it('MongoDB Atualizar', async function () {
    //     const [itemAtualizar] = await context.read({nome: MOCK_HEROI_ATUALIZADO.nome})
    //     const novoItem = {
    //         poder: itemAtualizar.poder,
    //         nome: "Joaozinho"
    //     }
    //     await context.update(itemAtualizar.id, novoItem)
    //     const [{nome, poder}] = await context.read({_id: itemAtualizar._id})
    //     assert.deepEqual({nome, poder}, novoItem)
    // })
    // it('MongoDB Deletar', async function () {
    //     const [item] = await context.read({})
    //     await context.delete(item._id)
    //     const [itemDeletado] = await context.read({_id: item._id})
    //     assert.deepEqual(itemDeletado, null)
    // })
})