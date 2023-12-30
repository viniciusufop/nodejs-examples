const service = require('./service')

Array.prototype.meuMap = function (callback) {
    const novoArrayMapeado = []
    for(let indice = 0; indice <= this.length-1; indice++){
        const resultado = callback(this[indice], indice)
        novoArrayMapeado.push(resultado)
    }
    return novoArrayMapeado
}

async function main() {
    try{
        const result = await service.obterPessoas('a')
        
        // FOR EACH
        // const names = []
        // result.results.forEach(function (item){
        //     names.push(item.name)
        // })
        // console.log('names', names)

        // MAP com function
        // const names = result.results.map(function (pessoa){
        //     return pessoa.name
        // })

        // Simplificando a function
        // const names = result.results.map(pessoa => pessoa.name)

        // customizando o map
        const names = result.results.meuMap(function (pessoa, indice){
            return `[${indice}] ${pessoa.name}`
        })
        console.log('names', names)
    }
    catch(error) {
        console.error(`error interno`, error)
    }
}

main()