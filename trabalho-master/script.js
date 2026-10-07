
// Elementos que o JavaScript precisa pegar do HTML para manipular //

const pesquisaMarca = document.getElementById('pesquisa-marca');
const listaMarcas = document.getElementById('lista-marcas');

// Função que trará as marcas da API e exibirá na tela //

async function buscarMarcas(tipo) {
    let resposta = await fetch(`https://parallelum.com.br/fipe/api/v1/${tipo}/marcas`);
    let marcas = await resposta.json();
    console.log(marcas);
}

const parametros = new URLSearchParams(window.location.search);
const tipo = parametros.get('tipo');

if (tipo && listaMarcas) {
    buscarMarcas(tipo);
}