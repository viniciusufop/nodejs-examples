// npm install boom <-- customizar msg de erros
//npm install jsonwebtoken
const BaseRoute = require('./base/baseRoute')
const Joi = require('joi')
const Boom= require('boom')
const Jwt = require('jsonwebtoken')
const failAction = (request, headers, error) => {
    throw error
}

const USER = {
    username: 'test',
    password: 'test123'
}

class AuthRoute extends BaseRoute{
    constructor(secret) {
        super()
        this.secret = secret
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
                    if(username !== USER.username || password !== password){
                        return Boom.unauthorized()
                    }
                    const token = Jwt.sign({
                        username: username,
                        id: 1
                    }, this.secret)
                    return { token }
                } catch (error) {
                    console.log('DEU error', error)
                    return Boom.internal()
                }
            }
        }
    }
}

module.exports = AuthRoute