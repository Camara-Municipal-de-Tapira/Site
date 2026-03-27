import requests

BASE_URL = 'https://sapl.tapira.mg.leg.br/api'

# Formata a data de YYYY-MM-DD para DD/MM/YYYY
def formatar_data(data_iso):
    if not data_iso:
        return ''
    partes = data_iso.split('-')
    if len(partes) == 3:
        return f"{partes[2]}/{partes[1]}/{partes[0]}"
    return data_iso

# NOVA FUNÇÃO: Busca o nome do autor pelo ID
def pegar_nome_do_autor(id_autor):
    if not id_autor:
        return "Sem autor"
    try:
        url_autor = f"{BASE_URL}/base/autor/{id_autor}/"
        response = requests.get(url_autor)
        response.raise_for_status() # Lança erro se o status não for 200 OK
        data = response.json()
        return data.get('nome', "Autor Desconhecido")
    except Exception as erro:
        print(f"Erro ao buscar autor: {erro}")
        return "Autor Desconhecido"

# Função que monta os Cards (agora com o Autor)
def montar_html_materias(lista_itens, classe_css_adicional):
    if not lista_itens or len(lista_itens) == 0:
        return "<p>Nenhuma matéria cadastrada nesta fase.</p>\n"

    html = ""
    for item in lista_itens:
        id_materia = item.get('materia')
        if id_materia:
            try:
                # 1. Busca os detalhes do projeto
                url_materia = f"{BASE_URL}/materia/materialegislativa/{id_materia}/"
                res_materia = requests.get(url_materia)
                res_materia.raise_for_status()
                materia = res_materia.json()

                # 2. Verifica se tem autor e busca o nome do primeiro
                nome_autor_real = "Sem autor"
                autores = materia.get('autores', [])

                if autores and len(autores) > 0:
                    nome_autor_real = pegar_nome_do_autor(autores[0])
                    # Se tiver mais de um autor, adiciona "e outros"
                    if len(autores) > 1:
                        nome_autor_real += " e outros"

                # Variavéis de apoio para evitar erros se vierem vazias
                titulo_materia = materia.get('__str__', 'Matéria')
                ementa = materia.get('ementa') or 'Sem ementa cadastrada.'
                texto_original = materia.get('texto_original') or '#'
                resultado_str = item.get('resultado_str')

                # 3. Monta o Card final usando f-strings (equivalente à crase do JS)
                html += f"""
                    <div class="card-materia {classe_css_adicional}">
                        <h3>{titulo_materia}</h3>
                        <p><strong>Autor:</strong> {nome_autor_real}</p>
                        <p><strong>Assunto:</strong> {ementa}</p>
                        <p><a href="{texto_original}" target="_blank" class="btn_baixar">Baixar matéria</a></p>
                """

                if resultado_str:
                    html += f'        <span class="resultado-votacao">Resultado: {resultado_str}</span>\n'

                html += "    </div>\n"

            except Exception as e:
                print(f"Erro ao buscar detalhes da matéria: {e}")

    return html

# Função Principal
def buscar_ultima_reuniao_completa():
    html_final = ""
    try:
        # Busca a Última Sessão
        url_sessao = f"{BASE_URL}/sessao/sessaoplenaria/?o=-data_inicio&page_size=1"
        res_sessao = requests.get(url_sessao)
        json_sessao = res_sessao.json()
        resultados_sessao = json_sessao.get('results', [])

        if not resultados_sessao:
            return "<p id='data-sessao'>Nenhuma sessão encontrada.</p>"

        ultima_sessao = resultados_sessao[0]
        id_sessao = ultima_sessao.get('id')
        titulo = ultima_sessao.get('__str__', '')
        data_formatada = formatar_data(ultima_sessao.get('data_inicio'))

        # Começa a montar o HTML da página
        html_final += f"<h1 id='titulo-sessao'>{titulo}</h1>\n"
        html_final += f"<p id='data-sessao'>Realizada em: {data_formatada}</p>\n"

        # Busca o Expediente
        url_exp = f"{BASE_URL}/sessao/expedientemateria/?sessao_plenaria={id_sessao}"
        json_exp = requests.get(url_exp).json()

        html_final += "<h2 class='secao-pauta'>Leitura no Expediente</h2>\n"
        html_final += "<div id='conteudo-expediente' class='container-cards'>\n"
        html_final += montar_html_materias(json_exp.get('results', []), "card-expediente")
        html_final += "</div>\n"

        # Busca a Ordem do Dia
        url_pauta = f"{BASE_URL}/sessao/ordemdia/?sessao_plenaria={id_sessao}"
        json_pauta = requests.get(url_pauta).json()

        html_final += "<h2 class='secao-pauta'>Votação (Ordem do Dia)</h2>\n"
        html_final += "<div id='conteudo-ordem-dia' class='container-cards'>\n"
        html_final += montar_html_materias(json_pauta.get('results', []), "")
        html_final += "</div>\n"

    except Exception as erro:
        print(f"Erro ao comunicar com o SAPL: {erro}")
        html_final = "<p>Não foi possível carregar os dados no momento. Tente novamente mais tarde.</p>"

    return html_final

# Executa o código e imprime o resultado
if __name__ == "__main__":
    print("Buscando dados no SAPL...\n")
    meu_html = buscar_ultima_reuniao_completa()
    print("HTML GERADO COM SUCESSO:\n")
    print(meu_html)
