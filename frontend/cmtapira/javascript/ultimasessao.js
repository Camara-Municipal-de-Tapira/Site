import { formatarDataBR, escaparHTML } from './utils.js';

// Constante da URL base da API do backend
const baseUrlBackend = "/api";

/**
 * Função que monta os Cards de matérias com dados já formatados do backend Java
 * @param {Array} listaItens - Array de MateriaDTO com título, autor, ementa, textoOriginal, resultado
 * @param {String} classeCssAdicional - Classe CSS adicional para o card
 * @returns {String} HTML dos cards das matérias
 */
async function montarHtmlMaterias(listaItens, classeCssAdicional) {
    if (!listaItens || listaItens.length === 0) {
        return "<p>Nenhuma matéria cadastrada nesta fase.</p>";
    }

    let html = "";
    for (const materia of listaItens) {
        try {
            // Os dados já vêm formatados do backend Java
            const titulo = escaparHTML(materia.titulo || 'Matéria sem título');
            const autor = escaparHTML(materia.autor || 'Sem autor');
            const ementa = escaparHTML(materia.ementa || 'Sem ementa cadastrada.');
            const textoOriginal = materia.textoOriginal ? escaparHTML(materia.textoOriginal) : '#';
            const resultado = materia.resultado ? `<span class="resultado-votacao">Resultado: ${escaparHTML(materia.resultado)}</span>` : '';

            html += `
                <div class="card-materia ${classeCssAdicional}">
                    <h3>${titulo}</h3>
                    <p><strong>Autor:</strong> ${autor}</p>
                    <p><strong>Assunto:</strong> ${ementa}</p>
                    ${materia.textoOriginal ? `<p><a href="${textoOriginal}" target="_blank" class="btn-ata"><strong>Baixar matéria</strong></a></p>` : ''}
                    ${resultado}
                </div>
            `;
        } catch (e) {
            console.error("Erro ao processar matéria:", e, materia);
        }
    }
    return html;
}

async function mostrarTodasSessoes() {
    const containerSessoes = document.getElementById('lista-sessoes');
    const detalhesReuniao = document.getElementById('detalhes-reuniao');

    detalhesReuniao.style.display = 'none';
    containerSessoes.style.display = 'block';
    containerSessoes.innerHTML = "<p><em>Buscando sessões...</em></p>";

    try {
        const sessoes = await buscarReuniao();
        if (!sessoes || sessoes.length === 0) {
            containerSessoes.innerHTML = "<p>Nenhuma sessão encontrada.</p>";
            return;
        }

        let html = "";
        for (const sessao of sessoes) {
            html += `
            <div class="caixa-sessao">
                <h3>${escaparHTML(sessao.tipo || 'Sessão')}</h3>
                <p>Data: ${formatarDataBR(sessao.data)}</p>
                <button class="btn-ata btn-ver-detalhes" data-sessao-id="${sessao.id}"><strong>Ver detalhes</strong></button>
            </div>
            `;
        }
        containerSessoes.innerHTML = html;
        
        // Adicionar event listeners aos botões
        containerSessoes.querySelectorAll('.btn-ver-detalhes').forEach(button => {
            button.addEventListener('click', async () => {
                const sessaoId = Number(button.dataset.sessaoId);
                const sessaoSelecionada = sessoes.find(s => s.id === sessaoId);
                if (sessaoSelecionada) {
                    await mostraDetalhesReuniao(sessaoSelecionada);
                }
            });
        });
    } catch (erro) {
        console.error("Erro ao buscar sessões:", erro);
        containerSessoes.innerHTML = "<p>Não foi possível carregar as sessões no momento.</p>";
    }
}   

async function mostraDetalhesReuniao(sessao) {
    // Mostrar os detalhes da reunião e ocultar a lista
    document.getElementById('detalhes-reuniao').style.display = 'block';
    document.getElementById('lista-sessoes').style.display = 'none';

    const containerExpediente = document.getElementById('conteudo-expediente');
    const containerOrdemDia = document.getElementById('conteudo-ordem-dia');
    const tituloSessao = document.getElementById('titulo-sessao');
    const dataSessao = document.getElementById('data-sessao');
    const baixarSessao = document.getElementById('impressao-pauta');

    // Exibir mensagem de carregamento
    containerExpediente.innerHTML = "<p><em>Carregando detalhes da reunião...</em></p>";
    containerOrdemDia.innerHTML = "<p><em>Carregando detalhes da reunião...</em></p>";

    try {
        // Buscar dados completos da reunião do backend Java
        const response = await fetch(`${baseUrlBackend}/reunioes/${sessao.id}`);
        
        if (!response.ok) {
            throw new Error("Erro ao buscar detalhes da reunião");
        }

        const sessaoDetalhes = await response.json();

        // Atualizar informações gerais da sessão
        tituloSessao.innerText = `${sessaoDetalhes.tipo || ''}`;
        dataSessao.innerText = `Realizada em: ${formatarDataBR(sessaoDetalhes.data)}`;
        
        // Adicionar link para download da pauta em PDF
        baixarSessao.innerHTML = `<a href="https://sapl.tapira.mg.leg.br/sessao/pauta-sessao/${sessaoDetalhes.id}/pdf" class="btn-ata"><strong>Impressão da pauta em PDF</strong></a>`;

        // Montar HTML dos cards de expediente
        const htmlExpediente = await montarHtmlMaterias(sessaoDetalhes.expediente, "card-expediente");
        containerExpediente.innerHTML = htmlExpediente;

        // Montar HTML dos cards da ordem do dia
        const htmlOrdemDia = await montarHtmlMaterias(sessaoDetalhes.ordemDia, "");
        containerOrdemDia.innerHTML = htmlOrdemDia;

    } catch (erro) {
        console.error("Erro ao carregar detalhes da reunião:", erro);
        containerExpediente.innerHTML = "<p>Não foi possível carregar os detalhes da reunião no momento.</p>";
        containerOrdemDia.innerHTML = "<p>Não foi possível carregar os detalhes da reunião no momento.</p>";
    }
}

/**
 * Busca reuniões do backend Java com filtros opcionais
 * @param {String} tipo - Tipo de sessão (opcional)
 * @param {String} ano - Ano da sessão (opcional)
 * @param {String} mes - Mês da sessão (opcional)
 * @param {String} dia - Dia da sessão (opcional)
 * @returns {Array} Array de SessaoDTO
 */
async function buscarReuniao(tipo = '', ano = '', mes = '', dia = '') {
    
    // Construir query string com parâmetros opcionais
    const params = new URLSearchParams();
    if (tipo) params.append('tipo', tipo);
    if (ano) params.append('ano', ano);
    if (mes) params.append('mes', mes);
    if (dia) params.append('dia', dia);

    const queryString = params.toString() ? `?${params.toString()}` : '';
    const url = `${baseUrlBackend}/reunioes${queryString}`;

    const response = await fetch(url);
    if (!response.ok) {
        throw new Error("Erro ao buscar reuniões");
    }
    const sessoes = await response.json();
    return sessoes || [];
}

document.addEventListener('DOMContentLoaded', async () => {
    document.getElementById('btn-pesquisar').addEventListener('click', async () => {
        // Coletar valores dos filtros
        const tipo = document.getElementById('select-tipo')?.value || '';
        const ano = document.getElementById('select-ano')?.value || '';
        const mes = document.getElementById('select-mes')?.value || '';
        const dia = document.getElementById('select-dia')?.value || '';

        await mostrarTodasSessoes();
    });

    document.getElementById('btn-limpar').addEventListener('click', async () => {
        // Limpar campos de filtro
        document.getElementById('select-ano').value = '';
        document.getElementById('select-mes').value = '';
        document.getElementById('select-dia').value = '';
        document.getElementById('select-tipo').value = '';

        // Limpar lista de sessões
        const listaSessoes = document.getElementById('lista-sessoes');
        listaSessoes.innerHTML = '';
        listaSessoes.style.display = 'block';
        document.getElementById('detalhes-reuniao').style.display = 'none';
        document.getElementById('titulo-sessao').innerText = 'Pesquise as pautas de reunião';
    });
});
