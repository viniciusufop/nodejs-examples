// npm install mongoose 
const Mongoose = require('mongoose')
Mongoose.connect("mongodb://testuser:testuser123@localhost:27017/heroes")
.catch( (error) => {
    if(!error) return ;
    console.log('Falha ao conectar ao banco', error)
})

const connection = Mongoose.connection

connection.once('open', () => console.log('database rodando'))

// setTimeout(()=> {
//     const state = connection.readyState
//     console.log('state', state)
// }, 1000)
/**
 State values
 0: disconectado
 1: Conectado
 2: Conectando
 3: Disconectando
 */

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

 const model = Mongoose.model('heroes', heroesSchema)


 async function main(){
    const resultCadastrar = await model.create({
        nome: "Batman",
        poder: "Dinheiro"
    })
    console.log('resultCadastrar', resultCadastrar)

    const listItens = await model.find()
    console.log('listItens', listItens)
 }

 main()