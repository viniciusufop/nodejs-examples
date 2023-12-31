const ICrud = require('../interfaces/interfaceCrud')
const Sequelize = require('sequelize')

class Postgres extends ICrud {
    constructor(connection, schema){
        super()
        this._connection = connection
        this._schema = schema
    }

    async create(item) {
        const {dataValues} = await this._schema.create(item)
        return dataValues
    }

    async read(query = {}, skip, limit) {
        return await this._schema.findAll({where: query, raw: true})
    }

    async update(id, item, upsert = false) {
        const fn = upsert ? 'upsert' : 'update'
        await this._schema[fn](item, {where: {id: id}})
        const [result] = await this._schema.findAll({where: {id: id}, raw: true})
        return result
    }

    async delete(id) {
        const query = id ? { id }: {}
        return await this._schema.destroy({where: query})
    }


    async isConnected() {
        try {
            if(this._connection === null) await this._connect()
            await this._connection.authenticate()
            return true
        }catch (error){
            console.log('Database authetication failed', error)
            return false
        }
    }

    static async defineModel(connection, schema){
        const model = connection.define(
            schema.name, schema.schema, schema.options
        )
        await model.sync()
        return model
    }

    static async connect(){
        const connection = new Sequelize(
            'heroes',
            'testuser',
            'testuser123',
            {
                host: 'localhost',
                dialect: 'postgres',
                quoteIdentifiers: false,
                operatorsAliases: false,
                logging: false
            }
        )
        return connection
    }
}

module.exports = Postgres