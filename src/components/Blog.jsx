import { useState } from 'react'

const Blog = ({ blog, user, likeBlog, removeBlog }) => {
  const [detailsVisible, setDetailsVisible] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const toggleDetailsVisibility = () => {
    setDetailsVisible(!detailsVisible)
  }

  const handleDeleteBlog = () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      removeBlog(blog)
    }
  }

  return (
    <div className='blog' style={blogStyle}>
      {blog.title} {blog.author}
      <button onClick={toggleDetailsVisibility}>{ detailsVisible? 'hide': 'view'}</button>
      {detailsVisible && (
        <div>
          <p>{blog.url}</p>
          <p>likes {blog.likes} <button onClick={likeBlog}>like</button></p>
          <p>{blog.user?.name}</p>
          {blog.user?.username === user.username && (
            <button onClick={handleDeleteBlog}>remove</button>
          )}
        </div>
      )}
    </div>
  )
}

export default Blog