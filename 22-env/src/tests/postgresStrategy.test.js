const assert = require('assert')
const Postgres = require('./../db/strategies/postgres/postgres')
const HeroesSchema = require('./../db/strategies/postgres/schemas/heroesSchema')
const ContextStrategy = require('./../db/strategies/base/contextStrategy')

let context = {}
let connection = {}
const MOCK_HEROI_CADASTRAR = {
    nome: 'Gaviao Negro',
    poder: 'flexas'
}
const MOCK_HEROI_ATUALIZADO = {
    nome: 'Batman',
    poder: 'dinherio'
}

describe('Postgres Strategy', function(){
    this.timeout(Infinity)
    this.beforeAll(async function(){
        connection = await Postgres.connect()
        const model = await Postgres.defineModel(connection, HeroesSchema)
        context = new ContextStrategy(new Postgres(connection, model))
        await context.delete()
        await context.create(MOCK_HEROI_ATUALIZADO)
    })
    this.afterAll(async function(){
        await context.delete()
        await connection.close()
    })
    it('PostgresSQL Connection', async function () {
        const result = await context.isConnected()
        assert.equal(result, true)
    })
    it('PostgresSQL Cadastrar', async function () {
        const result = await context.create(MOCK_HEROI_CADASTRAR)
        delete result.id
        assert.deepEqual(result, MOCK_HEROI_CADASTRAR)
    })
    it('PostgresSQL Listar', async function () {
        const [result] = await context.read({nome: MOCK_HEROI_CADASTRAR.nome})
        delete result.id
        assert.deepEqual(result, MOCK_HEROI_CADASTRAR)
    })
    it('PostgresSQL Atualizar', async function () {
        const [itemAtualizar] = await context.read({nome: MOCK_HEROI_ATUALIZADO.nome})
        const novoItem = {
            ...MOCK_HEROI_ATUALIZADO,
            nome: "Mulher Maravilha"
        }
        const result = await context.update(itemAtualizar.id, novoItem)

        assert.deepEqual(result.nome, novoItem.nome)
    })
    it('PostgresSQL Deletar', async function () {
        const [item] = await context.read({})
        const result = await context.delete(item.id)
        const [itemDeletado] = await context.read({id: item.id})
        assert.deepEqual(itemDeletado, null)
    })
})