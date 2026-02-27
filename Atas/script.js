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
    const anoAtual = new Date().getFullYear(); // Pega o ano em que estamos (ex: 2026)

// DEFINA AQUI O ANO MAIS ANTIGO DO SEU SAPL
const anoInicial = 2023;

// Loop que cria as opções (Ex: 2026, 2025, 2024... até 2017)
for (let ano = anoAtual; ano >= anoInicial; ano--) {
    const novaOpcao = document.createElement('option');
    novaOpcao.value = ano;
    novaOpcao.textContent = ano;
    selectAno.appendChild(novaOpcao);
}

// Deixa a caixinha já selecionada no ano atual
//selectAno.value = anoAtual;

// Dispara a busca pela primeira vez para não deixar a tela vazia
//carregarSessoes(anoAtual);
});

document.getElementById('btn-pesquisar').addEventListener('click', () => {
    const anoEscolhido = document.getElementById('ano-ata').value;

    if (anoEscolhido === "") {
        alert("Por favor, selecione um ano na lista.");
        return; // Interrompe se o usuário clicar em "Selecione..."
    }

    // Chama a função principal passando o ano que o usuário escolheu
    carregarSessoes(anoEscolhido);
});

async function carregarSessoes(ano) {
    const url = "https://sapl.tapira.mg.leg.br/api/sessao/sessaoplenaria/";

    // Filtra pelo ano e ordena da mais recente para a mais antiga
    const params = `?data_inicio__year=${ano}&o=-data_inicio`;

    const container = document.getElementById('lista-sessoes');

    // Mensagem de carregamento amigável
    container.innerHTML = `<p style="color: #666; margin-top: 20px;"><em>Buscando atas de ${ano}...</em></p>`;

    try {
        const response = await fetch(url + params);
        const data = await response.json();

        // Limpa a mensagem de carregamento
        container.innerHTML = "";

        // Se o SAPL disser que não tem atas naquele ano:
        if (!data.results || data.results.length === 0) {
            container.innerHTML = `<p style="margin-top: 20px;">Nenhuma sessão plenária encontrada para o ano de ${ano}.</p>`;
            return;
        }

        // Se achou, vamos desenhar cada card
        data.results.forEach(sessao => {

            // Corrige o fuso horário quebrando a data
            const partes = sessao.data_inicio.split('-');
            const dataFormatada = `${partes[2]}/${partes[1]}/${partes[0]}`;

            // Lógica do botão da Ata
            let botaoAta = "";
            if (sessao.upload_ata) {
                botaoAta = `<a href="${sessao.upload_ata}" target="_blank" class="btn-ata">Baixar Ata (PDF)</a>`;
            } else {
                botaoAta = `<span style="color: #777; font-size: 0.9em; display: inline-block; margin-top: 10px;">(Ata não disponível)</span>`;
            }

            // Monta o HTML do Card
            const htmlSessao = `
            <div class="caixa-sessao">
            <h3>${escaparHTML(sessao.__str__)}</h3>
            <p><strong>Data:</strong> ${dataFormatada}</p>
            ${botaoAta}
            </div>
            `;

            // Joga o card dentro do balde
            container.innerHTML += htmlSessao;
        });

    } catch (erro) {
        console.error(erro);
        container.innerHTML = "<p style='color: red; margin-top: 20px;'>Erro ao conectar com o SAPL. Tente novamente mais tarde.</p>";
    }
}
