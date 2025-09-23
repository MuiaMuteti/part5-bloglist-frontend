import { useState } from "react"

const Blog = ({ blog, likeBlog }) => {
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

  return (
    <div style={blogStyle}>
      {blog.title} {blog.author}
      <button onClick={toggleDetailsVisibility}>{ detailsVisible? "hide": "view"}</button>
      {detailsVisible && (
        <div>
          <p>{blog.url}</p>
          <p>likes {blog.likes} <button onClick={likeBlog}>like</button></p>
          <p>{blog.user?.name}</p>
        </div>
      )}
    </div>  
  )
} 

export default Blog