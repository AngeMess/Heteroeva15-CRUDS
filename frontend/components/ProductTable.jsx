import React, { useState, useEffect } from 'react'
import { Archive, Pencil, Trash, Plus, Search } from 'lucide-react'
import useDataProduct from './UseDataProducts'

export default function ProductTable() {
    const { products, loading, error, addProduct, updateProduct, deleteProduct: removeProduct } = useDataProduct()
    const [searchTerm, setSearchTerm] = useState('')
    const [modalOpen, setModalOpen] = useState(false)
    const [selectedProduct, setSelectedProduct] = useState(null)
    const [editProduct, setEditProduct] = useState(null)
    const [deleteConfirmProduct, setDeleteConfirmProduct] = useState(null)

    const [form, setForm] = useState({
        nombre: '',
        descripcion: '',
        precio: '',
        stock: '',
    })
    
    // Para editar producto
    const [editForm, setEditForm] = useState({
        nombre: '',
        descripcion: '',
        precio: '',
        stock: '',
    })
    
    // Actualizar editForm cuando cambia editProduct
    useEffect(() => {
        if (editProduct) {
            setEditForm({
                nombre: editProduct.nombre || editProduct.name || '',
                descripcion: editProduct.descripcion || editProduct.desciption || '',
                precio: editProduct.precio || editProduct.price || '',
                stock: editProduct.stock || ''
            })
        }
    }, [editProduct])

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
    const mapProductFields = (product) => {
        return {
            _id: product._id,
            id: product._id || product.id,
            nombre: product.nombre || product.name || '',
            descripcion: product.descripcion || product.desciption || '',
            precio: parseFloat(product.precio || product.price || 0),
            stock: parseInt(product.stock || 0)
        };
    }

    const filteredProducts = products
        .map(mapProductFields)
        .filter((p) =>
            `${p.nombre} ${p.precio} ${p.stock}`
                .toLowerCase()
                .includes(searchTerm.toLowerCase())
        )

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setForm((prev) => ({ ...prev, [name]: value }))
    }

    const handleEditInputChange = (e) => {
        const { name, value } = e.target
        setEditForm((prev) => ({ ...prev, [name]: value }))
    }

    const handleCreate = async () => {
        try {
            // Crear objeto con los campos que espera el backend
            const productData = {
                // Campos con nombres del backend
                name: form.nombre,
                desciption: form.descripcion,
                price: parseFloat(form.precio),
                stock: parseInt(form.stock),
                // También incluir campos con nombres del frontend para compatibilidad
                nombre: form.nombre,
                descripcion: form.descripcion,
                precio: parseFloat(form.precio)
            }
            
            await addProduct(productData)
            setModalOpen(false)
            setForm({ nombre: '', descripcion: '', precio: '', stock: '' })
        } catch (error) {
            console.error('Error al crear producto:', error)
        }
    }

    const handleUpdate = async () => {
        try {
            // Crear objeto con los campos que espera el backend
            const productData = {
                // Campos con nombres del backend
                name: editForm.nombre,
                desciption: editForm.descripcion,
                price: parseFloat(editForm.precio),
                stock: parseInt(editForm.stock),
                // También incluir campos con nombres del frontend para compatibilidad
                nombre: editForm.nombre,
                descripcion: editForm.descripcion,
                precio: parseFloat(editForm.precio)
            }
            
            await updateProduct(editProduct._id || editProduct.id, productData)
            setEditProduct(null)
        } catch (error) {
            console.error('Error al actualizar producto:', error)
        }
    }

    const handleDeleteConfirm = async () => {
        if (!deleteConfirmProduct) return
        try {
            await removeProduct(deleteConfirmProduct._id || deleteConfirmProduct.id)
            setDeleteConfirmProduct(null)
        } catch (error) {
            console.error('Error al eliminar producto:', error)
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
                <p>Error al cargar productos: {error}</p>
            </div>
        )
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4 relative">
            <div
                className={`w-full max-w-5xl bg-white p-6 rounded-lg shadow-md transition-all duration-300 ${
                    modalOpen || selectedProduct || editProduct || deleteConfirmProduct
                        ? 'blur-sm pointer-events-none select-none'
                        : ''
                }`}
            >
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold">Productos</h1>
                    <button
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-200"
                        onClick={() => setModalOpen(true)}
                    >
                        <Plus className="h-4 w-4 inline mr-2" />
                        Agregar Producto
                    </button>
                </div>

                <div className="flex relative mb-4">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Buscar productos por nombre o precio..."
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        disabled={modalOpen || selectedProduct || editProduct || deleteConfirmProduct}
                    />
                </div>
                <table className="min-w-full table-auto border border-gray-200">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-3 text-left">Productos</th>
                            <th className="p-3 text-left">Nombre</th>
                            <th className="p-3 text-left">Precio</th>
                            <th className="p-3 text-left">Stock</th>
                            <th className="p-3 text-left">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProducts.length > 0 ? (
                            filteredProducts.map((product) => (
                                <tr
                                    key={product.id}
                                    className="border-t border-gray-200 hover:bg-gray-50 cursor-pointer"
                                    onClick={() => setSelectedProduct(product)}
                                >
                                    <td className="p-3">
                                        <Archive className="h-5 w-5 text-gray-600" />
                                    </td>
                                    <td className="p-3">{product.nombre}</td>
                                    <td className="p-3">${product.precio.toFixed(2)}</td>
                                    <td className="p-3">{product.stock}</td>
                                    <td className="p-3 flex gap-2" onClick={(e) => e.stopPropagation()}>
                                        <button
                                            className="text-blue-500 hover:text-blue-700"
                                            onClick={() => setEditProduct(product)}
                                        >
                                            <Pencil className="h-5 w-5" />
                                        </button>
                                        <button
                                            className="text-red-500 hover:text-red-700"
                                            onClick={() => setDeleteConfirmProduct(product)}
                                        >
                                            <Trash className="h-5 w-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="text-center p-4 text-gray-500">
                                    {searchTerm ? 'No se encontraron productos con ese término de búsqueda.' : 'No hay productos registrados.'}
                                    {!searchTerm && (
                                        <div className="mt-4">
                                            <button 
                                                onClick={() => setModalOpen(true)}
                                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200"
                                            >
                                                <Plus className="h-4 w-4 mr-2" />
                                                Agregar Primer Producto
                                            </button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal Ver Detalle Producto */}
            {selectedProduct && (
                <div className="fixed z-50 inset-0 flex justify-center items-center p-4">
                    <div className="absolute inset-0 bg-black bg-opacity-30 backdrop-blur-sm"></div>
                    <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-lg z-10">
                        <h2 className="text-xl font-bold mb-4">Detalle del Producto</h2>
                        <p><strong>Nombre:</strong> {selectedProduct.nombre}</p>
                        <p><strong>Descripción:</strong> {selectedProduct.descripcion}</p>
                        <p><strong>Precio:</strong> ${selectedProduct.precio.toFixed(2)}</p>
                        <p><strong>Stock:</strong> {selectedProduct.stock}</p>
                        <div className="flex justify-end mt-6">
                            <button
                                className="px-4 py-2 rounded border hover:bg-gray-50"
                                onClick={() => setSelectedProduct(null)}
                            >
                                Regresar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Editar Producto */}
            {editProduct && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">Editar Producto</h2>
                        <form onSubmit={(e) => { e.preventDefault(); handleUpdate(); }}>
                            <div className="space-y-4 mb-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                                    <input
                                        type="text"
                                        name="nombre"
                                        value={editForm.nombre}
                                        onChange={handleEditInputChange}
                                        className="w-full p-2 border border-gray-300 rounded"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                                    <textarea
                                        name="descripcion"
                                        value={editForm.descripcion}
                                        onChange={handleEditInputChange}
                                        className="w-full p-2 border border-gray-300 rounded"
                                        required
                                        rows="3"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Precio</label>
                                    <input
                                        type="number"
                                        name="precio"
                                        value={editForm.precio}
                                        onChange={handleEditInputChange}
                                        className="w-full p-2 border border-gray-300 rounded"
                                        required
                                        step="0.01"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                                    <input
                                        type="number"
                                        name="stock"
                                        value={editForm.stock}
                                        onChange={handleEditInputChange}
                                        className="w-full p-2 border border-gray-300 rounded"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setEditProduct(null)}
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
            {deleteConfirmProduct && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">Confirmar Eliminación</h2>
                        <p className="mb-6">¿Está seguro que desea eliminar el producto <strong>"{deleteConfirmProduct.nombre}"</strong>?</p>
                        <div className="flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={() => setDeleteConfirmProduct(null)}
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

            {/* Modal Crear Producto */}
            {modalOpen && (
                <div className="fixed z-50 inset-0 flex justify-center items-center p-4">
                    <div className="absolute inset-0 bg-black bg-opacity-30 backdrop-blur-sm"></div>
                    <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-lg z-10">
                        <h2 className="text-xl font-bold mb-4">Agregar Producto</h2>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault()
                                handleCreate()
                            }}
                            className="space-y-4"
                        >
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                                <input
                                    type="text"
                                    name="nombre"
                                    placeholder="Nombre del producto"
                                    className="w-full border p-2 rounded"
                                    value={form.nombre}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                                <textarea
                                    name="descripcion"
                                    placeholder="Descripción del producto"
                                    className="w-full border p-2 rounded"
                                    value={form.descripcion}
                                    onChange={handleInputChange}
                                    required
                                    rows="3"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Precio</label>
                                <input
                                    type="number"
                                    name="precio"
                                    placeholder="Precio"
                                    className="w-full border p-2 rounded"
                                    value={form.precio}
                                    onChange={handleInputChange}
                                    required
                                    step="0.01"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                                <input
                                    type="number"
                                    name="stock"
                                    placeholder="Cantidad disponible"
                                    className="w-full border p-2 rounded"
                                    value={form.stock}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="flex justify-end gap-2 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setModalOpen(false)}
                                    className="px-4 py-2 rounded border text-gray-700 hover:bg-gray-50"
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
        </div>
    )
}
