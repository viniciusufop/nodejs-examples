const ICrud = require('./interfaces/interfaceCrud')
const Mongoose = require('mongoose')

const STATUS = {
    0: 'Desconectado',
    1: 'Conectado',
    2: 'Conectando',
    3: 'Desconectando'
}

class MongoDB extends ICrud {
    constructor(){
        super()
        this._connection = null
        this._heroes = null
    }

    async create(item) {
        if(this._connection === null) await this._connect()
        return await this._heroes.create(item)
    }

    async read(query, skip=0,limit=10) {
        return await this._heroes.find(query).skip(skip).limit(limit)
    }

    async update(id, item) {
        if(this._connection === null) await this._connect()
        return await this._heroes.updateOne({_id: id}, {$set: item})
    }

    async delete(id) {
        if(this._connection === null) await this._connect()
        const query = id ? {_id: id} : {}
        return await this._heroes.deleteMany(query)
    }

    async isConnected() {
        if(this._connection === null) await this._connect()
        const state  = STATUS[this._connection.readyState]
        if(state !== 'Conectando') return state
        if(state === 'Conectando')
            await new Promise(resolve => setTimeout(resolve, 1000))
        return STATUS[this._connection.readyState]
    }

    async _defineModel(){
        const heroesSchema = new Mongoose.Schema({
            nome: {
                type: String,
                required: true
            },
            poder: {
                type: String,
                required: true
            },
            insertedAt: {
                type: Date,
                default: new Date()
            }
         })
         this._heroes = Mongoose.model('heroes', heroesSchema)
    }

    async _connect(){
        Mongoose.connect("mongodb://testuser:testuser123@localhost:27017/heroes")
        .catch( (error) => {
            if(!error) return ;
            console.log('Falha ao conectar ao banco', error)
        })
        this._connection = Mongoose.connection
        this._connection.once('open', () => console.log('database rodando'))
        this._defineModel()
    }
}

module.exports = MongoDB