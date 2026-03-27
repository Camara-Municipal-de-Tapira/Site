/**
 * Sapl Integration Toolkit - Versão Corrigida (Mixed Content Fix)
 * Este arquivo resolve o erro de "Blocked loading mixed active content"
 * forçando HTTPS nas URLs de paginação do SAPL.
 */

let paginaAtual = 1;

function formatarDataBR(dataISO) {
    if (!dataISO) return 'N/A';
    // Divide a string 2024-05-20 em [2024, 05, 20]
    const [ano, mes, dia] = dataISO.split('-');
    return `${dia}/${mes}/${ano}`;
}

document.addEventListener('DOMContentLoaded', () => {
    const selectAno = document.getElementById('ano-materia');
    const anoAtual = new Date().getFullYear();
    const anoInicial = 2021;

    // Popula o select de anos
    for (let ano = anoAtual; ano >= anoInicial; ano--) {
        const novaOpcao = document.createElement('option');
        novaOpcao.value = ano;
        novaOpcao.textContent = ano;
        selectAno.appendChild(novaOpcao);
    }

    selectAno.value = "";
    let anoPesquisado = anoAtual;

    // Inicializa carregamentos
    carregarTiposMateria();
    carregarNomeAutor();

    // Eventos de Botões
    document.getElementById('btn-pesquisar').addEventListener('click', () => {
        paginaAtual = 1;
        pesquisaMateria(anoPesquisado, paginaAtual);
    });

    document.getElementById('btn-proximo').addEventListener('click', () => {
        paginaAtual++;
        pesquisaMateria(anoPesquisado, paginaAtual);
    });

    document.getElementById('btn-anterior').addEventListener('click', () => {
        if (paginaAtual > 1) {
            paginaAtual--;
            pesquisaMateria(anoPesquisado, paginaAtual);
        }
    });

    document.getElementById('btn-limpar').addEventListener('click', () => {
        document.getElementById('tipo-materia').value = "";
        document.getElementById('ano-materia').value = "";
        document.getElementById('numero-materia').value = "";
        document.getElementById('autor-materia').value = "";
        document.getElementById('pesquisar-expressoes').value = "";
        document.getElementById('lista-sessoes').innerHTML = "";
        const divPaginacao = document.getElementById('controles-paginacao');
        if (divPaginacao) divPaginacao.style.display = "none";
    });
});

/**
 * Auxiliar para garantir que a URL use HTTPS
 */
function forceHttps(url) {
    if (!url) return url;
    return url.replace(/^http:/, 'https:');
}

async function carregarTiposMateria() {
    const selectTipo = document.getElementById('tipo-materia');
    const urlTiposSapl = 'https://sapl.tapira.mg.leg.br/api/materia/tipomaterialegislativa/';

    try {
        const resposta = await fetch(forceHttps(urlTiposSapl));
        if (!resposta.ok) throw new Error(`Erro: ${resposta.status}`);
        const dados = await resposta.json();
        const listaTipos = dados.results || dados;

        listaTipos.forEach(tipo => {
            const opcaoHTML = document.createElement('option');
            opcaoHTML.value = tipo.id;
            opcaoHTML.textContent = tipo.descricao || tipo.nome;
            selectTipo.appendChild(opcaoHTML);
        });
    } catch (erro) {
        console.error("Falha ao carregar os tipos de matéria:", erro);
    }
}

async function carregarNomeAutor() {
    const selectAutor = document.getElementById('autor-materia');
    let urlAutor = `https://sapl.tapira.mg.leg.br/api/base/autor/?tipo=2`;
    let todosAutores = [];

    try {
        let contadorPagina = 0;
        while (urlAutor && contadorPagina < 5) {
            // CORREÇÃO: Força HTTPS na URL antes de cada fetch
            const resposta = await fetch(forceHttps(urlAutor));
            if (!resposta.ok) break;

            const dados = await resposta.json();
            const listaDaPagina = dados.results || [];
            todosAutores = todosAutores.concat(listaDaPagina);

            // Pega o link da próxima página e incrementa
            urlAutor = (dados.pagination && dados.pagination.links) ? dados.pagination.links.next : null;
            contadorPagina++;
        }

        todosAutores.forEach(autor => {
            const opcaoHTML = document.createElement('option');
            opcaoHTML.value = autor.id;
            opcaoHTML.textContent = autor.nome;
            selectAutor.appendChild(opcaoHTML);
        });
    } catch (erro) {
        console.error("Falha ao carregar os autores:", erro);
    }
}

async function pegarNomeDoAutor(idAutor) {
    try {
        const urlAutor = `https://sapl.tapira.mg.leg.br/api/base/autor/${idAutor}/`;
        const response = await fetch(forceHttps(urlAutor));
        const data = await response.json();
        return data.nome || "Autor Desconhecido";
    } catch (erro) {
        console.error("Erro ao buscar autor", erro);
        return "Erro ao carregar nome.";
    }
}

async function pesquisaMateria(anoPesquisado, paginaAtual) {
    const tipo = document.getElementById('tipo-materia').value.trim();
    const ano = document.getElementById('ano-materia').value.trim();
    const numero = document.getElementById('numero-materia').value.trim();
    const autor = document.getElementById('autor-materia').value;
    const expressoes = document.getElementById('pesquisar-expressoes').value.trim();
    const pagesize = 4;

    if (!tipo || !ano) {
        alert("Por favor, preencha os campos obrigatórios: Tipo e Ano.");
        return;
    }

    const baseUrl = 'https://sapl.tapira.mg.leg.br/api/materia/materialegislativa/';
    const params = new URLSearchParams();
    params.append('tipo', tipo);
    params.append('ano', ano);
    params.append('page', paginaAtual);
    params.append('page_size', pagesize);
    params.append('o', '-numero');

    if (numero) params.append('numero', numero);
    if (autor) params.append('autores', autor);
    if (expressoes) params.append('ementa__icontains', expressoes);

    const urlCompleta = `${baseUrl}?${params.toString()}`;

    try {
        const resposta = await fetch(forceHttps(urlCompleta));
        if (!resposta.ok) throw new Error(`Erro: ${resposta.status}`);
        
        const dados = await resposta.json();
        const materias = dados.results || [];

        // Busca nomes de autores em paralelo para performance
        for (const materia of materias) {
            const idAutor = materia.autores ? materia.autores[0] : null;
            materia.nomeAutorReal = idAutor ? await pegarNomeDoAutor(idAutor) : "Sem autor";
        }

        renderizarResultados(dados);
    } catch (erro) {
        console.error("Falha ao buscar matérias:", erro);
        alert("Erro ao buscar dados do SAPL.");
    }
}

function renderizarResultados(dados) {
    const btnAnterior = document.getElementById('btn-anterior');
    const btnProximo = document.getElementById('btn-proximo');
    const infoPagina = document.getElementById('info-pagina');
    const divPaginacao = document.getElementById('controles-paginacao');
    const containerResultados = document.getElementById('lista-materias') || document.getElementById('lista-sessoes');

    if (!containerResultados) return;
    containerResultados.innerHTML = ''; 

    const listaMaterias = dados.results || [];

    if (listaMaterias.length === 0) {
        containerResultados.innerHTML = `<p>Nenhuma matéria encontrada.</p>`;
        if (divPaginacao) divPaginacao.style.display = "none";
        return;
    }

    listaMaterias.forEach(materia => {
        
        const dataFormatada = formatarDataBR(materia.data_apresentacao);
        
        const baixarMateria = materia.texto_original
            ? `<a href="${forceHttps(materia.texto_original)}" target="_blank" class="btn-baixar">Baixar PDF</a>`
            : `<span>(Indisponível)</span>`;

        const cardHTML = `
            <div class="caixa-sessao">
                <h3>${materia.__str__ || 'Matéria'}</h3>
                <p><strong>Ementa:</strong> ${materia.ementa || 'Sem ementa'}</p>
                <p><strong>Autor:</strong> ${materia.nomeAutorReal}</p>
                <p><strong>Data de Apresentação:</strong> ${dataFormatada}</p>
                ${baixarMateria}
            </div>
        `;
        containerResultados.innerHTML += cardHTML;
    });

    if (dados.pagination && divPaginacao) {
        btnAnterior.disabled = !dados.pagination.links.previous;
        btnProximo.disabled = !dados.pagination.links.next;
        infoPagina.textContent = `Página ${dados.pagination.page} de ${dados.pagination.total_pages}`;
        divPaginacao.style.display = "flex";
    }
}