const BaseRoute = require('./base/baseRoute')
const Joi = require('joi')
class HeroRoutes extends BaseRoute{
    constructor(db) {
        super()
        this.db = db
    }

    list() {
        return {
            path: '/heroes',
            method: 'GET',
            options: {
                validate: {
                    // payload -> body
                    // headers -> header
                    // params -> URL :id
                    // query -> query params
                    failAction: (request, headers, error) => {
                        throw error
                    },
                    query: Joi.object({
                        skip: Joi.number().integer().default(0),
                        limit: Joi.number().integer().default(10),
                        nome: Joi.string().min(3).max(100)
                    })
                }
            },
            handler: (request, head) => {
                try {
                    const {
                        skip, 
                        limit, 
                        nome
                    } = request.query
                    let query = nome ? {nome: {$regex: `.*${nome}*.`}} : {}
                    return this.db.read(query, skip, limit)
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