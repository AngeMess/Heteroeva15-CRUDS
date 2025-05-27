import React from 'react'

export default function Dashboard({ initialEmployeesData = [], initialProducts = [], initialBlogs = [] }) {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-blue-600 text-white rounded-lg p-6 shadow">
          <h2 className="text-xl font-semibold">Empleados existentes</h2>
          <p className="text-4xl mt-2">{initialEmployeesData.length}</p>
        </div>

        <div className="bg-green-600 text-white rounded-lg p-6 shadow">
          <h2 className="text-xl font-semibold">Productos existentes</h2>
          <p className="text-4xl mt-2">{initialProducts.length}</p>
        </div>

        <div className="bg-purple-600 text-white rounded-lg p-6 shadow">
          <h2 className="text-xl font-semibold">Blogs existentes</h2>
          <p className="text-4xl mt-2">{initialBlogs.length}</p>
        </div>
      </div>
    </div>
  )
}
