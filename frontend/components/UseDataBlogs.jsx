import { useState, useEffect } from 'react'

const useDataBlog = () => {
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchBlogs = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('http://localhost:4000/api/blog')
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`)
      }
      const data = await response.json()
      setBlogs(data)

    } catch (err) {
      setError(err.message)
      console.error('Error fetching blogs:', err)
    } finally {
      setLoading(false)
    }
  }

  const refreshBlogs = async () => {
    await fetchBlogs()
  }

  const addBlog = async (blogData) => {
    try {
      setError(null)
      const response = await fetch('http://localhost:4000/api/blog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(blogData),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `Error: ${response.status} ${response.statusText}`)
      }

      const newBlog = await response.json()
      setBlogs(prev => [...prev, newBlog])
      return newBlog
    } catch (err) {
      setError(err.message)
      console.error('Error adding blog:', err)
      throw err
    }
  }

  const updateBlog = async (id, blogData) => {
    try {
      setError(null)
      const response = await fetch(`http://localhost:4000/api/blog/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(blogData),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `Error: ${response.status} ${response.statusText}`)
      }

      const updatedBlog = await response.json()
      setBlogs(prev => prev.map(blog => blog._id === id ? updatedBlog : blog))
      return updatedBlog
    } catch (err) {
      setError(err.message)
      console.error('Error updating blog:', err)
      throw err
    }
  }

  const deleteBlog = async (id) => {
    try {
      setError(null)
      const response = await fetch(`http://localhost:4000/api/blog/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `Error: ${response.status} ${response.statusText}`)
      }

      setBlogs(prev => prev.filter(blog => blog._id !== id))
    } catch (err) {
      setError(err.message)
      console.error('Error deleting blog:', err)
      throw err
    }
  }

  useEffect(() => {
    fetchBlogs()
  }, [])

  return { blogs, loading, error, addBlog, updateBlog, deleteBlog, refreshBlogs }
}

export default useDataBlog
