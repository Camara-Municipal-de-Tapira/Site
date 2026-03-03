// TODO modficar o código de forma a garantir que ele capture pelo menos o tipo de matéria e o ano da matéria. Ver também uma forma de garantir que os dados opcionais sejam capturados conforme necessário.

function escaparHTML(texto) {
    if(!texto) return "";
    return texto.toString()
    .replace(/&/g, "&samp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;)
    .replace(/'/g, "&#039");
}

async function pegarNomeDoAutor(idAutor){
    try{
        const urlAutor = `https://sapl.tapira.mg.leg.br/api/base/autor/${autor}/`;
        const response = await fetch(urlAutor);
        const data = await response.json();
        return data.nome || "Autor desconhecido";

    } catch(erro){
        console.error("Erro ao buscar o autor", erro);
        return "Erro ao carregar dados";
    }
}

async function buscarMaterias(){
    const url = "https://sapl.tapira.mg.leg.br/api/materia/materialegislativa/";
    const ano = new Date().getUTCFullYear(); // pegar o ano que o usuário escolher
    const id = 1; // indicação - cada matéria tem seu ID...
    // talvez seja necessária uma função para capturar qual dos tipos o usuário quer

    try {
        const response = await fetch(`${url}?&tipo=${id}&o=-data_apresentacao&page_size=10`);
        const data = await response.json();
        todasMaterias.push(...data.results);
    }   catch (erro){
            console.error("Não foi possível acessar as matérias.", erro);
            document.getElementById('container-cards').innerHTML = "<p>Erro ao carregar dados</p>";
            return;
    }

    for (const indicacao of ultimas3indicacoes){
        const idAutor = indicacao.autores[0];
        if (idAutor){
            indicacao.nomeAutorReal = await pegarNomeDoAutor(idAutor);
        } else {
            indicacao.nomeAutorReal = "Sem autor";
        }
    }

    // renderizarCardsNaTela(ultimas3indicacoes);
}

// --- NOVA FUNÇÃO: Focada apenas em desenhar o HTML ---
function renderizarCardsNaTela(listaDeIndicacoes) {
    // 1. Encontra o "balde" vazio no HTML
    const container = document.getElementById('container-cards');

    // 2. Limpa o texto "Carregando..." que estava lá
    container.innerHTML = '';

    // 3. Para cada indicação da lista de 3 itens...
    listaDeIndicacoes.forEach(indicacao => {
        // Vamos criar o HTML do card usando "Template Strings" (as crases ``)
        // Isso permite misturar HTML com variáveis ${...}

        // NOTA: Estou assumindo que a API retorna 'numero', 'ano' e 'ementa'.
        const htmlDoCard = `
        <div class="card">
        <h3>Indicação nº ${indicacao.numero}/${indicacao.ano}</h3>
        <p><strong>Autor:</strong> ${indicacao.nomeAutorReal}</p>
        <p><strong>Assunto:</strong> ${indicacao.ementa}</p>
        </div>
        `;

        // 4. Adiciona esse novo HTML dentro do balde
        // O += significa "pegue o que já tem lá e adicione mais isso"
        container.innerHTML += htmlDoCard;
    });
}

// Executa a função principal quando a página carrega
buscarUltimasIndicacoes();
