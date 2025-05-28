import { useState, useEffect } from 'react'

const useDataEmployee = () => {
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchEmployees = async () => {
    try {

      setLoading(true)
      setError(null)

      const response = await fetch('http://localhost:4000/api/employee')
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`)
      }
      const data = await response.json()
      setEmployees(data)

    } catch (err) {
      setError(err.message)
      console.error('Error fetching employees:', err)
    } finally {
      setLoading(false)
    }
  }

  const refreshEmployees = async () => {
    await fetchEmployees()
  }

  const addEmployee = async (employeeData) => {

    try {
      setError(null)
      const response = await fetch('hhttp://localhost:4000/api/employee', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(employeeData),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `Error: ${response.status} ${response.statusText}`)
      }

      const newEmployee = await response.json()
      setEmployees(prev => [...prev, newEmployee])
      return newEmployee
    } catch (err) {
      setError(err.message)
      console.error('Error adding employee:', err)
      throw err
    }

  }

  const updateEmployee = async (id, employeeData) => {
    try {
      setError(null)
      const response = await fetch(`http://localhost:4000/api/employee/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(employeeData),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `Error: ${response.status} ${response.statusText}`)
      }

      const updatedEmployee = await response.json()
      setEmployees(prev => prev.map(employee =>
        employee._id === id ? updatedEmployee : employee
      ))

      return updatedEmployee
    } catch (err) {
      setError(err.message)
      console.error('Error updating employee:', err)
      throw err
    }
  }

  const deleteEmployee = async (id) => {
    try {
      setError(null)
      const response = await fetch(`http://localhost:4000/api/employee/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `Error: ${response.status} ${response.statusText}`)
      }
      setEmployees(prev => prev.filter(employee => employee._id !== id))

    } catch (err) {
      setError(err.message)
      console.error('Error deleting employee:', err)
      throw err
    }

  }

  useEffect(() => {
    fetchEmployees()
  }, [])

  return {
    employees,
    loading,
    error,
    fetchEmployees,
    refreshEmployees,
    addEmployee,
    updateEmployee,
    deleteEmployee,
  }

}

 

export default useDataEmployee