import Notification from './Notification'

const LoginForm = (props) => (
  <div>
    <h2>log in to application</h2>
    <Notification notification={props.notification} />
    <form onSubmit={props.handleLogin}>
      <div>
        <label>
            username
          <input
            type="text"
            value={props.username}
            onChange={props.handleUsernameChange}
          />
        </label>
      </div>
      <div>
        <label>
            password
          <input
            type="password"
            value={props.password}
            onChange={props.handlePasswordChange}
          />
        </label>
      </div>
      <button type="submit">login</button>
    </form>
  </div>
)

export default LoginForm