import { useEffect, useState } from 'react'

async function request(path, params) {
  const url = params ? `${path}?${new URLSearchParams(params)}` : path
  const response = await fetch(url, { method: params ? 'POST' : 'GET' })
  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.detail || 'No se pudo completar la solicitud')
  }

  return data
}

export default function App() {
  const [categorias, setCategorias] = useState([])
  const [productos, setProductos] = useState([])
  const [nombreCategoria, setNombreCategoria] = useState('')
  const [nombreProducto, setNombreProducto] = useState('')
  const [categoriaId, setCategoriaId] = useState('')
  const [cargando, setCargando] = useState(true)
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState('')

  async function cargarDatos() {
    const [nuevasCategorias, nuevosProductos] = await Promise.all([
      request('/categorias'),
      request('/productos'),
    ])
    setCategorias(nuevasCategorias)
    setProductos(nuevosProductos)
  }

  useEffect(() => {
    cargarDatos()
      .catch((err) => setError(err.message))
      .finally(() => setCargando(false))
  }, [])

  async function crearCategoria(event) {
    event.preventDefault()
    setGuardando(true)
    setError('')
    try {
      await request('/categorias', { nombre: nombreCategoria.trim() })
      setNombreCategoria('')
      await cargarDatos()
    } catch (err) {
      setError(err.message)
    } finally {
      setGuardando(false)
    }
  }

  async function crearProducto(event) {
    event.preventDefault()
    setGuardando(true)
    setError('')
    try {
      await request('/productos', {
        nombre: nombreProducto.trim(),
        categoria_id: categoriaId,
      })
      setNombreProducto('')
      setCategoriaId('')
      await cargarDatos()
    } catch (err) {
      setError(err.message)
    } finally {
      setGuardando(false)
    }
  }

  const nombresCategorias = new Map(categorias.map((categoria) => [categoria.id, categoria.nombre]))

  return (
    <main className="layout">
      <header className="hero">
        <span className="eyebrow">Sistema de catálogo</span>
        <h1>Categorías y productos</h1>
        <p>Organiza tu catálogo y agrega productos a cada categoría.</p>
        <div className="stats">
          <span><strong>{categorias.length}</strong> categorías</span>
          <span><strong>{productos.length}</strong> productos</span>
        </div>
      </header>

      {error && <div className="alert" role="alert">{error}</div>}

      <section className="panels">
        <article className="panel">
          <div className="panel-heading">
            <div>
              <span className="eyebrow">01 / Categorías</span>
              <h2>Crear categoría</h2>
            </div>
          </div>
          <form onSubmit={crearCategoria}>
            <label htmlFor="nombre-categoria">Nombre</label>
            <input
              id="nombre-categoria"
              value={nombreCategoria}
              onChange={(event) => setNombreCategoria(event.target.value)}
              placeholder="Ej. Jardinería"
              required
            />
            <button disabled={guardando || !nombreCategoria.trim()}>Agregar categoría</button>
          </form>
          <div className="list-heading">Categorías registradas</div>
          {cargando ? <p className="empty">Cargando...</p> : categorias.length === 0 ? (
            <p className="empty">Aún no hay categorías.</p>
          ) : (
            <ul className="list">
              {categorias.map((categoria) => (
                <li key={categoria.id}>
                  <span>{categoria.nombre}</span>
                  <small>#{categoria.id}</small>
                </li>
              ))}
            </ul>
          )}
        </article>

        <article className="panel">
          <div className="panel-heading">
            <div>
              <span className="eyebrow">02 / Productos</span>
              <h2>Crear producto</h2>
            </div>
          </div>
          <form onSubmit={crearProducto}>
            <label htmlFor="nombre-producto">Nombre</label>
            <input
              id="nombre-producto"
              value={nombreProducto}
              onChange={(event) => setNombreProducto(event.target.value)}
              placeholder="Ej. Laptop"
              required
            />
            <label htmlFor="categoria-producto">Categoría</label>
            <select
              id="categoria-producto"
              value={categoriaId}
              onChange={(event) => setCategoriaId(event.target.value)}
              required
            >
              <option value="">Selecciona una categoría</option>
              {categorias.map((categoria) => (
                <option key={categoria.id} value={categoria.id}>{categoria.nombre}</option>
              ))}
            </select>
            <button disabled={guardando || !nombreProducto.trim() || !categoriaId}>
              Agregar producto
            </button>
          </form>
          <div className="list-heading">Productos registrados</div>
          {cargando ? <p className="empty">Cargando...</p> : productos.length === 0 ? (
            <p className="empty">Aún no hay productos.</p>
          ) : (
            <ul className="list">
              {productos.map((producto) => (
                <li key={producto.id}>
                  <span>{producto.nombre}<small className="category">{nombresCategorias.get(producto.categoria_id) || 'Sin categoría'}</small></span>
                  <small>#{producto.id}</small>
                </li>
              ))}
            </ul>
          )}
        </article>
      </section>
    </main>
  )
}
