from fastapi import FastAPI
import uvicorn
import os
from dotenv import load_dotenv
from fastapi.openapi.utils import get_openapi
from fastapi.middleware.cors import CORSMiddleware
#from fastapi.security import OAuth2PasswordBearer
from database import engine
from pydantic import BaseModel
from sqlalchemy.orm import declarative_base


load_dotenv(".env")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class BlocklyData(BaseModel):
    code: str
    workspace_json: dict | None = None

# @app.get("/")
# def read_root():
#     return {"Hello": "World"}

@app.post("/run-blocks")
async def run_blockly_logic(data: BlocklyData):
    try:
        return {
            "status": "success",
            "received_code": data.code,
            "message": "Os dados do Blockly foram processados"
        }
    except Exception as e:
        return {"status": "error", "message": str(e)}

