let paginaAtual = 1;

document.addEventListener("DOMContentLoaded", function() {

    const selecaoAno = document.getElementById("selecao-ano");
    const selecaoAutor = document.getElementById("selecao-autor");


    carregarAutores();

    /*
    const aoMudarFiltro = () => {
        const ano = selecaoAno.value;
        const autorId = selecaoAutor.value;
        //paginaAtual = 1;
        //carregarSessoes(ano,paginaAtual, autorId);
    };

    selecaoAno.addEventListener("change", aoMudarFiltro);
    selecaoAutor.addEventListener("change", aoMudarFiltro);
    */

    // a ideia é pesquisar somente caso o botão pesquisar seja acionado, não automaticamente
    // após os campos serem selecionados

    const anoAtual = new Date().getFullYear();
    selecaoAno.value = "";
    let ano = anoAtual;
    const autorId = selecaoAutor.value;

    document.getElementById('btn-pesquisar').addEventListener('click', () => {
        paginaAtual = 1;
        carregarSessoes(ano, paginaAtual, autorId);
    });

    document.getElementById('btn-proximo').addEventListener('click', () => {
        paginaAtual++;
        carregarSessoes(ano, paginaAtual, autorId);
    });

    document.getElementById('btn-anterior').addEventListener('click', () => {
        if(paginaAtual > 1){
            paginaAtual--;
            carregarSessoes(ano, paginaAtual, autorId);
        }
    });

    document.getElementById('btn-limpar').addEventListener('click', () => {
        // limpa todos os campos

        document.getElementById('selecao-ano').value = "";
        document.getElementById('selecao-autor').value = "";

        // limpa os resultados da tela
        document.getElementById('lista-sessoes').innerHTML = "";
        document.getElementById('controles-paginacao').innerHTML = "";
    });


}); 

function carregarAutores(){
    const selecaoAutor = document.getElementById("selecao-autor");

    fetch("https://sapl.tapira.mg.leg.br/api/parlamentares/parlamentar/")
    .then(res => res.json())
    .then(data => {
        data.results.forEach(autor => {
            const option = document.createElement("option");
            option.value = autor.id;
            option.textContent = autor.nome_parlamentar;
            selecaoAutor.appendChild(option);
        });
    })
    .catch(err => console.error("Erro ao carregar autores:", err));
}


function carregarSessoes(ano, pagina, idAutor) {
        // Aqui você pode fazer uma requisição AJAX para obter as sessões do ano selecionado
        // Endpoint para buscar respostas: https://sapl.tapira.mg.leg.br/api/materia/tramitacao/?status=43&materia__tipo=1&expand=materia,materia.autores=${idAutor}
        // Tipo 1 - Indicação
        // Status 43 - Indicação respondida pelo órgão responsável
        // Expand para obter detalhes da matéria e autores sem precisar fazer uma segunda requisição cruzando os dados
        // Paginação: pagination.links.next para obter a próxima página de resultados, pagination.links.prev para obter a página anterior. 
        // page=2 para acessar a página 2, page=3 para acessar a página 3, e assim por diante.
        

        const listaSessoes = document.getElementById("lista-sessoes");

        // Construct the URL with filters. Note: status=43 and tipo=1 as per your notes
        let url = `https://sapl.tapira.mg.leg.br/api/materia/tramitacao/?status=43&materia__tipo=1&page=${pagina}`;

        // Add author filter only if one is selected
        if (idAutor && idAutor !== "") {
            url += `&materia__autores=${idAutor}`;
        }

        // Add year filter (assuming 'data_apresentacao' is the field for year)
        if (ano) {
            url += `&materia__data_apresentacao__year=${ano}`;
        }

        url += `&expand=materia,materia.autores`;

        // To bypass CORS during local dev with VS Code:
        //const proxy = "https://cors-anywhere.herokuapp.com/";

        //fetch(proxy + url)
        fetch(url)
        .then(response => response.json())
        .then(data => {
            renderizarResultados(data);
        })
        .catch(error => {
            console.error("Erro:", error);
            listaSessoes.innerHTML = "<li>Erro ao carregar dados. Verifique a conexão ou o Proxy.</li>";
        });
    }


function renderizarResultados(data) {
    
    const btnAnterior = document.getElementById("btn-anterior");
    const btnProximo = document.getElementById("btn-proximo");
    const listaSessoes = document.getElementById("lista-sessoes");
    listaSessoes.innerHTML = ""; // Limpa a lista antes de renderizar os novos resultados

    const listaMaterias = data.results || [];

    if(listaMaterias.length === 0) {
        const itemSessao = document.createElement("li");
        itemSessao.textContent = "Nenhuma sessão encontrada para o ano selecionado.";
        listaSessoes.appendChild(itemSessao);
    } else {
        listaMaterias.forEach(sessao => {
            const baixarMateria = sessao.materia.texto_original ? `<a href="${sessao.materia.texto_original}" target="_blank">Baixar matéria</a>` : "Texto original indisponível";
            const cardHTML = `<div class="card">
                <h3>${sessao.__str__}</h3>
                <p><strong>Data:</strong> ${sessao.materia.data_apresentacao}</p>
                <p><strong>Texto:</strong> ${sessao.texto}</p>
                <p>${baixarMateria}</p>
            </div>`;
            listaSessoes.innerHTML += cardHTML;
        });
        btnAnterior.disabled = !data.pagination.links.prev;
        btnProximo.disabled = !data.pagination.links.next;
    }
}
