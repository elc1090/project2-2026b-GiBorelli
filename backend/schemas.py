from pydantic import BaseModel, Field

class BlocklyData(BaseModel):
    nome: str | None = None
    nome_usuario: str | None = None
    id_questao: str | None = None
    question_id: str | None = None
    n_tentativas: int = Field(default=1, ge=1)
    code: str | None = None
    workspace_json: dict | None = None