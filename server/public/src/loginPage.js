let username = "";
let password = "";

const errors = useSelector((store) => store.errors);

const login = (event) => {
  event.preventDefault();

  const config = {
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
  };

  if (username && password) {
    axios({
      method: "POST",
      url: "/api/user/login",
      data: {
        username: username,
        password: password,
      },
      config,
    })
      .then((response) => {
        console.log("login worked?", response);
      })
      .catch((err) => {
        console.log("error logging in user", err);
      });
  } else {
    dispatch({ type: "LOGIN_INPUT_ERROR" });
  }
};

document.getElementById("loginPage").innerHTML = `
<div>
  <form className="formPanel" onSubmit={login}>
    <h2
      style={{
        margin: "5px",
        fontSize: "35px",
        textShadow: "2px 2px 2px gray",
      }}
    >
      Login
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
          required
          value={username}
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
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
      </label>
    </div>
    <div>
      <input className="btn" type="submit" name="submit" value="Log In" />
    </div>
  </form>

  <center>
    <button
      type="button"
      className="btn btn_asLink"
      onClick={() => {
        history.push("/registration");
      }}
    >
      Register
    </button>
  </center>
</div>
`;
