import React, { useState } from 'react'
import { MessageSquareQuote, Pencil, Trash, Search, Plus } from 'lucide-react'
import useDataBlog from './UseDataBlogs'

export default function BlogTable() {
  const { blogs, loading, error, addBlog, updateBlog, deleteBlog } = useDataBlog()
  const [searchTerm, setSearchTerm] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedBlog, setSelectedBlog] = useState(null)
  const [editBlog, setEditBlog] = useState(null)
  const [deleteConfirmBlog, setDeleteConfirmBlog] = useState(null)

  const [form, setForm] = useState({
    titulo: '',
    contenido: '',
    imagen: '',
  })

  // Función para formatear fechas
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Fecha inválida';
      return date.toLocaleDateString();
    } catch (error) {
      console.error('Error al formatear fecha:', error);
      return 'Error en fecha';
    }
  }

  // Función para mapear campos del backend a frontend
  const mapBlogFields = (blog) => {
    return {
      _id: blog._id,
      id: blog._id,
      titulo: blog.titulo || blog.title || '',
      contenido: blog.contenido || blog.content || '',
      imagen: blog.imagen || blog.image || ''
    };
  }

  const filteredBlogs = blogs
    .map(mapBlogFields)
    .filter((blog) =>
      `${blog.titulo} ${blog.contenido}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    )

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleCreate = async () => {
    try {
      // Crear objeto con los campos que espera el backend
      const blogData = {
        // Campos con nombres del backend
        title: form.titulo,
        content: form.contenido,
        image: form.imagen,
        // También incluir campos con nombres del frontend para compatibilidad
        titulo: form.titulo,
        contenido: form.contenido,
        imagen: form.imagen
      }
      
      await addBlog(blogData)
      setModalOpen(false)
      setForm({ titulo: '', contenido: '', imagen: '' })
    } catch (error) {
      console.error('Error al crear blog:', error)
    }
  }

  // Para editar blog
  const [editForm, setEditForm] = useState({
    titulo: '',
    contenido: '',
    imagen: ''
  })

  // Actualizar editForm cuando cambia editBlog
  React.useEffect(() => {
    if (editBlog) {
      setEditForm({
        titulo: editBlog.titulo || editBlog.title || '',
        contenido: editBlog.contenido || editBlog.content || '',
        imagen: editBlog.imagen || editBlog.image || ''
      })
    }
  }, [editBlog])

  const handleEditInputChange = (e) => {
    const { name, value } = e.target
    setEditForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleUpdate = async () => {
    try {
      // Crear objeto con los campos que espera el backend
      const blogData = {
        // Campos con nombres del backend
        title: editForm.titulo,
        content: editForm.contenido,
        image: editForm.imagen,
        // También incluir campos con nombres del frontend para compatibilidad
        titulo: editForm.titulo,
        contenido: editForm.contenido,
        imagen: editForm.imagen
      }
      
      await updateBlog(editBlog._id, blogData)
      setEditBlog(null)
    } catch (error) {
      console.error('Error al actualizar blog:', error)
    }
  }

  const handleDeleteConfirm = async () => {
    if (!deleteConfirmBlog) return
    try {
      await deleteBlog(deleteConfirmBlog._id)
      setDeleteConfirmBlog(null)
    } catch (error) {
      console.error('Error al eliminar blog:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="text-lg font-medium text-gray-700">Cargando datos...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <p>Error al cargar blogs: {error}</p>
      </div>
    )
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4 relative">
      <div
        className={`w-full max-w-5xl bg-white p-6 rounded-lg shadow-md transition-all duration-300 ${
          modalOpen || selectedBlog || editBlog || deleteConfirmBlog
            ? 'blur-sm pointer-events-none select-none'
            : ''
        }`}
      >
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Blogs</h1>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-200"
            onClick={() => setModalOpen(true)}
          >
            <Plus className="h-4 w-4 inline mr-2" />
            Agregar Blog
          </button>
        </div>

        <div className="flex relative mb-4">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Buscar blogs por título o contenido..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            disabled={modalOpen || selectedBlog || editBlog || deleteConfirmBlog}
          />
        </div>

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
                  <td className="p-3">{blog.contenido ? blog.contenido.slice(0, 40) + '...' : 'Sin contenido'}</td>
                  <td className="p-3">
                    {blog.imagen ? (
                      <img
                        src={blog.imagen}
                        alt="Blog"
                        className="w-16 h-16 object-cover rounded"
                      />
                    ) : (
                      <span className="text-gray-400">Sin imagen</span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center p-4 text-gray-500">
                  {searchTerm ? 'No se encontraron blogs con ese término de búsqueda.' : 'No hay blogs registrados.'}
                  {!searchTerm && (
                    <div className="mt-4">
                      <button 
                        onClick={() => setModalOpen(true)}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Agregar Primer Blog
                      </button>
                    </div>
                  )}
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
          <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-lg z-10">
            <h2 className="text-xl font-bold mb-4">Agregar Blog</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleCreate()
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Contenido</label>
                <textarea
                  name="contenido"
                  placeholder="Contenido"
                  className="w-full border p-2 rounded"
                  value={form.contenido}
                  onChange={handleInputChange}
                  required
                  rows="4"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Imagen del blog</label>
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
                />
                {form.imagen && (
                  <img
                    src={form.imagen}
                    alt="Vista previa"
                    className="mt-2 w-32 h-32 object-cover rounded border"
                  />
                )}
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  className="px-4 py-2 rounded border text-gray-700 hover:bg-gray-50"
                  onClick={() => setModalOpen(false)}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Editar Blog */}
      {editBlog && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Editar Blog</h2>
            <form onSubmit={(e) => { e.preventDefault(); handleUpdate(); }}>
              <div className="space-y-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                  <input
                    type="text"
                    name="titulo"
                    value={editForm.titulo}
                    onChange={handleEditInputChange}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contenido</label>
                  <textarea
                    name="contenido"
                    value={editForm.contenido}
                    onChange={handleEditInputChange}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                    rows="4"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Imagen</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0]
                      if (file) {
                        const imageUrl = URL.createObjectURL(file)
                        setEditForm((prev) => ({ ...prev, imagen: imageUrl }))
                      }
                    }}
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                  {editForm.imagen && (
                    <img
                      src={editForm.imagen}
                      alt="Vista previa"
                      className="mt-2 w-32 h-32 object-cover rounded border"
                    />
                  )}
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditBlog(null)}
                  className="px-4 py-2 rounded border text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                >
                  Actualizar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Confirmar Eliminación */}
      {deleteConfirmBlog && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Confirmar Eliminación</h2>
            <p className="mb-6">¿Está seguro que desea eliminar el blog <strong>"{deleteConfirmBlog.titulo}"</strong>?</p>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmBlog(null)}
                className="px-4 py-2 rounded border text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
              >
                Eliminar
              </button>
            </div>
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
            {selectedBlog.imagen && (
              <div className="mt-4">
                <img
                  src={selectedBlog.imagen}
                  alt="Blog"
                  className="w-full max-h-60 object-cover rounded"
                />
              </div>
            )}
            <div className="flex justify-end mt-6">
              <button
                className="px-4 py-2 rounded border hover:bg-gray-50"
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
