import json
import urllib.request
import argparse

#parser = argparse.ArgumentParser(description='Imprime as indicações')
#parser.add_argument('--iddoautor', action="store", dest='iddoautor', default=0)
#idAutor = parser.parse_args()

def get_json(url):

    response = urllib.request.urlopen(url, timeout=10)

    return json.loads(response.read())

def autor(idAutor):

    try:

        url = "https://sapl.tapira.mg.leg.br/api/base/autor/{}".format(idAutor)

        response = urllib.request.urlopen(url, timeout=10)

        data = get_json(url)

        return data.get("nome", "Autor desconhecido")

    except Exception as e:

        return "Autor desconhecido"

# pega os dados em json da API do SAPL e retorna os dados da indicação
# necessita de outra função que recupera os dados do autor para cruzá-los
def indicacao(idAutor):

    url = "https://sapl.tapira.mg.leg.br/api/materia/materialegislativa/?tipo=1&o=-data_apresentacao&page_size=5&autores={}".format(idAutor)

    data = get_json(url)

    resultado = []

    return data.get("results", [])

def main():

    parser = argparse.ArgumentParser(
            description = "Lista indicações por autor"
        )

    parser.add_argument(
            "--iddoautor",
            type = int,
            required=True,
            help="id do autor no SAPL"

        )

    args = parser.parse_args()


    id_autor = args.iddoautor


    nome = autor(id_autor)


    print(f"\nIndicações do autor: {nome}\n")


    materias = indicacao(id_autor)


    if not materias:

        print("Nenhuma matéria encontrada.")

        return


    for m in materias:


        print(f"{m['numero']}/{m['ano']}")

        print(m['ementa'])

        print("-" * 50)



if __name__ == "__main__":

    main()

