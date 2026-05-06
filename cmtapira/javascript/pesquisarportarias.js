document.addEventListener('DOMContentLoaded', () => {
    const pesquisarBtn = document.getElementById('btn-pesquisar');
    pesquisarBtn.addEventListener('click', pesquisarPortarias);
});

async function pesquisarPortarias() {
    const numeroPortaria = document.getElementById('numeroPortaria').value;
    const anoPortaria = document.getElementById('anoPortaria').value;
    const baseURL = 'https://sapl.tapira.mg.leg.br/api';

    const queryParams = new URLSearchParams({
        numero: numeroPortaria,
        ano: anoPortaria
    });

    try {
        const response = await fetch(`${baseURL}/protocoloadm/documentoadministrativo/?${queryParams.toString()}`);
        if (!response.ok) {
            throw new Error('Erro ao buscar portarias');
        }
        const data = await response.json();
        const portarias = data.results || data;
        exibirResultados(portarias);
    } catch (error) {
        console.error('Erro:', error);
        alert('Ocorreu um erro ao buscar as portarias. Por favor, tente novamente.');
    }
}

function exibirResultados(portarias) {
    const resultadosDiv = document.getElementById('resultados');
    resultadosDiv.innerHTML = '';

    const listaPortarias = Array.isArray(portarias) ? portarias : [];
    if (listaPortarias.length === 0) {
        resultadosDiv.innerHTML = '<p>Nenhuma portaria encontrada.</p>';
        return;
    }

    const table = document.createElement('table');
    table.classList.add('table', 'table-striped');

    const thead = document.createElement('thead');
    thead.innerHTML = `
        <tr>
            <th>Número</th>
            <th>Ano</th>
            <th>Assunto</th>
            <th>Baixar Portaria</th>
        </tr>
    `;
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    listaPortarias.forEach(portaria => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${portaria.numero}</td>
            <td>${portaria.ano}</td>
            <td>${portaria.assunto}</td>
            <td><a href="${portaria.url}" target="_blank">Baixar</a></td>
        `;
        tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    resultadosDiv.appendChild(table);
}