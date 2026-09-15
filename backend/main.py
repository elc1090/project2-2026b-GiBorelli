from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from database import get_db, init_db
from models import Tentativa
from schemas import BlocklyData

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def startup_event():
    init_db()


@app.post("/run-blocks")
async def run_blockly_logic(data: BlocklyData, db: Session = Depends(get_db)):
    try:
        nome = (data.nome or data.nome_usuario or "").strip()
        id_questao = data.id_questao

        if not nome or not id_questao:
            return {
                "status": "error",
                "message": "Nome e escolha da questão são obrigatórios."
            }

        tentativa = Tentativa(
            nome=nome,
            id_questao=id_questao,
            n_tentativas=data.n_tentativas,
        )

        db.add(tentativa)
        db.commit()
        db.refresh(tentativa)

        return {
            "status": "success",
            "message": "Tentativa salva com sucesso.",
            "nome": nome,
            "id_questao": id_questao,
            "n_tentativas": data.n_tentativas,
            "received_code": data.code,
            "tentativa_id": tentativa.id,
        }
    except Exception as e:
        return {"status": "error", "message": str(e)}

