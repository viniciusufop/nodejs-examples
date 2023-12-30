// npm install boom <-- customizar msg de erros
const BaseRoute = require('./base/baseRoute')
const Joi = require('joi')
const Boom = require('boom') 
const failAction = (request, headers, error) => {
    throw error
}

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
                    failAction,
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
                    return Boom.internal()
                }
            }
        }
    }

    create() {
        return {
            path: '/heroes',
            method: 'POST',
            options: {
                validate: {
                    // payload -> body
                    // headers -> header
                    // params -> URL :id
                    // query -> query params
                    failAction,
                    payload: Joi.object({
                        nome: Joi.string().min(3).max(100).required(),
                        poder: Joi.string().min(3).max(100).required(),
                    })
                }
            },
            handler: async (request, head) => {
                try {
                    const {nome, poder} = request.payload
                    const result = await this.db.create({nome, poder})
                    return head.response(result).code(201)
                } catch (error) {
                    console.log('DEU error', error)
                    return Boom.internal()
                }
            }
        }
    }

    partial_update() {
        return {
            path: '/heroes/{id}',
            method: 'PATCH',
            options: {
                validate: {
                    // payload -> body
                    // headers -> header
                    // params -> URL :id
                    // query -> query params
                    failAction,
                    params: Joi.object({
                        id: Joi.string().required()
                    }),
                    payload: Joi.object({
                        nome: Joi.string().min(3).max(100),
                        poder: Joi.string().min(3).max(100),
                    })
                }
            },
            handler: async (request, head) => {
                try {
                    const {id} = request.params
                    const {payload} = request
                    const dadosString = JSON.stringify(payload)
                    const dados = JSON.parse(dadosString)
                    await this.db.update(id, dados)
                    const [item] = await this.db.read({_id: id}) 
                    return item

                } catch (error) {
                    console.log('DEU error', error)
                    return Boom.internal()
                }
            }
        }
    }

    update() {
        return {
            path: '/heroes/{id}',
            method: 'PUT',
            options: {
                validate: {
                    // payload -> body
                    // headers -> header
                    // params -> URL :id
                    // query -> query params
                    failAction,
                    params: Joi.object({
                        id: Joi.string().required()
                    }),
                    payload: Joi.object({
                        nome: Joi.string().min(3).max(100).required(),
                        poder: Joi.string().min(3).max(100).required(),
                    })
                }
            },
            handler: async (request, head) => {
                try {
                    const {id} = request.params
                    const {payload} = request
                    await this.db.update(id, payload)
                    const [item] = await this.db.read({_id: id}) 
                    return item

                } catch (error) {
                    console.log('DEU error', error)
                    return Boom.internal()
                }
            }
        }
    }

    delete() {
        return {
            path: '/heroes/{id}',
            method: 'DELETE',
            options: {
                validate: {
                    // payload -> body
                    // headers -> header
                    // params -> URL :id
                    // query -> query params
                    failAction,
                    params: Joi.object({
                        id: Joi.string().required()
                    })
                }
            },
            handler: async (request, head) => {
                try {
                    const {id} = request.params
                    await this.db.delete(id)
                    return head.response({}).code(204)

                } catch (error) {
                    console.log('DEU error', error)
                    return Boom.internal()
                }
            }
        }
    }
}

module.exports = HeroRoutes