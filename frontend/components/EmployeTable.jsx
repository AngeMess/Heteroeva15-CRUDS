import React, { useState } from 'react'
import { User, Pencil, Trash, Search, Plus, Mail, Phone, Calendar } from 'lucide-react'
import DatePicker from 'react-datepicker'
import useDataEmployee from './UseDataEmployees'
import 'react-datepicker/dist/react-datepicker.css'

// Función para formatear fechas de manera consistente
const formatDate = (dateString) => {
    if (!dateString) return ''
    
    try {
        const date = new Date(dateString)
        if (isNaN(date.getTime())) return ''
        
        return date.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        })
    } catch (error) {
        console.error('Error formatting date:', error)
        return ''
    }
}

export default function EmployeeTable() {
    const { employees, loading, error, deleteEmployee, refreshEmployees, addEmployee, updateEmployee } = useDataEmployee()
    const [searchTerm, setSearchTerm] = useState('')
    const [modalOpen, setModalOpen] = useState(false) // Crear modal
    const [selectedEmployee, setSelectedEmployee] = useState(null) // Modal detalle
    const [editEmployee, setEditEmployee] = useState(null) // Modal editar
    const [deleteConfirmEmployee, setDeleteConfirmEmployee] = useState(null) // Modal confirmar eliminación

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
                nombre: editEmployee.nombre || editEmployee.name || '',
                apellido: editEmployee.apellido || editEmployee.lastName || '',
                fechaNacimiento: editEmployee.fechaNacimiento || editEmployee.birthday || null,
                email: editEmployee.email || '',
                direccion: editEmployee.direccion || editEmployee.address || '',
                password: editEmployee.password || '',
                telefono: editEmployee.telefono || editEmployee.telephone || '',
                dui: editEmployee.dui || '',
                fechaContratacion: editEmployee.fechaContratacion || editEmployee.hireDate || null,
                issnumber: editEmployee.issnumber || '',
                isVerified: editEmployee.isVerified || false
            })
        }
    }, [editEmployee])

    // Filtrar empleados basado en el término de búsqueda
    const filteredEmployees = employees.filter(employee =>
        employee.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.apellido?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.dui?.includes(searchTerm)
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
            const employeeData = {
                // Campos con nombres que espera el backend
                name: form.nombre,
                lastName: form.apellido,
                birthday: form.fechaNacimiento,
                email: form.email,
                address: form.direccion,
                password: form.password,
                telephone: form.telefono,
                dui: form.dui,
                hireDate: form.fechaContratacion,
                issnumber: form.issnumber || '',
                isVerified: form.isVerified || false,
                // También incluir campos con nombres del frontend para compatibilidad
                nombre: form.nombre,
                apellido: form.apellido,
                fechaNacimiento: form.fechaNacimiento,
                direccion: form.direccion,
                telefono: form.telefono,
                fechaContratacion: form.fechaContratacion
            }
            
            await addEmployee(employeeData)
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
                issnumber: '',
                isVerified: false
            })
        } catch (error) {
            console.error('Error al crear empleado:', error)
        }
    }

    const openDetailModal = (emp) => {
        // Verificar los datos recibidos para depuración
        console.log('Datos del empleado recibidos:', emp);
        
        // Mapear los campos del backend a los del frontend si es necesario
        const mappedEmployee = {
            ...emp,
            // Mapear campos del backend al frontend si tienen nombres diferentes
            nombre: emp.nombre || emp.name || '',
            apellido: emp.apellido || emp.lastName || '',
            fechaNacimiento: emp.fechaNacimiento || emp.birthday || null,
            direccion: emp.direccion || emp.address || '',
            telefono: emp.telefono || emp.telephone || '',
            fechaContratacion: emp.fechaContratacion || emp.hireDate || null,
            issnumber: emp.issnumber || '',
            isVerified: emp.isVerified !== undefined ? emp.isVerified : false
        }
        
        // Verificar el objeto mapeado para depuración
        console.log('Empleado mapeado para mostrar:', mappedEmployee);
        
        setSelectedEmployee(mappedEmployee)
    }

    // Formatear fecha en formato localizado
    const formatDate = (dateString) => {
        if (!dateString) return 'No especificado'
        try {
            const date = new Date(dateString)
            if (isNaN(date.getTime())) return 'Fecha inválida'
            
            return date.toLocaleDateString('es-SV', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            })
        } catch (error) {
            console.error('Error al formatear fecha:', error)
            return 'Error en formato de fecha'
        }
    }
    
    // Calcular edad a partir de la fecha de nacimiento
    const calculateAge = (birthday) => {
        if (!birthday) return 'N/A'
        const today = new Date()
        const birthDate = new Date(birthday)
        let age = today.getFullYear() - birthDate.getFullYear()
        const monthDiff = today.getMonth() - birthDate.getMonth()
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--
        }
        
        return age
    }

    // Abrir modal editar
    const openEditModal = (emp) => {
        setEditEmployee(emp)
    }

    // Actualizar empleado
    const handleUpdate = async () => {
        try {
            // Crear un objeto con los nombres de campos que espera el backend
            const employeeData = {
                // Usar los campos del frontend pero mapearlos a los nombres que espera el backend
                name: editForm.nombre,
                lastName: editForm.apellido,
                birthday: editForm.fechaNacimiento,
                email: editForm.email,
                address: editForm.direccion,
                password: editForm.password,
                telephone: editForm.telefono,
                dui: editForm.dui,
                hireDate: editForm.fechaContratacion,
                issnumber: editForm.issnumber,
                isVerified: editForm.isVerified,
                // También incluir los campos con nombres del frontend para compatibilidad
                nombre: editForm.nombre,
                apellido: editForm.apellido,
                fechaNacimiento: editForm.fechaNacimiento,
                direccion: editForm.direccion,
                telefono: editForm.telefono,
                fechaContratacion: editForm.fechaContratacion
            }
            
            await updateEmployee(editEmployee._id, employeeData)
            setEditEmployee(null)
        } catch (error) {
            console.error('Error al actualizar empleado:', error)
        }
    }

    const handleDeleteConfirm = async () => {
        if (!deleteConfirmEmployee) return
        try {
            await deleteEmployee(deleteConfirmEmployee._id)
            setDeleteConfirmEmployee(null) // Cierra modal después de eliminar
        } catch (error) {
            console.error('Error al eliminar empleado:', error)
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
                <p>Error al cargar empleados: {error}</p>
            </div>
        )
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4 relative">
            <div
                className={`w-full max-w-5xl bg-white p-6 rounded-lg shadow-md transition-all duration-300 ${modalOpen || selectedEmployee || editEmployee || deleteConfirmEmployee
                        ? 'blur-sm pointer-events-none select-none'
                        : ''
                    }`}
            >
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold">Empleados</h1>
                    <button
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-200"
                        onClick={() => setModalOpen(true)}
                    >
                        <Plus className="h-4 w-4 inline mr-2" />
                        Agregar Empleado
                    </button>
                </div>

                <div className="flex relative mb-4">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Buscar empleados por nombre, apellido, email o DUI..."
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        disabled={modalOpen || selectedEmployee || editEmployee || deleteConfirmEmployee}
                    />
                </div>
                
                <table className="min-w-full table-auto border border-gray-200">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-3 text-left">Empleado</th>
                            <th className="p-3 text-left">Nombre</th>
                            <th className="p-3 text-left">Email</th>
                            <th className="p-3 text-left">Teléfono</th>
                            <th className="p-3 text-left">DUI</th>
                            <th className="p-3 text-left">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredEmployees.length > 0 ? (
                            filteredEmployees.map((emp) => (
                                <tr
                                    key={emp._id}
                                    className="border-t border-gray-200 hover:bg-gray-50 cursor-pointer"
                                    onClick={() => openDetailModal(emp)}
                                >
                                    <td className="p-3">
                                        <User className="h-5 w-5 text-gray-600" />
                                    </td>
                                    <td className="p-3">{emp.nombre || emp.name} {emp.apellido || emp.lastName}</td>
                                    <td className="p-3">{emp.email}</td>
                                    <td className="p-3">{emp.telefono || emp.telephone || '-'}</td>
                                    <td className="p-3">{emp.dui}</td>
                                    <td className="p-3 flex gap-2" onClick={(e) => e.stopPropagation()}>
                                        <button
                                            className="text-blue-500 hover:text-blue-700"
                                            onClick={() => setEditEmployee(emp)}
                                        >
                                            <Pencil className="h-5 w-5" />
                                        </button>
                                        <button
                                            className="text-red-500 hover:text-red-700"
                                            onClick={() => {
                                                // Asegurar que se manejan correctamente los campos del backend
                                                const mappedEmployee = {
                                                    ...emp,
                                                    nombre: emp.nombre || emp.name || '',
                                                    apellido: emp.apellido || emp.lastName || ''
                                                };
                                                setDeleteConfirmEmployee(mappedEmployee);
                                            }}
                                        >
                                            <Trash className="h-5 w-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="text-center p-4 text-gray-500">
                                    {searchTerm ? 'No se encontraron empleados con ese término de búsqueda.' : 'No hay empleados registrados.'}
                                    {!searchTerm && (
                                        <div className="mt-4">
                                            <button 
                                                onClick={() => setModalOpen(true)}
                                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200"
                                            >
                                                <Plus className="h-4 w-4 mr-2" />
                                                Agregar Primer Empleado
                                            </button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal Crear */}
            {modalOpen && (
                <div className="fixed z-50 inset-0 flex justify-center items-center p-4">
                    <div className="absolute inset-0 bg-black bg-opacity-30 backdrop-blur-sm"></div>
                    <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-lg z-10">
                        <h2 className="text-xl font-bold mb-4">Agregar Empleado</h2>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault()
                                handleCreate()
                            }}
                            className="space-y-4"
                        >
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                                    <input
                                        type="text"
                                        name="nombre"
                                        placeholder="Nombre"
                                        className="w-full border p-2 rounded"
                                        value={form.nombre}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Apellido</label>
                                    <input
                                        type="text"
                                        name="apellido"
                                        placeholder="Apellido"
                                        className="w-full border p-2 rounded"
                                        value={form.apellido}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email"
                                    className="w-full border p-2 rounded"
                                    value={form.email}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">DUI</label>
                                    <input
                                        type="text"
                                        name="dui"
                                        placeholder="00000000-0"
                                        className="w-full border p-2 rounded"
                                        value={form.dui}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                                    <input
                                        type="text"
                                        name="telefono"
                                        placeholder="Teléfono"
                                        className="w-full border p-2 rounded"
                                        value={form.telefono}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Nacimiento</label>
                                    <DatePicker
                                        selected={form.fechaNacimiento ? new Date(form.fechaNacimiento) : null}
                                        onChange={(date) => setForm({ ...form, fechaNacimiento: date })}
                                        dateFormat="dd/MM/yyyy"
                                        className="w-full border p-2 rounded"
                                        placeholderText="DD/MM/AAAA"
                                        showYearDropdown
                                        dropdownMode="select"
                                        maxDate={new Date()}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Contratación</label>
                                    <DatePicker
                                        selected={form.fechaContratacion ? new Date(form.fechaContratacion) : null}
                                        onChange={(date) => setForm({ ...form, fechaContratacion: date })}
                                        dateFormat="dd/MM/yyyy"
                                        className="w-full border p-2 rounded"
                                        placeholderText="DD/MM/AAAA"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
                                <input
                                    type="text"
                                    name="direccion"
                                    placeholder="Dirección"
                                    className="w-full border p-2 rounded"
                                    value={form.direccion}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Número ISSS</label>
                                    <input
                                        type="text"
                                        name="issnumber"
                                        placeholder="Número ISSS"
                                        className="w-full border p-2 rounded"
                                        value={form.issnumber}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Verificado</label>
                                    <select
                                        name="isVerified"
                                        className="w-full border p-2 rounded"
                                        value={form.isVerified}
                                        onChange={(e) => setForm({ ...form, isVerified: e.target.value === 'true' })}
                                    >
                                        <option value="false">No</option>
                                        <option value="true">Sí</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex justify-end gap-2 mt-6">
                                <button
                                    type="button"
                                    className="px-4 py-2 rounded border text-gray-700 hover:bg-gray-50"
                                    onClick={() => {
                                        setModalOpen(false)
                                        resetForm()
                                    }}
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

            {/* Modal Editar */}
            {editEmployee && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">Editar Empleado</h2>
                        <form onSubmit={(e) => { e.preventDefault(); handleUpdate(); }}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Apellido</label>
                                    <input
                                        type="text"
                                        name="apellido"
                                        value={editForm.apellido}
                                        onChange={handleEditInputChange}
                                        className="w-full p-2 border border-gray-300 rounded"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={editForm.email}
                                        onChange={handleEditInputChange}
                                        className="w-full p-2 border border-gray-300 rounded"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">DUI</label>
                                    <input
                                        type="text"
                                        name="dui"
                                        value={editForm.dui}
                                        onChange={handleEditInputChange}
                                        className="w-full p-2 border border-gray-300 rounded"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                                    <input
                                        type="tel"
                                        name="telefono"
                                        value={editForm.telefono}
                                        onChange={handleEditInputChange}
                                        className="w-full p-2 border border-gray-300 rounded"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Nacimiento</label>
                                    <DatePicker
                                        selected={editForm.fechaNacimiento}
                                        onChange={(date) => setEditForm({ ...editForm, fechaNacimiento: date })}
                                        className="w-full p-2 border border-gray-300 rounded"
                                        dateFormat="dd/MM/yyyy"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Contratación</label>
                                    <DatePicker
                                        selected={editForm.fechaContratacion}
                                        onChange={(date) => setEditForm({ ...editForm, fechaContratacion: date })}
                                        className="w-full p-2 border border-gray-300 rounded"
                                        dateFormat="dd/MM/yyyy"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
                                    <textarea
                                        name="direccion"
                                        value={editForm.direccion}
                                        onChange={handleEditInputChange}
                                        className="w-full p-2 border border-gray-300 rounded"
                                        rows="2"
                                    ></textarea>
                                </div>
                            </div>
                            <div className="flex justify-end space-x-2">
                                <button
                                    type="button"
                                    onClick={() => setEditEmployee(null)}
                                    className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                                >
                                    Actualizar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Detalle */}
            {selectedEmployee && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">{selectedEmployee.nombre || selectedEmployee.name} {selectedEmployee.apellido || selectedEmployee.lastName}</h2>
                        <div className="space-y-3 mb-4">
                            {(selectedEmployee.email) && (
                                <div className="flex items-center">
                                    <Mail className="h-5 w-5 text-gray-400 mr-2" />
                                    <span>{selectedEmployee.email}</span>
                                </div>
                            )}
                            {(selectedEmployee.telefono || selectedEmployee.telephone) && (
                                <div className="flex items-center">
                                    <Phone className="h-5 w-5 text-gray-400 mr-2" />
                                    <span>{selectedEmployee.telefono || selectedEmployee.telephone}</span>
                                </div>
                            )}
                            <div className="flex justify-between">
                                <span className="font-medium">DUI:</span>
                                <span>{selectedEmployee.dui}</span>
                            </div>
                            {(selectedEmployee.fechaNacimiento || selectedEmployee.birthday) && (
                                <div className="flex justify-between">
                                    <span className="font-medium">Fecha de Nacimiento:</span>
                                    <span>{formatDate(selectedEmployee.fechaNacimiento || selectedEmployee.birthday)}</span>
                                </div>
                            )}
                            {(selectedEmployee.fechaContratacion || selectedEmployee.hireDate) && (
                                <div className="flex justify-between">
                                    <span className="font-medium">Fecha de Contratación:</span>
                                    <span>{formatDate(selectedEmployee.fechaContratacion || selectedEmployee.hireDate)}</span>
                                </div>
                            )}
                            {(selectedEmployee.direccion || selectedEmployee.address) && (
                                <div>
                                    <span className="font-medium block mb-1">Dirección:</span>
                                    <p className="text-gray-600">{selectedEmployee.direccion || selectedEmployee.address}</p>
                                </div>
                            )}
                            {selectedEmployee.issnumber && (
                                <div className="flex justify-between">
                                    <span className="font-medium">Número ISSS:</span>
                                    <span>{selectedEmployee.issnumber}</span>
                                </div>
                            )}
                            {selectedEmployee.password && (
                                <div className="flex justify-between">
                                    <span className="font-medium">Contraseña:</span>
                                    <span>••••••••</span>
                                </div>
                            )}
                            {selectedEmployee.isVerified !== undefined && (
                                <div className="flex justify-between">
                                    <span className="font-medium">Verificado:</span>
                                    <span>{selectedEmployee.isVerified ? 'Sí' : 'No'}</span>
                                </div>
                            )}


                        </div>
                        <div className="flex justify-end">
                            <button
                                onClick={() => setSelectedEmployee(null)}
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Eliminar */}
            {deleteConfirmEmployee && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">Confirmar Eliminación</h2>
                        <p className="mb-4">
                            ¿Estás seguro de que quieres eliminar a <span className="font-bold">"{(deleteConfirmEmployee.nombre || deleteConfirmEmployee.name)} {(deleteConfirmEmployee.apellido || deleteConfirmEmployee.lastName)}"</span>? Esta acción no se puede deshacer.
                        </p>
                        <div className="flex justify-end space-x-2">
                            <button
                                onClick={() => setDeleteConfirmEmployee(null)}
                                className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleDeleteConfirm}
                                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                            >
                                Eliminar
                            </button>
                        </div>
                    </div>
                </div>
            )}



            {/* Modal Editar Empleado */}
            {editEmployee && (
                <div className="fixed z-50 inset-0 flex justify-center items-center p-4">
                    <div className="absolute inset-0 bg-black bg-opacity-30 backdrop-blur-sm"></div>
                    <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-lg z-10">
                        <h2 className="text-xl font-bold mb-4">Editar Empleado</h2>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault()
                                handleUpdate()
                            }}
                            className="space-y-4"
                        >
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                                    <input
                                        type="text"
                                        name="nombre"
                                        placeholder="Nombre"
                                        className="w-full border p-2 rounded"
                                        value={editForm.nombre}
                                        onChange={handleEditInputChange}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Apellido</label>
                                    <input
                                        type="text"
                                        name="apellido"
                                        placeholder="Apellido"
                                        className="w-full border p-2 rounded"
                                        value={editForm.apellido}
                                        onChange={handleEditInputChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email"
                                    className="w-full border p-2 rounded"
                                    value={editForm.email}
                                    onChange={handleEditInputChange}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">DUI</label>
                                    <input
                                        type="text"
                                        name="dui"
                                        placeholder="00000000-0"
                                        className="w-full border p-2 rounded"
                                        value={editForm.dui}
                                        onChange={handleEditInputChange}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                                    <input
                                        type="text"
                                        name="telefono"
                                        placeholder="Teléfono"
                                        className="w-full border p-2 rounded"
                                        value={editForm.telefono}
                                        onChange={handleEditInputChange}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Nacimiento</label>
                                    <DatePicker
                                        selected={editForm.fechaNacimiento ? new Date(editForm.fechaNacimiento) : null}
                                        onChange={(date) => setEditForm({ ...editForm, fechaNacimiento: date })}
                                        dateFormat="dd/MM/yyyy"
                                        className="w-full border p-2 rounded"
                                        placeholderText="DD/MM/AAAA"
                                        showYearDropdown
                                        dropdownMode="select"
                                        maxDate={new Date()}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Contratación</label>
                                    <DatePicker
                                        selected={editForm.fechaContratacion ? new Date(editForm.fechaContratacion) : null}
                                        onChange={(date) => setEditForm({ ...editForm, fechaContratacion: date })}
                                        dateFormat="dd/MM/yyyy"
                                        className="w-full border p-2 rounded"
                                        placeholderText="DD/MM/AAAA"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
                                <input
                                    type="text"
                                    name="direccion"
                                    placeholder="Dirección"
                                    className="w-full border p-2 rounded"
                                    value={editForm.direccion}
                                    onChange={handleEditInputChange}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Número ISSS</label>
                                    <input
                                        type="text"
                                        name="issnumber"
                                        placeholder="Número ISSS"
                                        className="w-full border p-2 rounded"
                                        value={editForm.issnumber}
                                        onChange={handleEditInputChange}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Verificado</label>
                                    <select
                                        name="isVerified"
                                        className="w-full border p-2 rounded"
                                        value={editForm.isVerified}
                                        onChange={(e) => setEditForm({ ...editForm, isVerified: e.target.value === 'true' })}
                                    >
                                        <option value="false">No</option>
                                        <option value="true">Sí</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex justify-end gap-2 mt-6">
                                <button
                                    type="button"
                                    className="px-4 py-2 rounded border text-gray-700 hover:bg-gray-50"
                                    onClick={() => {
                                        setEditEmployee(null)
                                    }}
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

        </div>
    )
}
