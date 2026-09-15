# Projeto: Aplicação com persistência de dados em backend

![projeto](./moho_follow_through2.gif "GIF animado do projeto. Imagem temporária de Moho Animation https://moho.lostmarble.com/products/moho-pro-special-halls-head-college")


## Acesso
Acesso ao app: conectablocos-frontend.vercel.app

Como o deploy do backend está no Render, é possível que haja algum atraso na resposta se ele estiver "adormecido". Para resolver isso, é só esperar ou acessá-lo em: [deploy backend](conecta-blocos-giborelli.onrender.com)

## Desenvolvedor(a)
**Giovana Borelli** - Ciência da Computação

## Proposta
Proposta: Criar uma ferramenta educacional para crianças aprenderem lógica de programação. A aplicação web terá uma interface onde o aluno resolve desafios arrastando blocos visuais no estilo Scratch, utilizando a biblioteca Blockly no frontend para interface e validação das respostas. Para atender o requisito de comunicação com o servidor e persistência de dados, o frontend enviará dados sobre as tentativas e resoluções dos desafios, como por exemplo, apelido do jogador, exercício resolvido, número de tentativas. O backend persistirá essas estatísticas no banco de dados, e o frontend também consumirá essa API para exibir um painel de de estatísticas das resoluções. 

> O Blockly é uma biblioteca de desenvolvimento de código aberto da Raspberry Pi Foundation, originalmente desenvolvida no Google. Ele cria uma interface de programação visual que utiliza blocos de arrastar e soltar.

## Parceria
**Lucas Xavier Pairé** - Ciência da Computação

## Feedback/comentário da parceria/cliente/usuário
Na modalidade A (parceria dev), o foco principal do feedback/comentário estará nas diferenças percebidas no código.

## Desenvolvimento

### Processo

A proposta era criar questões sobre pensamento computacional e usar a programação em blocos para resolvê-los. Ao iniciair o projeto, desconhecia a biblioteca Blockly e foi por recomendação da professora Andrea e de sites na internet que decidimos usá-la. 

Decidi usar telas separadas para a construção de cada questão a fim de evitar confusão ou elementos em demasia em uma mesma tela, buscando a simplicidade na interface e tornando-a mais amigável. Cada questão é estática, então está diretamente escrita no arquivo [Javascript](./frontend/script.js).

O deploy do backend no Render foi complicado e demorado, porque o Banco de Dados (BD) não era reconhecido. Para encontrar onde estava o erro ou como corrigir ele, procurei nos sites recomendados pelo log da aplicação e tinha dois problemas principais: 
1. O pacote psycopg geralmente não é identificado como necessário se já está em uso o psycopg2, então o requirements.txt não incluiu ele, impedindo que o deploy acontecesse.
2. Ao criar as aplicações de BD e backend, foi recomendado usar a mesma região física para os acessos serem internos. Entretanto, o Render não conseguia identificar o BD internamente, portanto foi utilizado o URL externo.

### Trechos de código

Gostaria de destacar esse primeiro trecho de código, porque
```arq

```

O segundo trecho de código está relacionado com
```arq

```

O terceiro e último trecho que foi separado é para destacar
```arq

```

## Tecnologias

### Linguagens e afins
- Back-end: Python (com FastAPI)
- Banco de Dados: PostgreSQL
- Linguagens Front-end: HTML, CSS, JavaScript e Blockly
- Deploy: Vercel + Render

### Ambiente de desenvolvimento
- VS Code
- Gemini 3.1 Pro
- Github Copilot Chat

## Referências e créditos

Substitua este trecho por uma lista bem detalhada de todo material 
- Blockly: (https://docs.blockly.com/guides/get-started/)
- FastAPI: https://fastapi.tiangolo.com/tutorial/
    * Conexão com Banco de Dados Relacional: https://www.youtube.com/watch?v=NvOV3ig2tGY
- Render:
    * Configurações: https://render.com/docs/deploy-fastapi
    * Application log (recomendados para corrigir erros): https://render.com/docs/troubleshooting-deploys (genérico) e https://docs.sqlalchemy.org/en/20/errors.html#error-e3q8 (erro específico)


---
Projeto entregue para a disciplina de [Desenvolvimento de Software para a Web](http://github.com/andreainfufsm/elc1090-2026b) em 2026b