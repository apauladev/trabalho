
// Elementos que o JavaScript precisa pegar do HTML para manipular //

const pesquisaMarca = document.getElementById('pesquisa-marca');
const listaMarcas = document.getElementById('lista-marcas');

// Função que trará as marcas da API e exibirá na tela //

async function buscarMarcas(tipo) {
    let resposta = await fetch(`https://parallelum.com.br/fipe/api/v1/${tipo}/marcas`);
    let marcas = await resposta.json();
    marcas.forEach(function(marca){
        const card= document.createElement('div');
        card.textContent=marca.nome;
        card.addEventListener('click', function(){
            buscarModelos(marca.codigo);
        });
        listaMarcas.appendChild(card);

    });
    console.log(marcas);
}

const parametros = new URLSearchParams(window.location.search);
const tipo = parametros.get('tipo');

if (tipo && listaMarcas) {
    buscarMarcas(tipo);
}

async function buscarModelos(codigoMarca) {
    const resposta= await fetch(
        `https://parallelum.com.br/fipe/api/v1/${tipo}/marcas/${codigoMarca}/modelos`
    );
    const dados= await resposta.json();
    listaMarcas.innerHTML='';
    dados.modelos.forEach(function(modelo){
        const card= document.createElement('div');
        card.textContent=modelo.nome;
        card.addEventListener('click',function(){
            buscarAnos(codigoMarca,modelo.codigo);
        });
        listaMarcas.appendChild(card);
    });
    
    
}

async function buscarAnos(codigoMarca,codigoModelo){
    const resposta= await fetch(`https://parallelum.com.br/fipe/api/v1/${tipo}/marcas/${codigoMarca}/modelos/${codigoModelo}/anos`);
    const anos = await resposta.json();
    console.log(anos)
    console.log(listaMarcas)
    listaMarcas.innerHTML=''
    anos.forEach(function(ano){
        const card= document.createElement('div');
        card.textContent=ano.nome;
        card.addEventListener('click', function() {
            window.location.href =
            `detalhes.html?tipo=${tipo}&marca=${codigoMarca}&modelo=${codigoModelo}&ano=${ano.codigo}`;
        });
        listaMarcas.appendChild(card);
    });
}

const codigoMarca = parametros.get('marca');
const codigoModelo = parametros.get('modelo');
const codigoAno = parametros.get('ano');

async function buscarDetalhes() {
    const resposta = await fetch(
        `https://parallelum.com.br/fipe/api/v1/${tipo}/marcas/${codigoMarca}/modelos/${codigoModelo}/anos/${codigoAno}`
    );

    const detalhes = await resposta.json();

    const container = document.getElementById('detalhes-veiculo');

    container.innerHTML = `
        <h1>${detalhes.Modelo}</h1>

        <p><strong>Marca:</strong> ${detalhes.Marca}</p>
        <p><strong>Ano:</strong> ${detalhes.AnoModelo}</p>
        <p><strong>Combustível:</strong> ${detalhes.Combustivel}</p>
        <p><strong>Valor:</strong> ${detalhes.Valor}</p>
        <p><strong>Código FIPE:</strong> ${detalhes.CodigoFipe}</p>
        <p><strong>Referência:</strong> ${detalhes.MesReferencia}</p>
    `;
}
buscarDetalhes();