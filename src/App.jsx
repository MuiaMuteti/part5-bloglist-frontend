import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import AddBlogForm from './components/AddBlogForm'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)

  const addBlogFormRef = useRef()

  useEffect(() => {
    const fetchBlogsAsync = async () => {
      try {
        const blogs = await blogService.getAll()
        setBlogs(blogs)
      } catch (error) {
        console.log('an error occured while fetching data:', error.message)
      }
    }
    fetchBlogsAsync()
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogListUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async event => {
    event.preventDefault()
    // console.log('logging in with', username, password)
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem(
        'loggedBlogListUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch(error) {
      console.log('invalid credentials', error.message)
      setNotification({
        type: 'error',
        message: 'Invalid username or password'
      })
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    }
  }

  const handleLogout = event => {
    window.localStorage.removeItem('loggedBlogListUser')
    setUser(null)
  }

  const addBlog = async newBlog => {
    console.log('adding', newBlog)

    addBlogFormRef.current.toggleVisibility()

    try {
      const returnedBlog = await blogService.create(newBlog)
      console.log(returnedBlog)
      setBlogs(blogs.concat(returnedBlog))

      setNotification({
        type: 'success',
        message: `a new blog ${returnedBlog.title} by ${returnedBlog.author} added`
      })
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    } catch (error) {
      console.log('unable to add new blog', error.message)
    }
  }

  const handleBlogLiking = async blogId => {
    const blog = blogs.find(b => b.id === blogId)
    console.log(blog)
    const updatedBlog = {
      ...blog,
      user: blog.user.id,
      likes: blog.likes + 1,
    }
    console.log(updatedBlog)
    try {
      const returnedBlog = await blogService.update(blogId, updatedBlog)
      console.log(returnedBlog)
      setBlogs(blogs.map(b => b.id === blogId? returnedBlog : b))
    } catch(error) {
      console.log('blog was already removed from server:', error.message)
    }
  }

  const removeBlog = async blog => {
    try {
      await blogService.remove(blog.id)
      setBlogs(blogs.filter(b => b.id !== blog.id))
      setNotification({
        type: 'success',
        message: `blog ${blog.title} by ${blog.author} removed`
      })
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    } catch (error) {
      console.log('unable to delete blog', error.message)
    }
  }

  const handleUsernameChange = event => {
    setUsername(event.target.value)
  }
  const handlePasswordChange = event => {
    setPassword(event.target.value)
  }

  const addBlogForm = () => {
    return (
      <Togglable buttonLabel="create new blog" ref={addBlogFormRef}>
        <AddBlogForm addBlog={addBlog}/>
      </Togglable>
    )
  }

  if (user === null) {
    return (
      <LoginForm
        username={username}
        password={password}
        handleLogin={handleLogin}
        handleUsernameChange={handleUsernameChange}
        handlePasswordChange={handlePasswordChange}
        notification={notification}
      />
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification notification={notification} />
      <p>{user.name} logged in <button onClick={handleLogout}>logout</button></p>
      {addBlogForm()}
      {/* display blogs in descending order */}
      {blogs
        .toSorted((a ,b) => b.likes - a.likes)
        .map(blog =>
          <Blog
            key={blog.id}
            blog={blog}
            user={user}
            likeBlog={() => handleBlogLiking(blog.id)}
            removeBlog={removeBlog}
          />
        )}
    </div>
  )
}

export default App