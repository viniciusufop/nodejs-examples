// npm install hapi <-- api http rest
// npm install boom <-- customizar msg de erros
// npm install @hapi/vision @hapi/inert hapi-swagger <-- documentacao
// npm install hapi-auth-jwt2
const Hapi = require('@hapi/hapi')
const Inert = require('@hapi/inert')
const Vision = require('@hapi/vision')
const HapiSwagger = require('hapi-swagger')
const HapiJwt = require('hapi-auth-jwt2')

const Pack = require('../package');
const ContextStrategy = require('./db/strategies/base/contextStrategy')
const MongoDB = require('./db/strategies/mongodb/mongodb')
const HeroesSchema = require('./db/strategies/mongodb/schemas/heroesSchemas')
const HeroRoute = require('./routes/heroesRoutes')
const AuthRoute = require('./routes/authRoutes')

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
        validate: (dado, request) => {
            //verifica no banco se o user esta ativo
            return {
                isValid: true // caso nao valido é falso
            }
        }
    })
    app.auth.default('jwt')


    app.route([
        ...mapRoutes(new HeroRoute(context), HeroRoute.methods()),
        ...mapRoutes(new AuthRoute(JWT_SECRET), AuthRoute.methods())
    ])
    await app.start()
    console.log('App rodando na porta ', app.info.port)
    return app
}

module.exports = main()    