import { useState } from 'react'

const AddBlogForm = ({ addBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setURL] = useState('')

  const handleTitleChange = event => {
    setTitle(event.target.value)
  }
  const handleAuthorChange = event => {
    setAuthor(event.target.value)
  }
  const handleURLChange = event => {
    setURL(event.target.value)
  }

  const handleAddBlog = event => {
    event.preventDefault()

    addBlog({ title, author, url })

    setTitle('')
    setAuthor('')
    setURL('')
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={handleAddBlog}>
        <div>
          <label>
            title:
            <input
              type="text"
              value={title}
              onChange={handleTitleChange}
            />
          </label>
        </div>
        <div>
          <label>
            author:
            <input
              type="text"
              value={author}
              onChange={handleAuthorChange}
            />
          </label>
        </div>
        <div>
          <label>
            url:
            <input
              type="url"
              value={url}
              onChange={handleURLChange}
            />
          </label>
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AddBlogForm