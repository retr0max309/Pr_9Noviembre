# Catálogo de categorías y productos

API en **FastAPI (Python)** con datos en `app/db.json` e interfaz en **React + Vite**.

## Iniciar el backend

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8005
```

La documentación de la API está en `http://127.0.0.1:8005/docs`.

## Iniciar el frontend

En otra terminal:

```powershell
cd frontend
npm ci
npm run dev
```

Abre `http://127.0.0.1:5173`. Vite redirige las rutas `/categorias` y `/productos` al backend del puerto 8005.

## API

| Método | Ruta | Acción |
| --- | --- | --- |
| GET | `/categorias` | Lista categorías |
| POST | `/categorias?nombre=...` | Crea una categoría |
| GET | `/productos` | Lista productos |
| POST | `/productos?nombre=...&categoria_id=...` | Crea un producto |

Los parámetros de creación se envían en la URL porque así está definida la API existente.

## Pruebas

```powershell
python -m pytest -q
```

Hay dos pruebas unitarias de la lógica CRUD, dos de integración con un archivo JSON temporal y dos flujos E2E de la API con `TestClient`. Ninguna prueba modifica `app/db.json`. GitHub Actions ejecuta las seis pruebas y compila el frontend en cada push o pull request hacia `dev`.

## Artefactos de GitHub Actions

En cada ejecución del workflow **Pruebas de Python y compilación de React** aparecen cuatro tareas: pruebas unitarias, pruebas de integración, pruebas E2E de la API y compilación de React. En la parte inferior de la ejecución puedes descargar los informes XML de cada nivel y el artefacto **frontend-react**, que contiene los archivos estáticos compilados de `frontend/dist`.

El artefacto permite desplegar el frontend en un servidor estático. Para que los formularios funcionen fuera del desarrollo local, ese servidor debe redirigir `/categorias` y `/productos` a un backend FastAPI en funcionamiento.
