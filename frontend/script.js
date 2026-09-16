const toolbox = {
  kind: 'categoryToolbox',
  contents: [
    {
      kind: 'category',
      name: 'Números e Texto',
      contents: [
        { kind: 'block', type: 'math_number' },
        { kind: 'block', type: 'math_arithmetic' },
        { kind: 'block', type: 'text' },
        { kind: 'block', type: 'text_print' }
      ]
    },
    {
      kind: 'category',
      name: 'Variáveis',
      contents: [
        { kind: 'block', type: 'variables_set' },
        { kind: 'block', type: 'variables_get' }
      ]
    },
    {
      kind: 'category',
      name: 'Comparação',
      contents: [
        { kind: 'block', type: 'logic_compare' },
        { kind: 'block', type: 'logic_operation' },
        { kind: 'block', type: 'logic_boolean' }
      ]
    },
    {
      kind: 'category',
      name: 'Condicional',
      contents: [
        { kind: 'block', type: 'controls_if' }
      ]
    },
    {
      kind: 'category',
      name: 'Repetição',
      contents: [
        { kind: 'block', type: 'controls_for' }
      ]
    }
  ]
};

function initWorkspace() {
  if (workspace) return;

  workspace = Blockly.inject('blockly-edit', {
    toolbox,
    move: { scrollbars: true, drag: true, wheel: true }
  });
}


let workspace = null;
let currentQuestionId = null;
const questionStates = {};

const $ = (id) => document.getElementById(id);
const homeView = $('home-view');
const questionView = $('question-view');
const statisticsView = $('statistics-view');
const listaQuestoes = $('lista-questoes');
const listaEstatisticas = $('lista-estatisticas');
const nomeEstatisticas = $('nome-estatisticas');
const tituloQuestao = $('titulo-questao');
const enunciadoQuestao = $('enunciado-questao');
const voltarHomeBtn = $('voltar-home-btn');
const executarBtn = $('executar-btn');
const estatisticasBtn = $('estatisticas-btn');

const apiUrl = window.API_URL || (
  window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://127.0.0.1:8000'
    : 'https://conecta-blocos-giborelli.onrender.com'
);

const questions = [
  {
    id: 'questao1',
    title: 'Questão 1',
    statement: 'Crie um algoritmo que some 2+2 e exiba o resultado.'
  },
  {
    id: 'questao2',
    title: 'Questão 2',
    statement: 'Crie um algoritmo que mostre se 13 é menor que 18.'
  },
  {
    id: 'questao3',
    title: 'Questão 3',
    statement: 'Pense em um código que indique se uma pessoa, de acordo com a idade, pode votar ou não (considerando as leis do Brasil). Monte-o no espaço de blocos.'
  },
  {
    id: 'questao4',
    title: 'Questão 4',
    statement: 'Crie um algoritmo que mostre os números de 1 a 10.'
  },
  {
    id: 'questao5',
    title: 'Questão 5',
    statement: 'Crie um algoritmo que calcule 21 dividido por 5.'
  }
];

function renderQuestionList() {
  listaQuestoes.innerHTML = questions
    .map(
      (question) => `
        <article class="questao-card" data-question-id="${question.id}">
          <div>
            <h3>${question.title}</h3>
          </div>
          <p>${question.statement}</p>
          <button type="button">Abrir questão</button>
        </article>
      `
    )
    .join('');
}

function saveCurrentQuestionState() {
  if (!currentQuestionId || !workspace) return;

  questionStates[currentQuestionId] = Blockly.serialization.workspaces.save(workspace);
}

function loadQuestionState(questionId) {
  if (!workspace) return;

  const savedState = questionStates[questionId];
  workspace.clear();

  if (savedState) {
    Blockly.serialization.workspaces.load(savedState, workspace);
  }
}

function showHome() {
  homeView.classList.remove('hidden');
  questionView.classList.add('hidden');
  statisticsView.classList.add('hidden');
  voltarHomeBtn.classList.add('hidden');
}

function showStatistics() {
  const nome = $('nome-usuario').value.trim();

  if (!nome) {
    alert('Digite seu nome antes de consultar as estatísticas.');
    return;
  }

  saveCurrentQuestionState();
  homeView.classList.add('hidden');
  //questionView.classList.add('hidden');
  statisticsView.classList.remove('hidden');
  voltarHomeBtn.classList.remove('hidden');
  nomeEstatisticas.textContent = `Tentativas de ${nome}`;
  carregarEstatisticas(nome);
}

async function carregarEstatisticas(nome) {
  listaEstatisticas.innerHTML = '<p>Carregando estatísticas...</p>';

  try {
    const resposta = await fetch(
      `${apiUrl}/tentativas?nome=${encodeURIComponent(nome)}`
    );

    if (!resposta.ok) throw new Error('Não foi possível consultar as tentativas.');

    const tentativas = await resposta.json();
    const questionById = Object.fromEntries(questions.map((question) => [question.id, question]));

    if (tentativas.length === 0) {
      listaEstatisticas.innerHTML = '<p>Nenhuma questão tentada ainda.</p>';
      return;
    }

    listaEstatisticas.innerHTML = tentativas
      .map((tentativa) => {
        const question = questionById[tentativa.id_questao];
        const titulo = question ? question.title : tentativa.id_questao;
        return `<div class="estatistica-item">
          <span>${titulo}</span>
          <strong>${tentativa.n_tentativas} ${tentativa.n_tentativas === 1 ? 'tentativa' : 'tentativas'}</strong>
        </div>`;
      })
      .join('');
  } catch (error) {
    listaEstatisticas.innerHTML = '<p>Não foi possível carregar as estatísticas.</p>';
    console.error('Erro ao consultar as estatísticas:', error);
  }
}

function showQuestion(questionId) {
  saveCurrentQuestionState();
  const question = questions.find((item) => item.id === questionId);

  if (!question) return;

  currentQuestionId = questionId;
  tituloQuestao.textContent = question.title;
  enunciadoQuestao.textContent = question.statement;

  homeView.classList.add('hidden');
  questionView.classList.remove('hidden');
  //statisticsView.classList.add('hidden');
  voltarHomeBtn.classList.remove('hidden');

  document.querySelectorAll('.questao-card').forEach((card) => {
    card.classList.toggle('active', card.dataset.questionId === questionId);
  });

  initWorkspace();
  loadQuestionState(questionId);

  setTimeout(() => {
    if (workspace) {
      Blockly.svgResize(workspace);
    }
  }, 0);
}

listaQuestoes.addEventListener('click', (event) => {
  const card = event.target.closest('.questao-card');
  if (!card) return;

  showQuestion(card.dataset.questionId);
});

voltarHomeBtn.addEventListener('click', () => {
  saveCurrentQuestionState();
  showHome();
});

estatisticasBtn.addEventListener('click', showStatistics);

executarBtn.addEventListener('click', enviaFastAPI);


const attemptsByQuestion = {};

async function enviaFastAPI() {
  if (!workspace || !currentQuestionId) return;

  const nome = document.getElementById('nome-usuario').value.trim();
  if (!nome) {
    alert('Digite seu nome antes de executar.');
    return;
  }

  const code = Blockly.Python.workspaceToCode(workspace);
  const workspaceJson = Blockly.serialization.workspaces.save(workspace);
  const nTentativas = (attemptsByQuestion[currentQuestionId] ?? 0) + 1;

  attemptsByQuestion[currentQuestionId] = nTentativas;

  try {
    const resposta = await fetch(`${apiUrl}/run-blocks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nome,
        id_questao: currentQuestionId,
        n_tentativas: nTentativas,
        code,
        workspace_json: workspaceJson
      })
    });

    const resultado = await resposta.json();
    alert('Resposta do backend: ' + JSON.stringify(resultado));
  } catch (e) {
    console.error('Erro ao enviar os dados ao FastAPI:', e);
  }
}

renderQuestionList();
showHome();