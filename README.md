# EquipControl — Gerenciamento de Equipamentos

Projeto acadêmico de Desenvolvimento de Sistemas feito com HTML, CSS e JavaScript puro. O objetivo é substituir registros manuais por um inventário simples, pesquisável e organizado.

## Funcionalidades

- Cadastrar equipamentos com nome, patrimônio, categoria, marca, modelo, conservação, situação, localização e observações.
- Listar e pesquisar por nome, patrimônio, categoria, marca, modelo ou localização.
- Filtrar por situação: disponível, emprestado ou em manutenção.
- Editar e excluir registros com confirmação.
- Mostrar indicadores do inventário no painel.
- Exportar os registros filtrados em CSV.
- Salvar dados no `localStorage` do navegador.
- Layout responsivo, navegação por teclado, rótulos acessíveis e opção de reduzir animações.

## Arquivos

- `index.html` — estrutura e telas do sistema.
- `style.css` — cores, layout, responsividade e acessibilidade visual.
- `script.js` — cadastro, validação, pesquisa, edição, exclusão, exportação e armazenamento local.

## Como executar

1. Baixe e extraia o projeto.
2. Abra a pasta no Visual Studio Code.
3. Abra o arquivo `index.html` no navegador. Para desenvolvimento, também é possível usar a extensão **Live Server** do VS Code e clicar em **Go Live**.
4. Cadastre um equipamento e teste as funcionalidades.

Não é necessário instalar bibliotecas ou configurar servidor.

## Armazenamento e limitações

Os dados são guardados no navegador e no dispositivo em que o site é utilizado. Eles não são enviados para um banco de dados nem sincronizados com outros computadores. Limpar os dados do navegador pode apagar os registros. Para um sistema empresarial real, recomenda-se usar API, autenticação, banco de dados, cópias de segurança e controle de acesso.

## Testes sugeridos

1. Cadastrar equipamento preenchendo todos os campos obrigatórios.
2. Tentar salvar sem nome ou patrimônio: o navegador deve solicitar o preenchimento.
3. Cadastrar dois itens com o mesmo patrimônio: o sistema deve bloquear a duplicidade.
4. Pesquisar por nome e por patrimônio.
5. Filtrar a lista por “Emprestado” e por “Disponível”.
6. Editar a situação de um equipamento e confirmar os indicadores.
7. Excluir um registro e cancelar outra exclusão para conferir a confirmação.
8. Atualizar a página e confirmar que os dados continuam salvos.
9. Exportar a lista para CSV e abrir o arquivo em um editor de planilhas.
10. Redimensionar a janela para testar a versão móvel.

## Quadro de tarefas

- [x] Planejar as telas e os campos do cadastro.
- [x] Construir a interface com HTML e CSS.
- [x] Implementar cadastro e validação em JavaScript.
- [x] Implementar pesquisa e filtro.
- [x] Implementar edição e exclusão.
- [x] Implementar indicadores e armazenamento local.
- [x] Implementar exportação CSV.
- [ ] Executar os testes em diferentes navegadores e registrar os resultados.
- [ ] Publicar o projeto no GitHub.

## Publicação no GitHub

1. Entre em https://github.com e faça login.
2. Clique em **New repository**.
3. Dê o nome `gerenciador-equipamentos`, escolha **Public** e crie o repositório.
4. No repositório, clique em **Add file > Upload files**.
5. Envie `index.html`, `style.css`, `script.js` e `README.md` (os arquivos, não apenas a pasta ZIP).
6. Clique em **Commit changes**.
7. Para publicar o site, abra **Settings > Pages**.
8. Em **Build and deployment**, selecione **Deploy from a branch**.
9. Escolha a branch `main` e a pasta `/(root)`, depois clique em **Save**.
10. Aguarde a publicação. O endereço aparecerá na própria página GitHub Pages, normalmente no formato `https://SEU-USUARIO.github.io/gerenciador-equipamentos/`.

## Tecnologias

HTML5, CSS3, JavaScript (ES6+) e Web Storage API (`localStorage`).
