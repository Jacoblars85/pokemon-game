let username = "";
let password = "";

// const errors = useSelector((store) => store.errors);

const registerUser = (event) => {
  event.preventDefault();

  axios({
    method: "POST",
    url: "/api/user/register",
    data: {
      username: username,
      password: password,
    },
  })
    .then((response) => {
      console.log("register worked?", response);
    })
    .catch((err) => {
      console.log("error registering user", err);
    });

  function* registerUser(action) {
    // clear any existing error on the registration page
    yield put({ type: "CLEAR_REGISTRATION_ERROR" });

    // automatically log a user in after registration
    yield put({ type: "LOGIN", payload: action.payload });

    // set to 'login' mode so they see the login screen
    // after registration or after they log out
    yield put({ type: "SET_TO_LOGIN_MODE" });
  }
};

document.getElementById("loginInterface").innerHTML = `
<div>
  <form className="formPanel" onSubmit={registerUser}>
    <h2
      style={{
        margin: "5px",
        fontSize: "35px",
        textShadow: "3px 3px 3px gray",
      }}
    >
      Register User
    </h2>
    <div style={{ height: "25px", width: "100%" }}>
      {errors.loginMessage && (
        <h3 className="alert" role="alert">
          {errors.loginMessage}
        </h3>
      )}
    </div>
    <div>
      <label htmlFor="username">
        <input
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
        <input
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
`;
