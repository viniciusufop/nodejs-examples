const Commander = require('commander')
const Database = require('./database')
const Heroi = require('./heroi')

async function main() {
    Commander
        .version('v1')
        .option('-n, --nome [value]', 'Nome do heroi')
        .option('-p, --poder [value]', 'Poder do heroi')
        .option('-i, --id [value]', 'Id do heroi')
        .option('-c, --cadastrar', 'Cadastrar um heroi')
        .option('-l, --listar', 'listar um heroi')
        .option('-r, --remover', 'Remove um heroi pelo id')
        .option('-a, --atualizar [value]', 'Atualizar um heroi pelo id')
        .parse(process.argv)

    let options = Commander.opts();
    const heroi = new Heroi(options)
    try{
        if(options.cadastrar) {
            delete heroi.id
            const resultado = await Database.cadastrar(heroi)
            if(!resultado) {
                console.error('Heroi nao foi cadastrado')
                return;
            }
            console.log('Heroi Cadastrado com sucesso')
        }
        if(options.listar) {
            const resultado = await Database.listar()
            console.log(resultado)
        }
        if(options.remover) {
            const resultado = await Database.remover(heroi.id)
            if(!resultado) {
                console.error('Heroi nao foi removido')
                return;
            }
            console.log('Heroi removido com sucesso')
        }

        if(options.atualizar) {
            const idParaAtualizar = parseInt(options.atualizar)
            delete heroi.id
            const dado = JSON.stringify(heroi)
            const heroiAtualizar = JSON.parse(dado)
            const resultado = await Database.atualizar(idParaAtualizar, heroiAtualizar)
            if(!resultado) {
                console.error('Heroi nao foi atualizado')
                return;
            }
            console.log('Heroi atualizado com sucesso')
        }


    } catch(error) {
        console.error('DEU RUIM', error)
    }
}

main()