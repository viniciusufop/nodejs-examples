const ICrud = require('../interfaces/interfaceCrud')
const Mongoose = require('mongoose')

const STATUS = {
    0: 'Desconectado',
    1: 'Conectado',
    2: 'Conectando',
    3: 'Desconectando'
}

class MongoDB extends ICrud {
    constructor(connection, schema){
        super()
        this._connection = connection
        this._schema = schema
    }

    async create(item) {
        return await this._schema.create(item)
    }

    async read(query, skip=0,limit=10) {
        return await this._schema.find(query).skip(skip).limit(limit)
    }

    async update(id, item, upsert=false) {
        return await this._schema.updateOne({_id: id}, {$set: item})
    }

    async delete(id) {
        const query = id ? {_id: id} : {}
        return await this._schema.deleteMany(query)
    }

    async isConnected() {
        const state  = STATUS[this._connection.readyState]
        if(state !== 'Conectando') return state
        if(state === 'Conectando')
            await new Promise(resolve => setTimeout(resolve, 1000))
        return STATUS[this._connection.readyState]
    }

    static connect(){
        Mongoose.connect("mongodb://testuser:testuser123@localhost:27017/heroes")
        .catch( (error) => {
            if(!error) return ;
            console.log('Falha ao conectar ao banco', error)
        })
        const connection = Mongoose.connection
        connection.once('open', () => console.log('database rodando'))
        return connection
    }
}

module.exports = MongoDB