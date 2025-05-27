import React, { useState } from 'react'
import { Archive, Pencil, Trash } from 'lucide-react'

const initialProducts = [
    {
        id: 1,
        nombre: 'Laptop HP',
        descripcion: 'Laptop HP 14 pulgadas',
        precio: 799.99,
        stock: 12,
    },
    {
        id: 2,
        nombre: 'Mouse Logitech',
        descripcion: 'Mouse inalámbrico Logitech M185',
        precio: 19.99,
        stock: 45,
    },
    {
        id: 3,
        nombre: 'Teclado mecánico',
        descripcion: 'Teclado retroiluminado con switches azules',
        precio: 49.5,
        stock: 30,
    },
]

export default function ProductTable() {
    const [products, setProducts] = useState(initialProducts)
    const [searchTerm, setSearchTerm] = useState('')
    const [modalOpen, setModalOpen] = useState(false)
    const [selectedProduct, setSelectedProduct] = useState(null)
    const [editProduct, setEditProduct] = useState(null)
    const [deleteProduct, setDeleteProduct] = useState(null)

    const [form, setForm] = useState({
        nombre: '',
        descripcion: '',
        precio: '',
        stock: '',
    })

    const filteredProducts = products.filter((p) =>
        `${p.nombre} ${p.precio} ${p.stock}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
    )

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setForm((prev) => ({ ...prev, [name]: value }))
    }

    const handleCreate = () => {
        const newProduct = {
            ...form,
            id: Date.now(),
            precio: parseFloat(form.precio),
            stock: parseInt(form.stock),
        }
        setProducts([...products, newProduct])
        setModalOpen(false)
        setForm({ nombre: '', descripcion: '', precio: '', stock: '' })
    }

    const handleUpdate = () => {
        setProducts((prev) =>
            prev.map((p) => (p.id === editProduct.id ? { ...editProduct, ...form } : p))
        )
        setEditProduct(null)
        setForm({ nombre: '', descripcion: '', precio: '', stock: '' })
    }

    const handleDelete = () => {
        setProducts((prev) => prev.filter((p) => p.id !== deleteProduct.id))
        setDeleteProduct(null)
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4 relative">
            <div
                className={`w-full max-w-5xl bg-white p-6 rounded-lg shadow-md transition-all duration-300 ${modalOpen || selectedProduct || editProduct || deleteProduct
                        ? 'blur-sm pointer-events-none select-none'
                        : ''
                    }`}
            >
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold">Productos</h1>
                    <button
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        onClick={() => setModalOpen(true)}
                    >
                        Crear
                    </button>
                </div>

                <input
                    type="text"
                    placeholder="Buscar producto..."
                    className="mb-4 w-full p-2 border border-gray-300 rounded"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />

                <table className="min-w-full table-auto border border-gray-200">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-3 text-left">Productos</th>
                            <th className="p-3 text-left">Nombre</th>
                            <th className="p-3 text-left">Precio</th>
                            <th className="p-3 text-left">Stock</th>
                            <th className="p-3 text-left"></th>
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
                                            onClick={() => {
                                                setEditProduct(product)
                                                setForm(product)
                                            }}
                                        >
                                            <Pencil className="h-5 w-5" />
                                        </button>
                                        <button
                                            className="text-red-500 hover:text-red-700"
                                            onClick={() => setDeleteProduct(product)}
                                        >
                                            <Trash className="h-5 w-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="text-center p-4 text-gray-500">
                                    No se encontraron productos.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {selectedProduct && (
                <div className="fixed z-50 inset-0 flex justify-center items-center p-4">
                    <div className="absolute inset-0 bg-black bg-opacity-30 backdrop-blur-sm"></div>
                    <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-lg z-10">
                        <h2 className="text-xl font-bold mb-4">Detalle del producto</h2>
                        <p><strong>Nombre:</strong> {selectedProduct.nombre}</p>
                        <p><strong>Descripción:</strong> {selectedProduct.descripcion}</p>
                        <p><strong>Precio:</strong> ${selectedProduct.precio.toFixed(2)}</p>
                        <p><strong>Stock:</strong> {selectedProduct.stock}</p>
                        <div className="flex justify-end mt-6">
                            <button
                                className="px-4 py-2 rounded border"
                                onClick={() => setSelectedProduct(null)}
                            >
                                Regresar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {editProduct && (
                <div className="fixed z-50 inset-0 flex justify-center items-center p-4">
                    <div className="absolute inset-0 bg-black bg-opacity-30 backdrop-blur-sm"></div>
                    <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-lg z-10">
                        <h2 className="text-xl font-bold mb-4">Editar producto</h2>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault()
                                handleUpdate()
                            }}
                            className="space-y-4"
                        >
                            <input
                                type="text"
                                name="nombre"
                                placeholder="Nombre"
                                className="w-full border p-2 rounded"
                                value={form.nombre}
                                onChange={handleInputChange}
                                required
                            />
                            <input
                                type="text"
                                name="descripcion"
                                placeholder="Descripción"
                                className="w-full border p-2 rounded"
                                value={form.descripcion}
                                onChange={handleInputChange}
                                required
                            />
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
                            <input
                                type="number"
                                name="stock"
                                placeholder="Stock"
                                className="w-full border p-2 rounded"
                                value={form.stock}
                                onChange={handleInputChange}
                                required
                            />
                            <div className="flex justify-end gap-4 mt-4">
                                <button
                                    type="button"
                                    onClick={() => setEditProduct(null)}
                                    className="px-4 py-2 rounded border"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 rounded bg-blue-600 text-white"
                                >
                                    Actualizar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {deleteProduct && (
                <div className="fixed z-50 inset-0 flex justify-center items-center p-4">
                    <div className="absolute inset-0 bg-black bg-opacity-30 backdrop-blur-sm"></div>
                    <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-lg z-10">
                        <h2 className="text-xl font-bold mb-4">Confirmar eliminación</h2>
                        <p className="mb-6">
                            ¿Realmente quieres eliminar el producto: <strong>{deleteProduct.nombre}</strong>?
                        </p>
                        <div className="flex justify-end gap-4">
                            <button
                                type="button"
                                onClick={() => setDeleteProduct(null)}
                                className="px-4 py-2 rounded border"
                            >
                                Cancelar
                            </button>
                            <button
                                type="button"
                                onClick={handleDelete}
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
                    <div className="bg-white rounded-lg max-w-lg w-full p-6 shadow-lg z-10">
                        <h2 className="text-xl font-bold mb-4">Crear producto</h2>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault()
                                handleCreate()
                            }}
                            className="space-y-4"
                        >
                            <input
                                type="text"
                                name="nombre"
                                placeholder="Nombre"
                                className="w-full border p-2 rounded"
                                value={form.nombre}
                                onChange={handleInputChange}
                                required
                            />
                            <input
                                type="text"
                                name="descripcion"
                                placeholder="Descripción"
                                className="w-full border p-2 rounded"
                                value={form.descripcion}
                                onChange={handleInputChange}
                                required
                            />
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
                            <input
                                type="number"
                                name="stock"
                                placeholder="Stock"
                                className="w-full border p-2 rounded"
                                value={form.stock}
                                onChange={handleInputChange}
                                required
                            />
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



        </div>
    )
}