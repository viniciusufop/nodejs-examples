// npm install hapi <-- api http rest
// npm install boom <-- customizar msg de erros
//npm install jsonwebtoken <-- gerar token jwt
// npm install @hapi/vision @hapi/inert hapi-swagger <-- documentacao
// npm install hapi-auth-jwt2 <-- incluir jwt nos endpoints
// npm install bcrypt <-- criptografia para senhas
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
const PasswordHelper = require('./helpers/passwordHelper')

const JWT_SECRET = "minhaSecret" 
const app = new Hapi.Server({
    port: 5000
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