// npm install boom <-- customizar msg de erros
//npm install jsonwebtoken
const BaseRoute = require('./base/baseRoute')
const Joi = require('joi')
const Boom= require('boom')
const Jwt = require('jsonwebtoken')
const PasswordHelper = require('../helpers/passwordHelper')
const failAction = (request, headers, error) => {
    throw error
}

const USER = {
    username: 'test',
    password: 'test123'
}

class AuthRoute extends BaseRoute{
    constructor(secret, db) {
        super()
        this.secret = secret
        this.db = db
    }

    login() {
        return {
            path: '/login',
            method: 'POST',
            options: {
                auth: false,
                tags: ['api'],
                description: 'fazer login',
                notes: "login com user e senha",
                validate: {
                    // payload -> body
                    // headers -> header
                    // params -> URL :id
                    // query -> query params
                    failAction,
                    payload: Joi.object({
                        username: Joi.string().min(3).max(100).required(),
                        password: Joi.string().min(3).max(100).required(),
                    })
                }
            },
            handler: async (request, head) => {
                try {
                    const {username, password} = request.payload
                    const [user] = await this.db.read({username})
                    if(!user) return Boom.unauthorized('User or password did not match')
                    
                    const match = await PasswordHelper.comparePassword(password, user.password)
                    if(!match){
                        return Boom.unauthorized('User or password did not match')
                    }
                    const token = Jwt.sign({
                        username: user.username,
                        id: user.id
                    }, this.secret)
                    return { token }
                } catch (error) {
                    console.log('DEU error', error)
                    return Boom.internal()
                }
            }
        }
    }

    cadastrar() {
        return {
            path: '/cadastrar',
            method: 'POST',
            options: {
                auth: false,
                tags: ['api'],
                description: 'criar login',
                notes: "criar login com user e senha",
                validate: {
                    // payload -> body
                    // headers -> header
                    // params -> URL :id
                    // query -> query params
                    failAction,
                    payload: Joi.object({
                        username: Joi.string().min(3).max(100).required(),
                        password: Joi.string().min(3).max(100).required(),
                    })
                }
            },
            handler: async (request, head) => {
                try {
                    const {username, password} = request.payload
                    const [user] = await this.db.read({username})
                    if(user) return Boom.badRequest('Username exists')
                    
                    const hash = await PasswordHelper.hashPassword(password)
                    await this.db.create({username, password:hash})
                    return { 'message': 'User criado com sucesso' }
                } catch (error) {
                    console.log('DEU error', error)
                    return Boom.internal()
                }
            }
        }
    }
}

module.exports = AuthRoute