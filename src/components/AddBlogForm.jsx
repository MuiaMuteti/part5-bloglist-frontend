const AddBlogForm = (props) => (
    <div>
        <h2>create new</h2>
        <form onSubmit={props.handleAddBlog}>
            <div>
                <label>
                    title:
                    <input
                        type="text"
                        value={props.title}
                        onChange={props.handleTitleChange}
                    />
                </label>
            </div>
            <div>
                <label>
                    author:
                    <input
                        type="text"
                        value={props.author}
                        onChange={props.handleAuthorChange}
                    />
                </label>
            </div>
            <div>
                <label>
                    url:
                    <input
                        type="url"
                        value={props.url}
                        onChange={props.handleURLChange}
                    />
                </label>
            </div>
            <button type="submit">create</button>
        </form>
    </div>
)

export default AddBlogForm