# Site
Repositório da futura versão do tema para o site da Câmara, com algumas melhorias do tema e integração com o SAPL, de forma a garantir uma experiência mais fluida, intuitiva e com menos interrupções.

# Depende de:
Portal Modelo, Plone 5, Zope.

# Como instalar:
Os arquivos .js devem ser adicionados ao Portal Modelo através da interface de tema, na pasta de javascript. Os scripts relevantes já estão no pacote.
Criar "page templates" no ZMI referentes a cada script, como, por exemplo, um page template para ver as atas etc. e referenciar os scripts nesse page template. Ao criar a página, ela já fica online.

Modelo de HTML de um page template:

```html
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="pt" lang="pt"
      metal:use-macro="here/main_template/macros/master">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
      </head>
<body>
    <metal:main fill-slot="main">
        <script tal:attributes="src string:${portal_url}/++theme++NOMEDOTEMA/javascript/script.js"></script>
    </metal:main>
</body>
</html>
```

# O que muda:
Página de pesquisa de atas, página de pesquisa de matérias legislativas, página de pesquisa de pauta de reuniões.
