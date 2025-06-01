import React, { useState, useEffect } from 'react'

export default function Dashboard() {
  const [counts, setCounts] = useState({
    employees: 0,
    products: 0,
    blogs: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Fetch employees count
        const employeesResponse = await fetch('http://localhost:4000/api/employee')
        
        // Fetch products count
        const productsResponse = await fetch('http://localhost:4000/api/products')
        
        // Fetch blogs count
        const blogsResponse = await fetch('http://localhost:4000/api/blog')
        
        if (!employeesResponse.ok || !productsResponse.ok || !blogsResponse.ok) {
          throw new Error('Error fetching data')
        }
        
        const employeesData = await employeesResponse.json()
        const productsData = await productsResponse.json()
        const blogsData = await blogsResponse.json()
        
        setCounts({
          employees: employeesData.length,
          products: productsData.length,
          blogs: blogsData.length
        })
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    
    fetchCounts()
  }, [])

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      {loading ? (
        <p className="text-center text-gray-500">Cargando datos...</p>
      ) : error ? (
        <p className="text-center text-red-500">Error al cargar datos: {error}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-blue-600 text-white rounded-lg p-6 shadow">
            <h2 className="text-xl font-semibold">Empleados existentes</h2>
            <p className="text-4xl mt-2">{counts.employees}</p>
          </div>

          <div className="bg-green-600 text-white rounded-lg p-6 shadow">
            <h2 className="text-xl font-semibold">Productos existentes</h2>
            <p className="text-4xl mt-2">{counts.products}</p>
          </div>

          <div className="bg-purple-600 text-white rounded-lg p-6 shadow">
            <h2 className="text-xl font-semibold">Blogs existentes</h2>
            <p className="text-4xl mt-2">{counts.blogs}</p>
          </div>
        </div>
      )}
    </div>
  )
}
