// npm install hapi <-- api http rest
// npm install boom <-- customizar msg de erros
// npm install @hapi/vision @hapi/inert hapi-swagger <-- documentacao
const Hapi = require('@hapi/hapi')
const Inert = require('@hapi/inert')
const Vision = require('@hapi/vision')
const HapiSwagger = require('hapi-swagger')
const Pack = require('../package');
const ContextStrategy = require('./db/strategies/base/contextStrategy')
const MongoDB = require('./db/strategies/mongodb/mongodb')
const HeroesSchema = require('./db/strategies/mongodb/schemas/heroesSchemas')
const HeroRoute = require('./routes/heroesRoutes')

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
    
    app.route([
        ...mapRoutes(new HeroRoute(context), HeroRoute.methods())
    ])
    // await context.isConnected()
    await app.start()
    console.log('App rodando na porta ', app.info.port)
    return app
}

module.exports = main()    