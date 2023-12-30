const assert = require('assert')
const api = require('../api')

let app = {}
describe('Suite de testes API Heroes', function(){
    // this.timeout(Infinity)
    this.beforeAll(async function(){
        app = await api
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
    // it('MongoDB Cadastrar', async function () {
    //     const {nome, poder} = await context.create(MOCK_HEROI_CADASTRAR)
    //     assert.deepEqual({nome, poder}, MOCK_HEROI_CADASTRAR)
    // })
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