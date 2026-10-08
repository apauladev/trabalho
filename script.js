
// Elementos que o JavaScript precisa pegar do HTML para manipular //

const pesquisaMarca = document.getElementById('pesquisa-marca');
const listaMarcas = document.getElementById('lista-marcas');
const tituloLista = document.getElementById('escolher');

// Array para armazenar as marcas disponíveis //
let marcasDisponiveis = [];

// Função que trará as marcas da API e exibirá na tela //

async function buscarMarcas(tipo) {
    let resposta = await fetch(`https://brasilapi.com.br/api/fipe/marcas/v1/${tipo}`);
    marcasDisponiveis = await resposta.json();
    marcasDisponiveis.forEach(function(marca){
        const card= document.createElement('div');
        card.textContent=marca.nome;
        card.addEventListener('click', function(){
            tituloLista.textContent = "Escolha um modelo";
            buscarModelos(marca.valor);
        });
        listaMarcas.appendChild(card);

    });
    console.log(marcasDisponiveis);
}

if (pesquisaMarca) {
    pesquisaMarca.addEventListener('input', function() {
        const texto = pesquisaMarca.value.toLowerCase();

        const marcasFiltradas = marcasDisponiveis.filter(function(marca) {
            return marca.nome.toLowerCase().includes(texto);
        });

        listaMarcas.innerHTML = '';

        marcasFiltradas.forEach(function(marca) {
            const card = document.createElement('div');
            card.textContent = marca.nome;

            card.addEventListener('click', function() {
                tituloLista.textContent = "Escolha um modelo";
                buscarModelos(marca.valor);
            });

            listaMarcas.appendChild(card);
        });
    });
}

const parametros = new URLSearchParams(window.location.search);
const tipo = parametros.get('tipo');

if (tipo && listaMarcas) {
    buscarMarcas(tipo);
}

async function buscarModelos(codigoMarca) {
    const resposta= await fetch(`https://brasilapi.com.br/api/fipe/veiculos/v1/${tipo}/${codigoMarca}`);
    const dados= await resposta.json();
        console.log("Código da marca:", codigoMarca);
        console.log("Dados dos modelos:", dados);
    listaMarcas.innerHTML='';
    dados.forEach(function(modelo){
        const card= document.createElement('div');
        card.textContent=modelo.modelo;
        card.addEventListener('click',function(){
            tituloLista.textContent = "Escolha um ano";
            buscarAnos(codigoMarca,modelo.valor);
        });
        listaMarcas.appendChild(card);
    });
    
    
}

async function buscarAnos(codigoMarca,codigoModelo){
    const resposta= await fetch(`https://brasilapi.com.br/api/fipe/anos/v1/${tipo}/${codigoMarca}/${codigoModelo}`);
    const anos = await resposta.json();
    console.log("Resposta dos anos:", anos);
    console.log("É um array?", Array.isArray(anos));
    console.log("Quantidade de anos:", anos.length);
     console.log("listaMarcas:", listaMarcas);
    listaMarcas.innerHTML=''
    anos.forEach(function(ano){
        const card= document.createElement('div');
        card.textContent=ano.nome;
        card.addEventListener('click', function() {
            window.location.href =
            `detalhes.html?tipo=${tipo}&marca=${codigoMarca}&modelo=${codigoModelo}&ano=${ano.valor}`;
        });
        listaMarcas.appendChild(card);
    });
}

const codigoMarca = parametros.get('marca');
const codigoModelo = parametros.get('modelo');
const codigoAno = parametros.get('ano');

async function buscarDetalhes() {
    const resposta = await fetch(
        `https://brasilapi.com.br/api/fipe/detalhes/v1/${tipo}/${codigoMarca}/${codigoModelo}/${codigoAno}`
    );

    const detalhes = await resposta.json();
    console.log(detalhes);

    const container = document.getElementById('detalhes-veiculo-info');

   container.innerHTML = `
    <h1>${detalhes.modelo}</h1>

    <p><strong>Marca:</strong> ${detalhes.marca}</p>
    <p><strong>Ano:</strong> ${detalhes.anoModelo}</p>
    <p><strong>Combustível:</strong> ${detalhes.combustivel}</p>
    <p><strong>Valor:</strong> ${detalhes.valor}</p>
    <p><strong>Código FIPE:</strong> ${detalhes.codigoFipe}</p>
    <p><strong>Referência:</strong> ${detalhes.mesReferencia}</p>
`;
}

const container = document.getElementById('detalhes-veiculo-info');

if (container) {
    buscarDetalhes();
}