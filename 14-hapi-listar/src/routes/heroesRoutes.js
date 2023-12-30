const BaseRoute = require('./base/baseRoute')

class HeroRoutes extends BaseRoute{
    constructor(db) {
        super()
        this.db = db
    }

    list() {
        return {
            path: '/heroes',
            method: 'GET',
            handler: (request, head) => {
                try {
                    const {
                        skip, 
                        limit, 
                        nome
                    } = request.query
                    let query = {}
                    if (nome)
                        query.nome = nome
                    if (limit && isNaN(limit))
                        throw Error('tipo do limit invalido')
                    if (skip && isNaN(skip))
                        throw Error('tipo do skip invalido')
                    return this.db.read(query, parseInt(skip), parseInt(limit))
                } catch (error) {
                    console.log("Deu ruim", error)
                    throw error
                }
            }
        }
    }

    create() {
        return {
            path: '/heroes',
            method: 'POST',
            handler: (request, head) => {
                return this.db.read({})
            }
        }
    }
}

module.exports = HeroRoutes