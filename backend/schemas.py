from pydantic import BaseModel, Field

class TentativaCreate(BaseModel):
    nome: str = Field(min_length=1)
    id_questao: str = Field(min_length=1)
    n_tentativas: int = Field(ge=1)
    code: str = ""
    workspace_json: dict | None = None


class GabaritoCreate(BaseModel):
    id_questao: str = Field(min_length=1)
    code: str = Field(min_length=1)
    workspace_json: dict | None = None