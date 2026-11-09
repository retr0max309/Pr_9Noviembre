from unittest.mock import patch

from app import crud


def test_crear_categoria_asigna_siguiente_id_y_guarda():
    datos = {
        "categorias": [{"id": 10, "nombre": "Inicial"}],
        "productos": [],
    }

    with patch.object(crud, "_load_db", return_value=datos), patch.object(crud, "_save_db") as guardar:
        categoria = crud.create_categoria_db("Jardinería")

    assert categoria == {"id": 11, "nombre": "Jardinería"}
    guardar.assert_called_once_with(datos)
    assert datos["categorias"][-1] == categoria


def test_producto_con_categoria_inexistente_no_guarda():
    datos = {"categorias": [{"id": 1, "nombre": "Electrónica"}], "productos": []}

    with patch.object(crud, "_load_db", return_value=datos), patch.object(crud, "_save_db") as guardar:
        resultado = crud.create_producto_db("Tijeras", categoria_id=99)

    assert resultado == {"error": "Categoría no encontrada"}
    assert datos["productos"] == []
    guardar.assert_not_called()
