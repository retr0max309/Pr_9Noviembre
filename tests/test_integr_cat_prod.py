import json

import pytest

from app import crud


@pytest.fixture
def db_temporal(tmp_path, monkeypatch):
    archivo = tmp_path / "db.json"
    archivo.write_text('{"categorias": [], "productos": []}', encoding="utf-8")
    monkeypatch.setattr(crud, "DB_FILE", archivo)
    return archivo


def test_crear_categoria_persiste_en_json(db_temporal):
    categoria = crud.create_categoria_db("Jardinería")

    datos = json.loads(db_temporal.read_text(encoding="utf-8"))
    assert categoria == {"id": 1, "nombre": "Jardinería"}
    assert datos["categorias"] == [categoria]


def test_crear_producto_relacionado_persiste_en_json(db_temporal):
    categoria = crud.create_categoria_db("Electrónica")
    producto = crud.create_producto_db("Laptop", categoria["id"])

    datos = json.loads(db_temporal.read_text(encoding="utf-8"))
    assert producto == {"id": 101, "nombre": "Laptop", "categoria_id": categoria["id"]}
    assert datos["productos"] == [producto]
