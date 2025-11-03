import { render, screen } from '@testing-library/react'
import { expect } from 'vitest'
import userEvent from '@testing-library/user-event'
import AddBlogForm from './AddBlogForm'

test('<AddBlogForm /> calls submit handler with the correct details', async () => {
  const blog = {
    title: 'Testing React Apps',
    author: 'Vin Helsinki',
    url: 'http://fso.com'
  }

  const addBlog = vi.fn()
  const user = userEvent.setup()

  render(<AddBlogForm addBlog={addBlog} />)

  const titleInput = screen.getByLabelText('title:')
  const authorInput = screen.getByLabelText('author:')
  const urlInput = screen.getByLabelText('url:')
  const submitButton = screen.getByText('create')

  await user.type(titleInput, blog.title)
  await user.type(authorInput, blog.author)
  await user.type(urlInput, blog.url)
  await user.click(submitButton)

  expect(addBlog.mock.calls).toHaveLength(1)
  expect(addBlog.mock.calls[0][0].title).toBe(blog.title)
  expect(addBlog.mock.calls[0][0].author).toBe(blog.author)
  expect(addBlog.mock.calls[0][0].url).toBe(blog.url)
})