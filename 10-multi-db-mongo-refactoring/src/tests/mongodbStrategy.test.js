const assert = require('assert')
const MongoDB = require('../db/strategies/mongodb/mongodb')
const heroesSchema = require('../db/strategies/mongodb/schemas/heroesSchemas')
const ContextStrategy = require('../db/strategies/base/contextStrategy')

let context = {}
let connection = {}
const MOCK_HEROI_CADASTRAR = {
    nome: 'Mulher Maravilha',
    poder: 'laços'
}
const MOCK_HEROI_DEFAULT = {
    nome: 'Homem Aranha-'+new Date(),
    poder: 'teias'
}
const MOCK_HEROI_ATUALIZADO = {
    nome: 'Batman'+new Date(),
    poder: 'dinherio'
}
describe('MongoDB Strategy', function(){
    this.timeout(Infinity)
    this.beforeAll(async function(){
        connection = MongoDB.connect()
        context = new ContextStrategy(new MongoDB(connection, heroesSchema))
        await context.delete()
        await context.create(MOCK_HEROI_DEFAULT)
        await context.create(MOCK_HEROI_ATUALIZADO)
    })
    this.afterAll(async function(){
        // descobrir como fechar a conexao e encerrar o test
        // after(async () => { await connection.close() })
    })
    it('MongoDB Connection', async function () {
        const result = await context.isConnected()
        assert.equal(result, "Conectado")
    })
    it('MongoDB Cadastrar', async function () {
        const {nome, poder} = await context.create(MOCK_HEROI_CADASTRAR)
        assert.deepEqual({nome, poder}, MOCK_HEROI_CADASTRAR)
    })
    it('MongoDB Listar', async function () {
        const [{nome, poder}] = await context.read({nome: MOCK_HEROI_DEFAULT.nome})
        assert.deepEqual({nome, poder}, MOCK_HEROI_DEFAULT)
    })
    it('MongoDB Atualizar', async function () {
        const [itemAtualizar] = await context.read({nome: MOCK_HEROI_ATUALIZADO.nome})
        const novoItem = {
            poder: itemAtualizar.poder,
            nome: "Joaozinho"
        }
        await context.update(itemAtualizar.id, novoItem)
        const [{nome, poder}] = await context.read({_id: itemAtualizar._id})
        assert.deepEqual({nome, poder}, novoItem)
    })
    it('MongoDB Deletar', async function () {
        const [item] = await context.read({})
        await context.delete(item._id)
        const [itemDeletado] = await context.read({_id: item._id})
        assert.deepEqual(itemDeletado, null)
    })
})