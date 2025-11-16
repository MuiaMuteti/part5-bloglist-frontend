const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ request, page }) => {
    await request.post('/api/tests/resets')
    await request.post('/api/users', { 
        data: {
            username: 'Ziwa',
            name: 'Ziwa Liwa',
            password: 'z1234w'
        }
    })

    await request.post('/api/users', { 
        data: {
            username: 'Rhino',
            name: 'Rhino Cerus',
            password: 'rh1234w'
        }
    })

    await page.goto('/')
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByText('log in to application')).toBeVisible()
    await expect(page.getByRole('textbox', { 'name': 'username' })).toBeVisible()
    await expect(page.getByRole('textbox', { 'name': 'password' })).toBeVisible()
    await expect(page.getByRole('button', { 'name': 'login' })).toBeVisible()
  })

  describe('login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
        await loginWith(page, 'Ziwa', 'z1234w')
        await expect(page.getByText('Ziwa Liwa logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
        await loginWith(page, 'Ziwa', 'z1234wrong')

        const errorDiv = page.locator('.error')
        await expect(errorDiv).toContainText('Invalid username or password')
        await expect(errorDiv).toHaveCSS('border-style', 'solid')
        await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')

        await expect(page.getByText('Ziwa Liwa logged in')).not.toBeVisible()
    })
  })
  describe('when logged in', () => {
    beforeEach(async ({ page }) => {
        await loginWith(page, 'Ziwa', 'z1234w')
    })

    test('a new blog can be created', async ({ page }) => {
        await createBlog(page, 'Playwright', 'Microsoft', 'https://playwright.com')
        await expect(page.getByText('Playwright Microsoft')).toBeVisible()
    })

    describe('and multiple blog exists', () => {
        beforeEach(async ({ page }) => {
            await createBlog(page, 'Playwright E2E', 'Microsoft Team', 'https://playwright.com')
            await createBlog(page, 'Cypress E2E', 'Brian Mann', 'https://cypress.io')
        })

        test('a blog can be liked',  async ({ page }) => {
            const blogElement = page.getByText('Cypress E2E Brian Mann')
            await blogElement.getByRole('button', { 'name': 'view' }).click()
            
            await expect(blogElement.getByText('likes 0')).toBeVisible()

            await blogElement.getByRole('button', { name: 'like' }).click()

            await expect(blogElement.getByText('likes 0')).not.toBeVisible()
            await expect(blogElement.getByText('likes 1')).toBeVisible()
        })

        test('a user can delete their blog', async ({ page }) => {
            const blogElement = page.getByText('Cypress E2E Brian Mann')
            await blogElement.getByRole('button', { 'name': 'view' }).click()

            page.on('dialog', dialog => dialog.accept())
            await blogElement.getByRole('button', { 'name': 'remove' }).click()

            const successDiv = page.locator('.success')
            await expect(successDiv).toContainText('blog Cypress E2E by Brian Mann removed')
            await expect(successDiv).toHaveCSS('border-style', 'solid')
            await expect(successDiv).toHaveCSS('color', 'rgb(0, 128, 0)')

            await expect(blogElement).not.toBeVisible()
        })

        test('only the user who added a blog sees the delete button', async ({ page }) => {
            // current user can see the delete button for their blog
            const blogElement = page.getByText('Cypress E2E Brian Mann')
            await blogElement.getByRole('button', { 'name': 'view' }).click()
            await expect(blogElement.getByRole('button', { 'name': 'remove' })).toBeVisible()

            // logout and login with different user
            await page.getByRole('button', { 'name': 'logout' }).click()
            await loginWith(page, 'Rhino', 'rh1234w')

            await createBlog(page, 'Selenium', 'Jason', 'https://selenium.com')
            const myBlogElement = page.getByText('Selenium Jason')
            await myBlogElement.getByRole('button', { 'name': 'view' }).click()
            await expect(myBlogElement.getByRole('button', { 'name': 'remove' })).toBeVisible()

            // can't delete blog of another user
            await blogElement.getByRole('button', { 'name': 'view' }).click()
            await expect(blogElement.getByRole('button', { 'name': 'remove' })).not.toBeVisible()
        })

        test('blogs are ordered according to number of likes', async ({ page }) => {
            const playwrightElement = page.getByText('Playwright E2E Microsoft Team')
            await playwrightElement.getByRole('button', { 'name': 'view' }).click()
            const playLikeBtn = playwrightElement.getByRole('button', { 'name': 'like' })

            const cypressElement = page.getByText('Cypress E2E Brian Mann')
            await cypressElement.getByRole('button', { 'name': 'view' }).click()
            const cypLikeBtn = cypressElement.getByRole('button', { 'name': 'like' })
            
            await cypLikeBtn.click()            
            await expect(page.locator('.blog').first()).toContainText('Cypress E2E Brian Mann')

            await playLikeBtn.click()
            await playLikeBtn.click()
            await expect(page.locator('.blog').first()).toContainText('Playwright E2E Microsoft Team')
        })
    })
  })
})