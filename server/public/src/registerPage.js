const registerUser = (event) => {
    event.preventDefault();

    dispatch({
      type: 'REGISTER',
      payload: {
        username: username,
        password: password,
      },
    });
  }; 

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const errors = useSelector((store) => store.errors);
  const dispatch = useDispatch();

function RegisterPage() {

  return (
    <div>

<form className="formPanel" onSubmit={registerUser}>
      <h2 style={{ margin: "5px", fontSize: "35px", textShadow: "3px 3px 3px gray"}}>Register User</h2>
      <div style={{ height: "25px", width: "100%"}}>
      {errors.loginMessage && (
        <h3 className="alert" role="alert">
          {errors.loginMessage}
        </h3>
      )}
</div>
      <div>
        <label htmlFor="username">
          <TextField
           margin="dense"
           variant="standard"
            type="text"
            name="username"
            label="username"
            value={username}
            required
            onChange={(event) => setUsername(event.target.value)}
          />
        </label>
      </div>
      <div>
        <label htmlFor="password">
          <TextField
           margin="dense"
           variant="standard"
            type="password"
            name="password"
            label="password"
            value={password}
            required
            onChange={(event) => setPassword(event.target.value)}
          />
        </label>
      </div>
      <div>
        <input className="btn" type="submit" name="submit" value="Register" />
      </div>
    </form>

      <center>
        <button
          type="button"
          className="btn btn_asLink"
          onClick={() => {
            history.push("/login");
          }}
        >
          Login
        </button>
      </center>
    </div>
  );
}



