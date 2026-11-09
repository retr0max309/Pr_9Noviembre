import json

import pytest
from fastapi.testclient import TestClient

from app import crud
from app.main import app


@pytest.fixture
def cliente_api(tmp_path, monkeypatch):
    archivo = tmp_path / "db.json"
    archivo.write_text('{"categorias": [], "productos": []}', encoding="utf-8")
    monkeypatch.setattr(crud, "DB_FILE", archivo)
    return TestClient(app), archivo


def test_flujo_completo_de_categoria(cliente_api):
    cliente, archivo = cliente_api

    assert cliente.get("/categorias").json() == []
    respuesta = cliente.post("/categorias", params={"nombre": "Jardinería"})
    assert respuesta.status_code == 200
    categoria = respuesta.json()
    assert categoria == {"id": 1, "nombre": "Jardinería"}
    assert cliente.get("/categorias").json() == [categoria]
    assert json.loads(archivo.read_text(encoding="utf-8"))["categorias"] == [categoria]


def test_flujo_completo_de_producto(cliente_api):
    cliente, archivo = cliente_api

    categoria = cliente.post("/categorias", params={"nombre": "Electrónica"}).json()
    respuesta = cliente.post(
        "/productos", params={"nombre": "Laptop", "categoria_id": categoria["id"]}
    )
    assert respuesta.status_code == 200
    producto = respuesta.json()
    assert producto == {"id": 101, "nombre": "Laptop", "categoria_id": categoria["id"]}
    assert cliente.get("/productos").json() == [producto]
    assert json.loads(archivo.read_text(encoding="utf-8"))["productos"] == [producto]
