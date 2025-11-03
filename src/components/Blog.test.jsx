import { render, screen } from '@testing-library/react'
import { beforeEach, expect } from 'vitest'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('<Blog />', () => {
  const blog = {
    title: 'Testing React Apps',
    author: 'Katana Kanana',
    url: 'http://blog.com',
    likes: 1090,
    user: {
      username: 'HEye',
      name: 'Hawk Eye'
    }
  }

  const user = {
    username: 'FTrot',
    name: 'Fox Trot'
  }

  const likeBlog = vi.fn()

  beforeEach(() => {
    render(<Blog blog={blog} user={user} likeBlog={likeBlog}/>)
  })

  test('renders title and author but not url and likes', () => {
    const title = screen.queryByText('Testing React Apps', { exact: false })
    const author = screen.queryByText('Katana Kanana', { exact: false })
    const url = screen.queryByText('http://blog.com')
    const likes = screen.queryByText('likes 1090')

    expect(title).toBeDefined()
    expect(author).toBeDefined()
    expect(url).toBeNull()
    expect(likes).toBeNull()
  })

  test('when details button is clicked, url and likes are shown', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('view')

    await user.click(button)

    const url = screen.queryByText('http://blog.com')
    const likes = screen.queryByText('likes 1090')

    expect(url).toBeDefined()
    expect(likes).toBeDefined()
  })

  test('when like button is clicked twice, event handler is called twice', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('view')

    await user.click(button)

    const likeButton = screen.getByText('like')

    await user.click(likeButton)
    await user.click(likeButton)

    expect(likeBlog.mock.calls).toHaveLength(2)
  })
})