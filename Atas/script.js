let paginaAtual = 1;
let anoPesquisado = "";

function escaparHTML(texto) {
    if (!texto) return "";
    return texto.toString()
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

document.addEventListener('DOMContentLoaded', () => {
    const selectAno = document.getElementById('ano-ata');
    const anoAtual = new Date().getFullYear();
    const anoInicial = 2023;

    for (let ano = anoAtual; ano >= anoInicial; ano--) {
        const novaOpcao = document.createElement('option');
        novaOpcao.value = ano;
        novaOpcao.textContent = ano;
        selectAno.appendChild(novaOpcao);
    }

    selectAno.value = "";
    anoPesquisado = anoAtual;

    document.getElementById('btn-pesquisar').addEventListener('click', () => {
        const anoEscolhido = document.getElementById('ano-ata').value;

        if (anoEscolhido === "") {
            alert("Por favor, selecione um ano na lista.");
            return;
        }

        anoPesquisado = anoEscolhido;
        paginaAtual = 1; // Sempre que trocar o ano, volta para a página 1!
        carregarSessoes(anoPesquisado, paginaAtual);
    });

    document.getElementById('btn-proximo').addEventListener('click', () => {
        paginaAtual++;
        carregarSessoes(anoPesquisado, paginaAtual);
    });

    document.getElementById('btn-anterior').addEventListener('click', () => {
        if (paginaAtual > 1) {
            paginaAtual--;
            carregarSessoes(anoPesquisado, paginaAtual);
        }
    });

    // Inicia a primeira busca na página 1
    //carregarSessoes(anoPesquisado, paginaAtual);
});

async function carregarSessoes(ano, pagina) {
    const url = "https://sapl.tapira.mg.leg.br/api/sessao/sessaoplenaria/";

    // Agora a URL inclui &page= e o page_size=10 (para trazer de 10 em 10)
    const params = `?data_inicio__year=${ano}&o=-data_inicio&page=${pagina}&page_size=10`;

    const container = document.getElementById('lista-sessoes');
    const divPaginacao = document.getElementById('controles-paginacao');
    const btnAnterior = document.getElementById('btn-anterior');
    const btnProximo = document.getElementById('btn-proximo');
    const infoPagina = document.getElementById('info-pagina');

    container.innerHTML = `<p style="color: #666; margin-top: 20px;"><em>Buscando atas de ${ano} (Página ${pagina})...</em></p>`;
    divPaginacao.style.display = "none"; // Esconde os botões enquanto carrega

    try {
        const response = await fetch(url + params);
        const data = await response.json();

        container.innerHTML = "";

        if (!data.results || data.results.length === 0) {
            container.innerHTML = `<p style="margin-top: 20px;">Nenhuma sessão plenária encontrada para o ano de ${ano}.</p>`;
            return;
        }

        // Desenha os cards
        data.results.forEach(sessao => {
            const partes = sessao.data_inicio.split('-');
            const dataFormatada = `${partes[2]}/${partes[1]}/${partes[0]}`;

            let botaoAta = "";
            if (sessao.upload_ata) {
                botaoAta = `<a href="${sessao.upload_ata}" target="_blank" class="btn-ata">Baixar Ata (PDF)</a>`;
            } else {
                botaoAta = `<span style="color: #777; font-size: 0.9em; display: inline-block; margin-top: 10px;">(Ata não disponível)</span>`;
            }

            const htmlSessao = `
            <div class="caixa-sessao">
            <h3>${escaparHTML(sessao.__str__)}</h3>
            <p><strong>Data:</strong> ${dataFormatada}</p>
            ${botaoAta}
            </div>
            `;
            container.innerHTML += htmlSessao;
        });

        infoPagina.textContent = `Página ${pagina}`;
        divPaginacao.style.display = "flex"; // Mostra a barra de paginação

        // Se data.previous for null, desativa o botão "Anterior"
        btnAnterior.disabled = (data.previous === null);

        // Se data.next for null, desativa o botão "Próximo"
        btnProximo.disabled = (data.next === null);

        // Muda a opacidade para o cidadão ver que o botão está desativado
        btnAnterior.style.opacity = btnAnterior.disabled ? "0.5" : "1";
        btnProximo.style.opacity = btnProximo.disabled ? "0.5" : "1";

    } catch (erro) {
        console.error(erro);
        container.innerHTML = "<p style='color: red; margin-top: 20px;'>Erro ao conectar com o SAPL. Tente novamente mais tarde.</p>";
    }
}
