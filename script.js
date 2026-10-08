
// Elementos que o JavaScript precisa pegar do HTML para manipular //

const pesquisaMarca = document.getElementById('pesquisa-marca');
const listaMarcas = document.getElementById('lista-marcas');
const tituloLista = document.getElementById('escolher');
const pesquisa = document.getElementById('pesquisa');

// Array para armazenar as marcas disponíveis //
let marcasDisponiveis = [];

// Função que trará as marcas da API e exibirá na tela - com tratamento de erros e mensagens para o usuário(usabilidade) //

async function buscarMarcas(tipo) {
    try {
        let resposta = await fetch(
            `https://brasilapi.com.br/api/fipe/marcas/v1/${tipo}`
        );

        if (!resposta.ok) {
            throw new Error(`Erro na API: ${resposta.status}`);
        }

        marcasDisponiveis = await resposta.json();

        if (!Array.isArray(marcasDisponiveis)) {
            throw new Error("A API não retornou uma lista de marcas.");
        }

        marcasDisponiveis.forEach(function(marca) {
            const card = document.createElement('div');
            card.textContent = marca.nome;

            card.addEventListener('click', function() {
            tituloLista.textContent = "Escolha um modelo";
            pesquisa.style.display = 'none';
             buscarModelos(marca.valor);
});

            listaMarcas.appendChild(card);
        });

        console.log(marcasDisponiveis);

    } catch (erro) {
    console.error("Erro ao buscar marcas:", erro);

    listaMarcas.innerHTML = `
        <p class="mensagem-erro">
            Não foi possível carregar as marcas.
            Tente novamente em alguns instantes.
        </p>`;
    }
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
                pesquisa.style.display = 'none';
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

// Função que trará os modelos da API e exibirá na tela - com tratamento de erros e mensagens para o usuário(usabilidade) //

async function buscarModelos(codigoMarca) {
    try {

        listaMarcas.innerHTML = `
        <p class="mensagem-carregando">
        Carregando modelos...
        </p>`;

        const resposta = await fetch(
            `https://brasilapi.com.br/api/fipe/veiculos/v1/${tipo}/${codigoMarca}`);

        const dados = await resposta.json();

        console.log("Status modelos:", resposta.status);
        console.log("Resposta modelos:", dados);
        console.log("É array?", Array.isArray(dados));

        if (!resposta.ok) {
            throw new Error(`Erro na API: ${resposta.status}`);
        }

        if (!Array.isArray(dados)) {
            throw new Error("A API não retornou uma lista de modelos.");
        }

        listaMarcas.innerHTML = '';

        dados.forEach(function(modelo) {
            const card = document.createElement('div');
            card.textContent = modelo.modelo;

            card.addEventListener('click', function() {
                tituloLista.textContent = "Escolha um ano";
                buscarAnos(codigoMarca, modelo.valor);
            });

            listaMarcas.appendChild(card);
        });

    } catch (erro) {
        console.error("Erro ao buscar modelos:", erro);

        listaMarcas.innerHTML = `
            <p class="mensagem-erro">
                Não foi possível carregar os modelos.
                Tente novamente em alguns instantes.
            </p>
        `;
    }
}

// Função que trará os anos da API e exibirá na tela - com tratamento de erros e mensagens para o usuário(usabilidade) //

async function buscarAnos(codigoMarca, codigoModelo) {
    try {

        listaMarcas.innerHTML = `
        <p class="mensagem-carregando">
        Carregando anos...
        </p>`;

        const resposta = await fetch(
            `https://brasilapi.com.br/api/fipe/anos/v1/${tipo}/${codigoMarca}/${codigoModelo}`);

        const anos = await resposta.json();

        console.log("Status:", resposta.status);
        console.log("Resposta dos anos:", anos);
        console.log("É um array?", Array.isArray(anos));

        if (!resposta.ok) {
            throw new Error(`Erro na API: ${resposta.status}`);
        }

        if (!Array.isArray(anos)) {
            throw new Error("A API não retornou uma lista de anos.");
        }

        listaMarcas.innerHTML = '';

        anos.forEach(function(ano) {
            const card = document.createElement('div');
            card.textContent = ano.nome;

            card.addEventListener('click', function() {
                window.location.href =
                `detalhes.html?tipo=${tipo}&marca=${codigoMarca}&modelo=${codigoModelo}&ano=${ano.valor}`;
            });

            listaMarcas.appendChild(card);
        });

    } catch (erro) {
        console.error("Erro ao buscar anos:", erro);

        listaMarcas.innerHTML = `
            <p class="mensagem-erro">
                Não foi possível carregar os anos.
                Tente novamente em alguns instantes.
            </p>
        `;
    }
}

const codigoMarca = parametros.get('marca');
const codigoModelo = parametros.get('modelo');
const codigoAno = parametros.get('ano');

// Função que trará os detalhes do veículo da API e exibirá na tela - com tratamento de erros e mensagens para o usuário(usabilidade) //

async function buscarDetalhes() {
    try {

        const container = document.getElementById('detalhes-veiculo-info');

        container.innerHTML = `
        <p class="mensagem-carregando">
        Carregando detalhes do veículo...
        </p>`;

        const resposta = await fetch(
            `https://brasilapi.com.br/api/fipe/detalhes/v1/${tipo}/${codigoMarca}/${codigoModelo}/${codigoAno}`);

        const detalhes = await resposta.json();

        console.log(detalhes);

        if (!resposta.ok) {
            throw new Error(`Erro na API: ${resposta.status}`);
        }

        if (!detalhes || typeof detalhes !== 'object') {
            throw new Error("A API não retornou os detalhes do veículo.");
        }

        container.innerHTML = `
            <h1>${detalhes.modelo}</h1>

            <p><strong>Marca:</strong> ${detalhes.marca}</p>
            <p><strong>Ano:</strong> ${detalhes.anoModelo}</p>
            <p><strong>Combustível:</strong> ${detalhes.combustivel}</p>
            <p><strong>Valor:</strong> ${detalhes.valor}</p>
            <p><strong>Código FIPE:</strong> ${detalhes.codigoFipe}</p>
            <p><strong>Referência:</strong> ${detalhes.mesReferencia}</p>
        `;

    } catch (erro) {
        console.error("Erro ao buscar detalhes:", erro);

        const container = document.getElementById('detalhes-veiculo-info');

        container.innerHTML = `
            <p class="mensagem-erro">
                Não foi possível carregar os detalhes do veículo.
                Tente novamente em alguns instantes.
            </p>
        `;
    }
}

const container = document.getElementById('detalhes-veiculo-info');

if (container) {
    buscarDetalhes();
}