const { obterPessoas } = require('./service')

Array.prototype.meuReduce = function (callback, valorInicial) {
    let valorFinal = typeof valorInicial !== undefined ? valorInicial : this[0]
    for(let index = 0; index <= this.length -1; index ++){
        valorFinal = callback(valorFinal, this[index], this)
    }
    return valorFinal
}

async function main() {
    try{
        const { results } = await obterPessoas('a')
        // const pesos = results.map(item => parseInt(item.height))
        // const total = pesos.reduce ((ant, prox) => {
        //     return ant + prox
        // }, 0)
        // console.log(pesos, total)
        const minhalista =[
            ['Erick', 'Wendel'],
            ['NodeBR', 'Nerdzao']
        ]
        const total = minhalista.meuReduce((ant, prox) => {
            return ant.concat(prox)
        }, [])
        .join(', ')
        console.log('total', total)

    } catch(error){
        console.error('error', error)
    }
}

main()