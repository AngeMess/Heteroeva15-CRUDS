import React, { useState, useEffect } from 'react'
import { User, Pencil, Trash } from 'lucide-react'
import DatePicker from 'react-datepicker'
import axios from 'axios';
import 'react-datepicker/dist/react-datepicker.css'

const initialEmployeesData = [
    {
        id: 1,
        nombre: 'Juan',
        apellido: 'Pérez',
        fechaNacimiento: new Date(1990, 5, 15),
        email: 'juan@example.com',
        direccion: 'Calle Falsa 123',
        password: 'secret123',
        telefono: '555-1234',
        dui: '12345678-9',
        fechaContratacion: new Date(2020, 0, 1),
    },
    {
        id: 2,
        nombre: 'María',
        apellido: 'González',
        fechaNacimiento: new Date(1985, 10, 20),
        email: 'maria@example.com',
        direccion: 'Avenida Siempre Viva 742',
        password: 'password456',
        telefono: '555-5678',
        dui: '98765432-1',
        fechaContratacion: new Date(2019, 3, 15),
    },
    {
        id: 3,
        nombre: 'Carlos',
        apellido: 'Ramírez',
        fechaNacimiento: new Date(1992, 7, 7),
        email: 'carlos@example.com',
        direccion: 'Boulevard Central 45',
        password: 'mypassword789',
        telefono: '555-9012',
        dui: '45612378-0',
        fechaContratacion: new Date(2021, 6, 10),
    },
]

export default function EmployeeTable() {
    const [employees, setEmployees] = useState(initialEmployeesData)

    const [searchTerm, setSearchTerm] = useState('')
    const [modalOpen, setModalOpen] = useState(false) // Crear modal
    const [selectedEmployee, setSelectedEmployee] = useState(null) // Modal detalle
    const [editEmployee, setEditEmployee] = useState(null) // Modal editar
    const [deleteEmployee, setDeleteEmployee] = useState(null)

    // Form creación
    const [form, setForm] = useState({
        nombre: '',
        apellido: '',
        fechaNacimiento: null,
        email: '',
        direccion: '',
        password: '',
        telefono: '',
        dui: '',
        fechaContratacion: null,
    })

    // Form editar (inicializado cuando editEmployee cambia)
    const [editForm, setEditForm] = useState({
        nombre: '',
        apellido: '',
        fechaNacimiento: null,
        email: '',
        direccion: '',
        password: '',
        telefono: '',
        dui: '',
        fechaContratacion: null,
    })

    // Actualizar editForm cuando cambia editEmployee
    // (Ejecuta efecto cuando editEmployee cambia)
    React.useEffect(() => {
        if (editEmployee) {
            setEditForm({
                nombre: editEmployee.nombre,
                apellido: editEmployee.apellido,
                fechaNacimiento: editEmployee.fechaNacimiento,
                email: editEmployee.email,
                direccion: editEmployee.direccion,
                password: editEmployee.password,
                telefono: editEmployee.telefono,
                dui: editEmployee.dui,
                fechaContratacion: editEmployee.fechaContratacion,
            })
        }
    }, [editEmployee])

    const filteredEmployees = employees.filter((emp) =>
        `${emp.nombre} ${emp.apellido} ${emp.dui} ${emp.email}`
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

    const handleCreate = () => {
        // En este ejemplo simple solo agrego el empleado a la lista con id nuevo
        const newId = employees.length ? Math.max(...employees.map((e) => e.id)) + 1 : 1
        const newEmployee = {
            id: newId,
            ...form,
        }
        setEmployees((prev) => [...prev, newEmployee])
        setModalOpen(false)
        setForm({
            nombre: '',
            apellido: '',
            fechaNacimiento: null,
            email: '',
            direccion: '',
            password: '',
            telefono: '',
            dui: '',
            fechaContratacion: null,
        })
    }

    const openDetailModal = (emp) => {
        setSelectedEmployee(emp)
    }

    // Formatear fecha dd/mm/yyyy
    const formatDate = (date) => {
        if (!date) return ''
        const d = new Date(date)
        const day = d.getDate().toString().padStart(2, '0')
        const month = (d.getMonth() + 1).toString().padStart(2, '0')
        const year = d.getFullYear()
        return `${day}/${month}/${year}`
    }

    // Abrir modal editar
    const openEditModal = (emp) => {
        setEditEmployee(emp)
    }

    // Actualizar empleado
    const handleUpdate = () => {
        setEmployees((prev) =>
            prev.map((emp) => (emp.id === editEmployee.id ? { ...emp, ...editForm } : emp))
        )
        setEditEmployee(null)
    }

    const handleDeleteConfirm = () => {
        if (!deleteEmployee) return
        setEmployees((emps) => emps.filter((emp) => emp.id !== deleteEmployee.id))
        setDeleteEmployee(null) // Cierra modal después de eliminar
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4 relative">
            <div
                className={`w-full max-w-5xl bg-white p-6 rounded-lg shadow-md transition-all duration-300 ${modalOpen || selectedEmployee || editEmployee || deleteEmployee
                        ? 'blur-sm pointer-events-none select-none'
                        : ''
                    }`}
            >
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold">Empleados</h1>
                    <button
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        onClick={() => setModalOpen(true)}
                    >
                        Crear
                    </button>
                </div>

                <input
                    type="text"
                    placeholder="Buscar empleado..."
                    className="mb-4 w-full p-2 border border-gray-300 rounded"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    disabled={modalOpen || selectedEmployee || editEmployee}
                />

                <table className="min-w-full table-auto border border-gray-200">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-3 text-left">Usuario</th>
                            <th className="p-3 text-left">Nombre</th>
                            <th className="p-3 text-left">Apellido</th>
                            <th className="p-3 text-left">DUI</th>
                            <th className="p-3 text-left">Email</th>
                            <th className="p-3 text-left"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredEmployees.length > 0 ? (
                            filteredEmployees.map((emp) => (
                                <tr
                                    key={emp.id}
                                    className="border-t border-gray-200 hover:bg-gray-50 cursor-pointer"
                                    onClick={() => openDetailModal(emp)}
                                >
                                    <td className="p-3">
                                        <User className="h-5 w-5 text-gray-600" />
                                    </td>
                                    <td className="p-3">{emp.nombre}</td>
                                    <td className="p-3">{emp.apellido}</td>
                                    <td className="p-3">{emp.dui}</td>
                                    <td className="p-3">{emp.email}</td>
                                    <td className="p-3 flex gap-2" onClick={(e) => e.stopPropagation()}>
                                        <button
                                            className="text-blue-500 hover:text-blue-700"
                                            onClick={() => setEditEmployee(emp)}
                                        >
                                            <Pencil className="h-5 w-5" />
                                        </button>
                                        <button
                                            className="text-red-500 hover:text-red-700"
                                            onClick={() => setDeleteEmployee(emp)} // Abre modal eliminar
                                        >
                                            <Trash className="h-5 w-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="text-center p-4 text-gray-500">
                                    No se encontraron empleados.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal Crear Empleado */}
            {modalOpen && (
                <>
                    <div className="fixed inset-0 z-40">
                        <div className="absolute inset-0 bg-black bg-opacity-30 backdrop-blur-sm"></div>
                    </div>
                    <div className="fixed z-50 inset-0 flex justify-center items-center p-4">
                        <div className="bg-white rounded-lg max-w-2xl w-full p-6 shadow-lg overflow-auto max-h-[90vh]">
                            <h2 className="text-xl font-bold mb-4">Crear empleado</h2>
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault()
                                    handleCreate()
                                }}
                                className="space-y-4"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="nombre" className="block mb-1 font-semibold">
                                            Nombre
                                        </label>
                                        <input
                                            id="nombre"
                                            name="nombre"
                                            type="text"
                                            value={form.nombre}
                                            onChange={handleInputChange}
                                            className="w-full border border-gray-300 rounded p-2"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="apellido" className="block mb-1 font-semibold">
                                            Apellido
                                        </label>
                                        <input
                                            id="apellido"
                                            name="apellido"
                                            type="text"
                                            value={form.apellido}
                                            onChange={handleInputChange}
                                            className="w-full border border-gray-300 rounded p-2"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="fechaNacimiento" className="block mb-1 font-semibold">
                                            Fecha de cumpleaños
                                        </label>
                                        <DatePicker
                                            id="fechaNacimiento"
                                            selected={form.fechaNacimiento}
                                            onChange={(date) => setForm((f) => ({ ...f, fechaNacimiento: date }))}
                                            className="w-full border border-gray-300 rounded p-2"
                                            dateFormat="dd/MM/yyyy"
                                            placeholderText="Selecciona fecha"
                                            maxDate={new Date()}
                                            isClearable
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="email" className="block mb-1 font-semibold">
                                            Correo
                                        </label>
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            value={form.email}
                                            onChange={handleInputChange}
                                            className="w-full border border-gray-300 rounded p-2"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="direccion" className="block mb-1 font-semibold">
                                            Dirección
                                        </label>
                                        <input
                                            id="direccion"
                                            name="direccion"
                                            type="text"
                                            value={form.direccion}
                                            onChange={handleInputChange}
                                            className="w-full border border-gray-300 rounded p-2"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="password" className="block mb-1 font-semibold">
                                            Contraseña
                                        </label>
                                        <input
                                            id="password"
                                            name="password"
                                            type="password"
                                            value={form.password}
                                            onChange={handleInputChange}
                                            className="w-full border border-gray-300 rounded p-2"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="telefono" className="block mb-1 font-semibold">
                                            Teléfono
                                        </label>
                                        <input
                                            id="telefono"
                                            name="telefono"
                                            type="tel"
                                            value={form.telefono}
                                            onChange={handleInputChange}
                                            className="w-full border border-gray-300 rounded p-2"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="dui" className="block mb-1 font-semibold">
                                            DUI
                                        </label>
                                        <input
                                            id="dui"
                                            name="dui"
                                            type="text"
                                            value={form.dui}
                                            onChange={handleInputChange}
                                            className="w-full border border-gray-300 rounded p-2"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="fechaContratacion" className="block mb-1 font-semibold">
                                            Fecha de contratación
                                        </label>
                                        <DatePicker
                                            id="fechaContratacion"
                                            selected={form.fechaContratacion}
                                            onChange={(date) => setForm((f) => ({ ...f, fechaContratacion: date }))}
                                            className="w-full border border-gray-300 rounded p-2"
                                            dateFormat="dd/MM/yyyy"
                                            placeholderText="Selecciona fecha"
                                            isClearable
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end gap-4 mt-6">
                                    <button
                                        type="button"
                                        className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100"
                                        onClick={() => setModalOpen(false)}
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                                    >
                                        Crear
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </>
            )}

            {/* Modal Detalle Empleado */}
            {selectedEmployee && (
                <>
                    <div className="fixed inset-0 z-40">
                        <div className="absolute inset-0 bg-black bg-opacity-30 backdrop-blur-sm"></div>
                    </div>
                    <div className="fixed z-50 inset-0 flex justify-center items-center p-4">
                        <div className="bg-white rounded-lg max-w-2xl w-full p-6 shadow-lg overflow-auto max-h-[90vh]">
                            <h2 className="text-xl font-bold mb-4">Detalle del empleado</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <span className="block font-semibold">Nombre:</span>
                                    <p>{selectedEmployee.nombre}</p>
                                </div>
                                <div>
                                    <span className="block font-semibold">Apellido:</span>
                                    <p>{selectedEmployee.apellido}</p>
                                </div>
                                <div>
                                    <span className="block font-semibold">Fecha de cumpleaños:</span>
                                    <p>{formatDate(selectedEmployee.fechaNacimiento)}</p>
                                </div>
                                <div>
                                    <span className="block font-semibold">Correo:</span>
                                    <p>{selectedEmployee.email}</p>
                                </div>
                                <div>
                                    <span className="block font-semibold">Dirección:</span>
                                    <p>{selectedEmployee.direccion}</p>
                                </div>
                                <div>
                                    <span className="block font-semibold">Contraseña:</span>
                                    <p>{selectedEmployee.password}</p>
                                </div>
                                <div>
                                    <span className="block font-semibold">Teléfono:</span>
                                    <p>{selectedEmployee.telefono}</p>
                                </div>
                                <div>
                                    <span className="block font-semibold">DUI:</span>
                                    <p>{selectedEmployee.dui}</p>
                                </div>
                                <div>
                                    <span className="block font-semibold">Fecha de contratación:</span>
                                    <p>{formatDate(selectedEmployee.fechaContratacion)}</p>
                                </div>
                            </div>
                            <div className="flex justify-end mt-6">
                                <button
                                    onClick={() => setSelectedEmployee(null)}
                                    className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
                                >
                                    Regresar
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* Modal Editar Empleado */}
            {editEmployee && (
                <>
                    <div className="fixed inset-0 z-40">
                        <div className="absolute inset-0 bg-black bg-opacity-30 backdrop-blur-sm"></div>
                    </div>
                    <div className="fixed z-50 inset-0 flex justify-center items-center p-4">
                        <div className="bg-white rounded-lg max-w-2xl w-full p-6 shadow-lg overflow-auto max-h-[90vh]">
                            <h2 className="text-xl font-bold mb-4">Editar empleado</h2>
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault()
                                    handleUpdate()
                                }}
                                className="space-y-4"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="editNombre" className="block mb-1 font-semibold">
                                            Nombre
                                        </label>
                                        <input
                                            id="editNombre"
                                            name="nombre"
                                            type="text"
                                            value={editForm.nombre}
                                            onChange={handleEditInputChange}
                                            className="w-full border border-gray-300 rounded p-2"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="editApellido" className="block mb-1 font-semibold">
                                            Apellido
                                        </label>
                                        <input
                                            id="editApellido"
                                            name="apellido"
                                            type="text"
                                            value={editForm.apellido}
                                            onChange={handleEditInputChange}
                                            className="w-full border border-gray-300 rounded p-2"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="editFechaNacimiento" className="block mb-1 font-semibold">
                                            Fecha de cumpleaños
                                        </label>
                                        <DatePicker
                                            id="editFechaNacimiento"
                                            selected={editForm.fechaNacimiento}
                                            onChange={(date) =>
                                                setEditForm((f) => ({ ...f, fechaNacimiento: date }))
                                            }
                                            className="w-full border border-gray-300 rounded p-2"
                                            dateFormat="dd/MM/yyyy"
                                            placeholderText="Selecciona fecha"
                                            maxDate={new Date()}
                                            isClearable
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="editEmail" className="block mb-1 font-semibold">
                                            Correo
                                        </label>
                                        <input
                                            id="editEmail"
                                            name="email"
                                            type="email"
                                            value={editForm.email}
                                            onChange={handleEditInputChange}
                                            className="w-full border border-gray-300 rounded p-2"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="editDireccion" className="block mb-1 font-semibold">
                                            Dirección
                                        </label>
                                        <input
                                            id="editDireccion"
                                            name="direccion"
                                            type="text"
                                            value={editForm.direccion}
                                            onChange={handleEditInputChange}
                                            className="w-full border border-gray-300 rounded p-2"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="editPassword" className="block mb-1 font-semibold">
                                            Contraseña
                                        </label>
                                        <input
                                            id="editPassword"
                                            name="password"
                                            type="password"
                                            value={editForm.password}
                                            onChange={handleEditInputChange}
                                            className="w-full border border-gray-300 rounded p-2"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="editTelefono" className="block mb-1 font-semibold">
                                            Teléfono
                                        </label>
                                        <input
                                            id="editTelefono"
                                            name="telefono"
                                            type="tel"
                                            value={editForm.telefono}
                                            onChange={handleEditInputChange}
                                            className="w-full border border-gray-300 rounded p-2"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="editDui" className="block mb-1 font-semibold">
                                            DUI
                                        </label>
                                        <input
                                            id="editDui"
                                            name="dui"
                                            type="text"
                                            value={editForm.dui}
                                            onChange={handleEditInputChange}
                                            className="w-full border border-gray-300 rounded p-2"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="editFechaContratacion"
                                            className="block mb-1 font-semibold"
                                        >
                                            Fecha de contratación
                                        </label>
                                        <DatePicker
                                            id="editFechaContratacion"
                                            selected={editForm.fechaContratacion}
                                            onChange={(date) =>
                                                setEditForm((f) => ({ ...f, fechaContratacion: date }))
                                            }
                                            className="w-full border border-gray-300 rounded p-2"
                                            dateFormat="dd/MM/yyyy"
                                            placeholderText="Selecciona fecha"
                                            isClearable
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end gap-4 mt-6">
                                    <button
                                        type="button"
                                        className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100"
                                        onClick={() => setEditEmployee(null)}
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
                                    >
                                        Actualizar
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </>
            )}

            {deleteEmployee && (
                <>
                    <div className="fixed inset-0 z-40">
                        <div className="absolute inset-0 bg-black bg-opacity-30 backdrop-blur-sm"></div>
                    </div>
                    <div className="fixed z-50 inset-0 flex justify-center items-center p-4">
                        <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-lg">
                            <h2 className="text-xl font-bold mb-4">Confirmar eliminación</h2>
                            <p className="mb-6">
                                ¿Realmente quieres eliminar a: <strong>{deleteEmployee.nombre} {deleteEmployee.apellido}</strong>?
                            </p>
                            <div className="flex justify-end gap-4">
                                <button
                                    className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100"
                                    onClick={() => setDeleteEmployee(null)} // Cancelar cierra modal
                                >
                                    Cancelar
                                </button>
                                <button
                                    className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
                                    onClick={handleDeleteConfirm} // Confirmar elimina
                                >
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}
