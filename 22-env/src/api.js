// npm install hapi <-- api http rest
// npm install boom <-- customizar msg de erros
//npm install jsonwebtoken <-- gerar token jwt
// npm install @hapi/vision @hapi/inert hapi-swagger <-- documentacao
// npm install hapi-auth-jwt2 <-- incluir jwt nos endpoints
// npm install bcrypt <-- criptografia para senhas
// npm install dotenv <-- diferente enviroments
// npm i -g cross-env <-- mudando ambiente de execucao com o cross-env NODE_ENV=prod npm test

// servidores gratuitos para ultima parte
// mongo -> https://cloud.mongodb.com/v2/6590805df262625f98034392#/clusters/detail/heroes
// postgres -> https://dashboard.render.com/d/dpg-cm888ra1hbls73avrjv0-a
// server -> https://dashboard.render.com/web/srv-cm88vigcmk4c73911l4g/deploys/dep-cm890vud3nmc73av8m70
// url de test -> https://node-heroes-example.onrender.com/documentation

const { config } = require('dotenv')
const { join } = require('path')
const { ok } = require('assert')

const env = process.env.NODE_ENV || 'dev'
ok(env === 'prod'|| env === 'dev', "a env é invalida")

const configPath = join(__dirname, '../config', `.env.${env}`)
config({
    path: configPath
})

const Hapi = require('@hapi/hapi')
const Inert = require('@hapi/inert')
const Vision = require('@hapi/vision')
const HapiSwagger = require('hapi-swagger')
const HapiJwt = require('hapi-auth-jwt2')

const Pack = require('../package');
const ContextStrategy = require('./db/strategies/base/contextStrategy')
const MongoDB = require('./db/strategies/mongodb/mongodb')
const HeroesSchema = require('./db/strategies/mongodb/schemas/heroesSchemas')
const Postgres = require('./db/strategies/postgres/postgres')
const UserSchema = require('./db/strategies/postgres/schemas/userSchemas')
const HeroRoute = require('./routes/heroesRoutes')
const AuthRoute = require('./routes/authRoutes')

const JWT_SECRET = process.env.JWT_KEY
const app = new Hapi.Server({
    port: process.env.PORT
})

function mapRoutes(instance, methods) {
    return methods.map(method => instance[method]())
}


async function main() {
    const connection = MongoDB.connect()
    const context = new ContextStrategy(new MongoDB(connection, HeroesSchema))
    const conn = await Postgres.connect()
    const userModel = await Postgres.defineModel(conn, UserSchema)
    const postgresContext = new ContextStrategy(new Postgres(conn, userModel))
    const swaggerOptions = {
        info: {
            title: 'Api Heroes - Curso de NodeJS',
            version: Pack.version
        }
    }
    await app.register([
        HapiJwt,
        Vision, 
        Inert,
        {
            ...HapiSwagger,
            options: swaggerOptions
        }
    ]).catch( (error) => {
        console.log('error', error)
        throw error
    })
    app.auth.strategy('jwt', 'jwt', {
        key: JWT_SECRET,
        // options: {
        //     expiresIn: 20
        // },
        validate: async (dado, request) => {
            const [result] = await postgresContext.read({username: dado.username})
            if(!result) return {
                isValid: false
            }
            return {
                isValid: true // caso nao valido é falso
            }
        }
    })
    app.auth.default('jwt')


    app.route([
        ...mapRoutes(new HeroRoute(context), HeroRoute.methods()),
        ...mapRoutes(new AuthRoute(JWT_SECRET, postgresContext), AuthRoute.methods())
    ])
    await app.start()
    console.log('App rodando na porta ', app.info.port)
    return app
}

module.exports = main()    