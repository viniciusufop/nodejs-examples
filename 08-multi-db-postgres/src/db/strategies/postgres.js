const ICrud = require('./interfaces/interfaceCrud')
const Sequelize = require('sequelize')

class Postgres extends ICrud {
    constructor(){
        super()
        this._driver = null
        this._heroes = null
    }

    async create(item) {
        if(this._driver === null) await this._connect()
        const {dataValues} = await this._heroes.create(item)
        return dataValues
    }

    async read(query = {}) {
        if(this._driver === null) await this._connect()
        return await this._heroes.findAll({where: query, raw: true})
    }

    async update(id, item) {
        if(this._driver === null) await this._connect()
        await this._heroes.update(item, {where: {id: id}})
        const [result] = await this._heroes.findAll({where: {id: id}, raw: true})
        return result
    }

    async delete(id) {
        if(this._driver === null) await this._connect()
        const query = id ? { id }: {}
        return await this._heroes.destroy({where: query})
    }


    async isConnected() {
        try {
            if(this._driver === null) await this._connect()
            await this._driver.authenticate()
            return true
        }catch (error){
            console.log('Database authetication failed', error)
            return false
        }
    }

    async _defineModel(){
        this._heroes = this._driver.define('heroes', {
            id: {
                type: Sequelize.INTEGER,
                required: true,
                primaryKey: true,
                autoIncrement: true
            },
            nome: {
                type: Sequelize.STRING,
                required: true
            },
            poder: {
                type: Sequelize.STRING,
                required: true
            }
        },{
            tableName: 'TB_HEROES',
            freezeTableName: false,
            timestamps: false
        })
        await this._heroes.sync()
    }

    async _connect(){
        this._driver = new Sequelize(
            'heroes',
            'testuser',
            'testuser123',
            {
                host: 'localhost',
                dialect: 'postgres',
                quoteIdentifiers: false,
                operatorsAliases: false
            }
        )
        await this._defineModel()
    }
}

module.exports = Postgres