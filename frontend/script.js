const workspace = Blockly.inject('blockly-edit', {
  toolbox: document.getElementById('toolbox')
});

function geraCodigo() {
  const codigo = Blockly.JavaScript.workspaceToCode(workspace);
  console.log(codigo);
}

async function enviaFastAPI() {
  const code = Blockly.Python.workspaceToCode(workspace);
  const workspaceJson = Blockly.serialization.workspaces.save(workspace);

  try {
    const resposta = await fetch('http://127.0.0.1:8000/run-blocks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, workspace_json: workspaceJson })
    });

    const resultado = await resposta.json();
    alert('Resposta do backend: ' + JSON.stringify(resultado));
  } catch (e) {
    console.error('Erro ao enviar os dados ao FastAPI:', e);
  }
}