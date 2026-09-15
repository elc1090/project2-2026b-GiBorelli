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
const listaQuestoes = $('lista-questoes');
const tituloQuestao = $('titulo-questao');
const enunciadoQuestao = $('enunciado-questao');
const voltarHomeBtn = $('voltar-home-btn');
const executarBtn = $('executar-btn');

const questions = [
  {
    id: 'questao1',
    title: 'Questão 1',
    statement: 'Crie um algoritmo que some dois números e exiba o resultado.'
  },
  {
    id: 'questao2',
    title: 'Questão 2',
    statement: 'Crie um algoritmo que mostre se 13 é menor que 18.'
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
  voltarHomeBtn.classList.add('hidden');
}

function showQuestion(questionId) {
  saveCurrentQuestionState();
  const question = questions.find((item) => item.id === questionId);

  if (!question) return;

  currentQuestionId = questionId;
  tituloQuestao.textContent = question.title;
  enunciadoQuestao.textContent = question.statement;

  initWorkspace();
  loadQuestionState(questionId);

  homeView.classList.add('hidden');
  questionView.classList.remove('hidden');
  voltarHomeBtn.classList.remove('hidden');

  document.querySelectorAll('.questao-card').forEach((card) => {
    card.classList.toggle('active', card.dataset.questionId === questionId);
  });

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

executarBtn.addEventListener('click', enviaFastAPI);


const attemptsByQuestion = {};

async function enviaFastAPI() {
  if (!workspace || !currentQuestionId) return;

  const nome_usuario = document.getElementById('nome-usuario').value.trim();
  const code = Blockly.Python.workspaceToCode(workspace);
  const workspaceJson = Blockly.serialization.workspaces.save(workspace);
  const nTentativas = (attemptsByQuestion[currentQuestionId] ?? 0) + 1;

  attemptsByQuestion[currentQuestionId] = nTentativas;

  try {
    const resposta = await fetch('http://127.0.0.1:8000/run-blocks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nome: nomeUsuario,
        nome_usuario: nomeUsuario,
        id_questao: currentQuestionId,
        question_id: currentQuestionId,
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