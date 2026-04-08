# Site
Repositório da futura versão do tema para o site da Câmara Municipal de Tapira, com algumas melhorias do tema e integração com o SAPL, de forma a garantir uma experiência mais fluida, intuitiva e com menos interrupções. 
Essa iniciativa nasceu de um desejo de integrar o site com o SAPL, de forma que não seja necessário acessar outras páginas para obter a informação desejada.

# Depende de:
Portal Modelo, Plone, Zope.

# Como instalar:
Os arquivos .js devem ser adicionados ao Portal Modelo através da interface de tema, na pasta de javascript. Os scripts relevantes já estão no pacote.
Criar "page templates" no ZMI referentes a cada script, como, por exemplo, um page template para ver as atas etc. e referenciar os scripts nesse page template. Ao criar a página, ela já fica online. 

Mude os scripts para referenciar sua casa legislativa.

Modelo de HTML de um page template:

```html
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="pt" lang="pt"
      metal:use-macro="here/main_template/macros/master">
<body>
    
    <metal:main fill-slot="main">
        
        <script type="module" tal:attributes="src string:${portal_url}/++theme++cmtapira/javascript/script.js"></script> 
       
    </metal:main>
</body>
</html>
```

# O que muda:
Página de pesquisa de atas, página de pesquisa de matérias legislativas, página de pesquisa de pauta de reuniões, respostas de indicações.
