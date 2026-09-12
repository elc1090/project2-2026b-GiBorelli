# project2-2026b-GiBorelli

Proposta: Criar uma ferramenta educacional para crianças aprenderem lógica de programação. A aplicação web terá uma interface onde o aluno resolve desafios arrastando blocos visuais no estilo Scratch, utilizando a biblioteca Blockly no frontend para interface e validação das respostas. Para atender o requisito de comunicação com o servidor e persistência de dados, o frontend enviará dados sobre as tentativas e resoluções dos desafios, como por exemplo, apelido do jogador, exercício resolvido, número de tentativas. O backend persistirá essas estatísticas no banco de dados, e o frontend também consumirá essa API para exibir um painel de de estatísticas das resoluções. 

Tecnologias escolhidas:
* Back-end: Python + FastAPI
* Banco de Dados: PostGresSQL
* Linguagens Front-end: HTML, CSS, JavaScript e Blockly
* Deploy: Vercel + Render
