# Arquivo de exemplo para adicao dos gabaritos no banco de dados da API no Render. Para rodar (dentro de backend):
#     $env:API_URL="https://conecta-blocos-giborelli.onrender.com"
#     python inserir_gabaritos.py
####################################################################

import json
import os
import sys
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

API_URL = os.getenv(
    "API_URL",
    "https://conecta-blocos-giborelli.onrender.com",
).rstrip("/")

GABARITOS = [
    {
        "id_questao": "questao1",
        "code": "print(2 + 2)",
        "workspace_json": None,
    },
    {
        "id_questao": "questao2",
        "code": "print(13 < 18)",
        "workspace_json": None,
    },
    {
        "id_questao": "questao3",
        "code": "idade = 18\nif idade >= 16:\n    print(True)\nelse:\n    print(False)",
        "workspace_json": None,
    },
    {
        "id_questao": "questao4",
        "code": "for i in range(1, 11):\n    print(i)",
        "workspace_json": None,
    },
    {
        "id_questao": "questao5",
        "code": "print(21 / 5)",
        "workspace_json": None,
    },
]


def enviar_gabarito(gabarito: dict) -> None:
    body = json.dumps(gabarito).encode("utf-8")
    request = Request(
        f"{API_URL}/gabaritos",
        data=body,
        headers={"Content-Type": "application/json"},
        method="POST",
    )

    with urlopen(request) as response:
        resultado = json.loads(response.read().decode("utf-8"))
        print(f"{gabarito['id_questao']}: {resultado['status']}")


if __name__ == "__main__":
    print(f"Enviando gabaritos para {API_URL}")
    try:
        for gabarito in GABARITOS:
            enviar_gabarito(gabarito)
    except (HTTPError, URLError) as error:
        print(f"Erro ao enviar gabaritos: {error}", file=sys.stderr)
        raise SystemExit(1)
