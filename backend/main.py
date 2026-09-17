from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import select
from sqlalchemy.orm import Session

from database import get_db, init_db
from models import Gabarito, Tentativa
from schemas import GabaritoCreate, TentativaCreate

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def normalize_code(code: str) -> str:
    return "\n".join(line.strip() for line in code.strip().splitlines() if line.strip())


@app.on_event("startup")
def startup_event():
    init_db()


@app.post("/run-blocks")
async def run_blockly_logic(data: TentativaCreate, db: Session = Depends(get_db)):
    try:
        nome = data.nome.strip()
        tentativa = db.scalar(
            select(Tentativa).where(
                Tentativa.nome == nome,
                Tentativa.id_questao == data.id_questao,
            )
        )

        if tentativa:
            tentativa.n_tentativas += 1
            tentativa.code = data.code
            tentativa.workspace_json = data.workspace_json
        else:
            tentativa = Tentativa(
                nome=nome,
                id_questao=data.id_questao,
                n_tentativas=1,
                code=data.code,
                workspace_json=data.workspace_json,
            )
            db.add(tentativa)

        db.commit()
        db.refresh(tentativa)

        gabarito = db.scalar(
            select(Gabarito).where(Gabarito.id_questao == data.id_questao)
        )
        correta = bool(
            gabarito
            and normalize_code(data.code) == normalize_code(gabarito.code)
        )

        if gabarito is None:
            mensagem = "Tentativa salva, mas o gabarito desta questão ainda não foi cadastrado."
        elif correta:
            mensagem = "Código de acordo com o gabarito."
        else:
            mensagem = "Código diferente do gabarito."

        return {
            "status": "success",
            "message": mensagem,
            "correta": correta,
            "gabarito_cadastrado": gabarito is not None,
            "nome": tentativa.nome,
            "id_questao": tentativa.id_questao,
            "n_tentativas": tentativa.n_tentativas,
            "received_code": data.code,
            "tentativa_id": tentativa.id,
        }
    except Exception:
        db.rollback()
        raise


@app.get("/tentativas")
async def list_attempts(
    nome: str | None = None,
    id_questao: str | None = None,
    db: Session = Depends(get_db),
):
    query = select(Tentativa).order_by(Tentativa.id_questao)
    if nome:
        query = query.where(Tentativa.nome == nome)
    if id_questao:
        query = query.where(Tentativa.id_questao == id_questao)

    tentativas = db.scalars(query).all()
    return [
        {
            "id": tentativa.id,
            "nome": tentativa.nome,
            "id_questao": tentativa.id_questao,
            "n_tentativas": tentativa.n_tentativas,
            "code": tentativa.code,
            "workspace_json": tentativa.workspace_json,
            "criado_em": tentativa.criado_em,
        }
        for tentativa in tentativas
    ]


@app.post("/gabaritos")
async def create_answer_key(data: GabaritoCreate, db: Session = Depends(get_db)):
    gabarito = db.scalar(
        select(Gabarito).where(Gabarito.id_questao == data.id_questao)
    )

    if gabarito:
        gabarito.code = data.code
        gabarito.workspace_json = data.workspace_json
    else:
        gabarito = Gabarito(
            id_questao=data.id_questao,
            code=data.code,
            workspace_json=data.workspace_json,
        )
        db.add(gabarito)

    db.commit()
    db.refresh(gabarito)
    return {"status": "success", "id": gabarito.id, "id_questao": gabarito.id_questao}


@app.get("/gabaritos/{id_questao}")
async def get_answer_key(id_questao: str, db: Session = Depends(get_db)):
    gabarito = db.scalar(
        select(Gabarito).where(Gabarito.id_questao == id_questao)
    )
    if not gabarito:
        raise HTTPException(status_code=404, detail="Gabarito não encontrado.")

    return {
        "id_questao": gabarito.id_questao,
        "code": gabarito.code,
        "workspace_json": gabarito.workspace_json,
    }

