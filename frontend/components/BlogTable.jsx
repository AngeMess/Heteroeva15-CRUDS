import React, { useState } from 'react'
import { MessageSquareQuote } from 'lucide-react'

const initialBlogs = [
  {
    id: 1,
    titulo: 'Nuevo lanzamiento de producto',
    contenido: 'Estamos emocionados de anunciar el lanzamiento de nuestro nuevo producto.',
    imagen: 'https://inkscape.app/wp-content/uploads/imagen-vectorial.webp',
  },
  {
    id: 2,
    titulo: 'Tips de productividad',
    contenido: 'Aprende a mejorar tu día con estos consejos de productividad.',
    imagen: 'https://inkscape.app/wp-content/uploads/imagen-vectorial.webp',
  },
]

export default function BlogTable() {
  const [blogs, setBlogs] = useState(initialBlogs)
  const [searchTerm, setSearchTerm] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedBlog, setSelectedBlog] = useState(null)

  const [form, setForm] = useState({
    titulo: '',
    contenido: '',
    imagen: '',
  })

  const filteredBlogs = blogs.filter((blog) =>
    `${blog.titulo} ${blog.contenido}`.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleCreate = () => {
    const newBlog = { ...form, id: Date.now() }
    setBlogs([...blogs, newBlog])
    setModalOpen(false)
    setForm({ titulo: '', contenido: '', imagen: '' })
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4 relative">
      <div
        className={`w-full max-w-5xl bg-white p-6 rounded-lg shadow-md transition-all duration-300 ${
          modalOpen || selectedBlog ? 'blur-sm pointer-events-none select-none' : ''
        }`}
      >
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Blogs</h1>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={() => setModalOpen(true)}
          >
            Crear
          </button>
        </div>

        <input
          type="text"
          placeholder="Buscar blog..."
          className="mb-4 w-full p-2 border border-gray-300 rounded"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <table className="min-w-full table-auto border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Icono</th>
              <th className="p-3 text-left">Título</th>
              <th className="p-3 text-left">Contenido</th>
              <th className="p-3 text-left">Imagen</th>
            </tr>
          </thead>
          <tbody>
            {filteredBlogs.length > 0 ? (
              filteredBlogs.map((blog) => (
                <tr
                  key={blog.id}
                  className="border-t border-gray-200 hover:bg-gray-50 cursor-pointer"
                  onClick={() => setSelectedBlog(blog)}
                >
                  <td className="p-3">
                    <MessageSquareQuote className="h-5 w-5 text-gray-600" />
                  </td>
                  <td className="p-3">{blog.titulo}</td>
                  <td className="p-3">{blog.contenido.slice(0, 40)}...</td>
                  <td className="p-3">
                    <img
                      src={blog.imagen}
                      alt="Blog"
                      className="w-16 h-16 object-cover rounded"
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center p-4 text-gray-500">
                  No se encontraron blogs.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Crear Blog */}
      {modalOpen && (
        <div className="fixed z-50 inset-0 flex justify-center items-center p-4">
          <div className="absolute inset-0 bg-black bg-opacity-30 backdrop-blur-sm"></div>
          <div className="bg-white rounded-lg max-w-lg w-full p-6 shadow-lg z-10">
            <h2 className="text-xl font-bold mb-4">Crear blog</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleCreate()
              }}
              className="space-y-4"
            >
              <div>
                <label className="block mb-1 font-semibold">Título</label>
                <input
                  type="text"
                  name="titulo"
                  placeholder="Título"
                  className="w-full border p-2 rounded"
                  value={form.titulo}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <label className="block mb-1 font-semibold">Contenido</label>
                <textarea
                  name="contenido"
                  placeholder="Contenido"
                  className="w-full border p-2 rounded"
                  value={form.contenido}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <label className="block mb-1 font-semibold">Imagen del blog</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0]
                    if (file) {
                      const imageUrl = URL.createObjectURL(file)
                      setForm((prev) => ({ ...prev, imagen: imageUrl }))
                    }
                  }}
                  className="w-full border p-2 rounded"
                  required
                />
                {form.imagen && (
                  <img
                    src={form.imagen}
                    alt="Vista previa"
                    className="mt-2 w-32 h-32 object-cover rounded border"
                  />
                )}
              </div>

              <div className="flex justify-end gap-4 mt-4">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded border"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-blue-600 text-white"
                >
                  Crear
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Ver Detalle Blog */}
      {selectedBlog && (
        <div className="fixed z-50 inset-0 flex justify-center items-center p-4">
          <div className="absolute inset-0 bg-black bg-opacity-30 backdrop-blur-sm"></div>
          <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-lg z-10">
            <h2 className="text-xl font-bold mb-4">Detalle del Blog</h2>
            <p><strong>Título:</strong> {selectedBlog.titulo}</p>
            <p className="mt-2"><strong>Contenido:</strong> {selectedBlog.contenido}</p>
            <div className="mt-4">
              <img
                src={selectedBlog.imagen}
                alt="Blog"
                className="w-full max-h-60 object-cover rounded"
              />
            </div>
            <div className="flex justify-end mt-6">
              <button
                className="px-4 py-2 rounded border"
                onClick={() => setSelectedBlog(null)}
              >
                Regresar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
